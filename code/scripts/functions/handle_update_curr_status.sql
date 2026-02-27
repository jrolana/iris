CREATE OR REPLACE FUNCTION private.update_curr_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
BEGIN
  UPDATE private.ipr_applications 
  SET curr_status = NEW.id
  WHERE id = NEW.application_id;
  RETURN NEW;
END
$$;