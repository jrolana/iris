-- Drop the old one if you created it, to avoid confusion
DROP FUNCTION IF EXISTS create_application_with_inventors;

CREATE OR REPLACE FUNCTION public.create_application_with_inventors(
  p_project_title TEXT,
  p_ip_type private.iprtype,
  p_funding_source TEXT,
  p_inventors JSONB
)
RETURNS UUID -- Returns the id of the new app to use later
LANGUAGE plpgsql
SECURITY DEFINER -- Optional: ensures function runs with owner privileges if needed
SET search_path = private
AS $$
DECLARE
  new_app_id UUID; 
  inv JSONB;
BEGIN
  -- Create the Application in the 'private' schema
  INSERT INTO private.ipr_applications (project_title, ip_type, funding_source)
  VALUES (p_project_title, p_ip_type, p_funding_source)
  RETURNING id INTO new_app_id;

  -- Loop through inventors params and insert to the db
  FOR inv IN SELECT * FROM jsonb_array_elements(p_inventors)
  LOOP
    INSERT INTO private.inventors (application_id, full_name, email, college, external_institution)
    VALUES (
      new_app_id, 
      inv->>'full_name', 
      inv->>'email', 
      inv->>'college',
      inv->>'external_institution'
    );
  END LOOP;

  -- Return the UUID so the frontend can use it for file uploads
  RETURN new_app_id;

-- Rolls back when an error occurs in between
EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$$;