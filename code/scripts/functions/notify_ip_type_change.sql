CREATE OR REPLACE FUNCTION private.notify_ip_type_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
BEGIN
    IF (OLD.ip_type = NEW.ip_type) THEN
        RETURN NEW;
    END IF;

    INSERT INTO private.notifications (receiver_id, application_id, title, content)
    SELECT
        techgen_id,
        NEW.id,
        FORMAT('IP type changed for %s', NEW.ip_title),
        FORMAT('Changed from %s to %s.', OLD.ip_type, NEW.ip_type)
    FROM private.inventors WHERE application_id = NEW.id;
    
    RETURN NEW;
END
$function$;
