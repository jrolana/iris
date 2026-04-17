CREATE OR REPLACE FUNCTION private.notify_added_files()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE
    ip_name TEXT;
    receivers UUID[] := '{}'::UUID[];
    admins UUID[] := '{}'::UUID[];
    techgen UUID;
    folder_prefix TEXT;
    last_file_name TEXT;
BEGIN
    -- get the folder prefix (appId/folderName/)
    folder_prefix := split_part(NEW.storage_path, '/', 1) || '/' || split_part(NEW.storage_path, '/', 2) || '/';

    -- check for existing files in this folder and grab the most recent one
    SELECT file_name INTO last_file_name
    FROM private.ipr_files
    WHERE storage_path LIKE folder_prefix || '%'
      AND id != NEW.id -- ignore the newly added file. if this is the first file, then there will be no match and last_file_name will be null. 
      -- otherwise, the file BEING UPDATED will be fetched
    ORDER BY uploaded_at DESC
    LIMIT 1;


    -- ensure only applicants with an account are notified
    FOR techgen IN
        SELECT techgen_id
        FROM private.inventors
        WHERE application_id = NEW.application_id
    LOOP
        IF techgen IS NOT NULL THEN
            receivers := array_append(receivers, techgen);
        END IF;
    END LOOP;

    -- if the file owner isnt an admin, notify all other techgens and all admins
    -- doesnt notify other admin if the file owner is an admin already (cleaner use case)
    IF NOT EXISTS (
        SELECT 1
        FROM private.users
        WHERE id = NEW.owner_id
          AND role = 'admin'
    ) THEN
        receivers := array_remove(receivers, NEW.owner_id);

        SELECT COALESCE(array_agg(id), '{}'::UUID[])
        INTO admins
        FROM private.users
        WHERE role = 'admin';

        receivers := array_cat(receivers, admins);
    END IF;

    SELECT project_title
    INTO ip_name
    FROM private.ipr_applications
    WHERE id = NEW.application_id;

    ip_name := COALESCE(ip_name, 'Unknown application');

    -- if receivers is null then cardinality returns null
    -- null > 0 is treated as false in if/else 
    IF CARDINALITY(receivers) > 0 THEN
        IF last_file_name IS NOT NULL THEN
            -- there are other files in the folder so this is an UPDATE
            INSERT INTO private.notifications (receiver_id, application_id, title, content)
            SELECT DISTINCT
                r.receiver_id,
                NEW.application_id,
                FORMAT('File updated in %s', ip_name),
                FORMAT('%s has been updated.', last_file_name)
            FROM unnest(receivers) AS r(receiver_id);
        ELSE
            -- no files found aside from the insert, so this is the first file
            INSERT INTO private.notifications (receiver_id, application_id, title, content)
            SELECT DISTINCT
                r.receiver_id,
                NEW.application_id,
                FORMAT('File added to %s', ip_name),
                FORMAT('%s has been added.', NEW.file_name)
            FROM unnest(receivers) AS r(receiver_id);
        END IF;
    END IF;

    RETURN NEW;
END;
$function$;