DROP FUNCTION IF EXISTS public.create_application_with_inventors;

CREATE OR REPLACE FUNCTION public.create_application_with_inventors(
  p_project_title TEXT,
  p_ip_type private.iprtype,
  p_funding_source TEXT,
  p_inventors JSONB
)
RETURNS UUID -- Returns the id of the new app to use later
LANGUAGE plpgsql
SECURITY DEFINER -- Optional: ensures function runs with owner privileges if needed
SET search_path = '' -- to force references to be fully qualified/defined and to prevent malicious objects in any schema from being accidentally called instead of the intended ones
AS $$
DECLARE
  new_app_id UUID; 
  inv JSONB;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF p_inventors IS NULL OR jsonb_typeof(p_inventors) <> 'array' OR jsonb_array_length(p_inventors) = 0 THEN
    RAISE EXCEPTION 'At least one inventor is required.'
      USING ERRCODE = 'P0001';
  END IF;

  -- Create the Application in the 'private' schema
  INSERT INTO private.ipr_applications (project_title, ip_type, funding_source, created_by)
  VALUES (p_project_title, p_ip_type, p_funding_source, auth.uid())
  RETURNING id INTO new_app_id;

  -- Loop through inventors params and insert to the db
  FOR inv IN SELECT * FROM jsonb_array_elements(p_inventors)
  LOOP
    INSERT INTO private.inventors (
      application_id,
      techgen_id,
      full_name,
      email,
      college_code,
      other_college_name,
      external_institution
    )
    VALUES (
      new_app_id,
      NULLIF(inv->>'techgen_id', '')::UUID,
      inv->>'full_name',
      inv->>'email',
      NULLIF(inv->>'college_code', ''),
      NULLIF(inv->>'other_college_name', ''),
      NULLIF(inv->>'external_institution', '')
    );
  END LOOP;

  -- Return the UUID so the frontend can use it for file uploads
  RETURN new_app_id;

-- Rolls back when an error occurs in between
EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_application_with_inventors(text, private.iprtype, text, jsonb) FROM public;
REVOKE EXECUTE ON FUNCTION public.create_application_with_inventors(text, private.iprtype, text, jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_application_with_inventors(text, private.iprtype, text, jsonb) TO authenticated;
