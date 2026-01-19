-- update ipr applications table when statuses table gets updated
CREATE OR REPLACE FUNCTION private.update_ipr_application_from_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
BEGIN
    UPDATE private.ipr_applications
    SET updated_at = NOW()
    WHERE id = COALESCE(NEW.application_id, OLD.application_id);
    -- NEW for INSERT/UPDATE, OLD for DELETE

    RETURN NEW;
END;
$function$;
