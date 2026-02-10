CREATE OR REPLACE FUNCTION private.notify_added_files()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE
    ip_name TEXT;
    receivers UUID[]:= '{}';
    admins UUID[];
    techgen UUID;
BEGIN
    -- ensure only applicants with an account are notified
    FOR techgen IN
        SELECT techgen_id FROM private.inventors WHERE application_id = NEW.application_id
    LOOP
        IF (techgen IS NOT NULL) THEN
            receivers := array_append(receivers, techgen);
        END IF;
    END LOOP;
    
    -- if the file owner isnt an admin, notify all other techgens and all admins
    -- doesnt notify other admin if the file owner is an admin already (cleaner use case)
    IF NOT EXISTS
    (
        SELECT 1
        FROM private.users
        WHERE id = NEW.owner_id
        AND role = 'admin'
    ) THEN
        receivers := array_remove(receivers, NEW.owner_id);
        SELECT array_agg(id) INTO admins FROM private.users WHERE role = 'admin';
        receivers := array_cat(receivers, admins);
    END IF;

    SELECT ip_title INTO ip_name
        FROM private.ipr_applications WHERE id = NEW.application_id;
    ip_name := COALESCE(ip_name, 'Unknown application');

    IF (receivers IS NOT NULL) AND array_length(receivers, 1) > 0 THEN
        INSERT INTO private.notifications (receiver_id, application_id, title, content)
        SELECT 
            unnest(receivers),
            NEW.application_id,
            FORMAT('File added to %s', ip_name),
            FORMAT('%s has been added.', NEW.file_name);
    END IF;

    RETURN NEW;
END
$function$