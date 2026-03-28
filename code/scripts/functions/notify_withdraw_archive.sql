CREATE OR REPLACE FUNCTION private.notify_withdraw_archive()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE 
    ip_name TEXT;
    title TEXT;
    content TEXT;
    receiver UUID;
    is_withdraw_changed BOOLEAN;
    is_archive_changed BOOLEAN;
BEGIN
    SELECT project_title INTO ip_name
    FROM private.ipr_applications
    WHERE id = NEW.id;

    ip_name := COALESCE(ip_name, 'Unknown project');

    is_archive_changed := NEW.is_archived IS DISTINCT FROM OLD.is_archived;
    is_withdraw_changed := NEW.is_withdrawn IS DISTINCT FROM OLD.is_withdrawn;

    FOR receiver IN
        SELECT techgen_id
        FROM private.inventors
        WHERE application_id = NEW.id
    LOOP
        IF receiver IS NOT NULL THEN
            IF is_archive_changed AND is_withdraw_changed THEN
                title := FORMAT('%s status updated', ip_name);
                content := FORMAT(
                    '%s • %s',
                    CASE
                        WHEN OLD.is_archived IS FALSE AND NEW.is_archived IS TRUE THEN 'Archived'
                        WHEN OLD.is_archived IS TRUE AND NEW.is_archived IS FALSE THEN 'Removed from archive'
                    END,
                    CASE
                        WHEN OLD.is_withdrawn IS FALSE AND NEW.is_withdrawn IS TRUE THEN 'Marked as withdrawn'
                        WHEN OLD.is_withdrawn IS TRUE AND NEW.is_withdrawn IS FALSE THEN 'Withdrawal removed'
                    END
                );

            ELSIF is_archive_changed THEN
                title := FORMAT('%s archive status changed', ip_name);
                content := CASE
                    WHEN OLD.is_archived IS FALSE AND NEW.is_archived IS TRUE
                        THEN 'This application has been archived.'
                    WHEN OLD.is_archived IS TRUE AND NEW.is_archived IS FALSE
                        THEN 'This application has been removed from archive.'
                END;

            ELSIF is_withdraw_changed THEN
                title := FORMAT('%s withdrawal status changed', ip_name);
                content := CASE
                    WHEN OLD.is_withdrawn IS FALSE AND NEW.is_withdrawn IS TRUE
                        THEN 'This application has been marked as withdrawn.'
                    WHEN OLD.is_withdrawn IS TRUE AND NEW.is_withdrawn IS FALSE
                        THEN 'This application is no longer marked as withdrawn.'
                END;
            END IF;

            INSERT INTO private.notifications (
                receiver_id,
                application_id,
                title,
                content
            )
            VALUES (
                receiver,
                NEW.id,
                title,
                content
            );
        END IF;
    END LOOP;

    RETURN NEW;
END
$function$;