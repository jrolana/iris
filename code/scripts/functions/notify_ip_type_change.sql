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
        'IP type changed.',
        FORMAT('The IP type of %s has changed from %s to %s', NEW.ip_title, OLD.ip_type, NEW.ip_type)
    FROM private.inventors WHERE application_id = NEW.id;
    
    RETURN NEW;
END
$function$;
