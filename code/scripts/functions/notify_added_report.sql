CREATE OR REPLACE FUNCTION private.notify_added_report()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE
    ip_name TEXT;
    receivers UUID[] := '{}';
    admins UUID[];
BEGIN
    SELECT array_agg(id) INTO admins
    FROM private.users
    WHERE role = 'admin';

    receivers := array_cat(receivers, admins);

    SELECT ip_title INTO ip_name
    FROM private.ipr_applications
    WHERE id = NEW.application_id;

    ip_name := COALESCE(ip_name, 'Unknown application');
    
    IF CARDINALITY(receivers) > 0 THEN
        INSERT INTO private.notifications (receiver_id, application_id, title, content)
        SELECT
            unnest(receivers),
            NEW.application_id,
            FORMAT('New report for %s', ip_name),
            FORMAT('%s submitted a report against %s.', NEW.reporter_name, NEW.subject_name);
    END IF;

    RETURN NEW;
END
$function$;