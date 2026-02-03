CREATE OR REPLACE FUNCTION private.notify_deleted_files()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE
    ip_name TEXT;
    receiver UUID;
    receivers UUID[];
    admins UUID[];
BEGIN
    SELECT ip_title INTO ip_name
        FROM private.ipr_applications WHERE id = OLD.application_id;
    ip_name := COALESCE(ip_name, 'Unknown application');

    SELECT array_agg(techgen_id) INTO receivers
        FROM private.inventors WHERE application_id = OLD.application_id;
    
    -- if the file owner isnt an admin, notify all other techgens and all admins
    IF NOT EXISTS
    (
        SELECT 1
        FROM private.users
        WHERE id = OLD.owner_id
        AND role = 'admin'
    ) THEN
        receivers := array_remove(receivers, OLD.owner_id);
        SELECT array_agg(id) INTO admins FROM private.users WHERE role = 'admin';
        receivers := array_cat(receivers, admins);
    END IF;

    IF (receivers IS NOT NULL) AND array_length(receivers, 1) > 0 THEN
        INSERT INTO private.notifications (receiver_id, application_id, title, content)
        SELECT 
            unnest(receivers),
            OLD.application_id,
            FORMAT('File removed from %s', ip_name),
            FORMAT('%s has been removed.', OLD.file_name);
    END IF;

    RETURN OLD;
END
$function$