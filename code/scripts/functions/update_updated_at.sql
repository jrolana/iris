CREATE OR REPLACE FUNCTION private.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.* IS DISTINCT FROM OLD.* THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$function$;

-- update ipr applications table when statuses table gets updated
CREATE OR REPLACE FUNCTION private.update_ipr_application_from_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE private.ipr_applications
    SET updated_at = NOW()
    WHERE id = COALESCE(NEW.application_id, OLD.application_id);
    -- NEW for INSERT/UPDATE, OLD for DELETE

    RETURN NEW;
END;
$function$;
