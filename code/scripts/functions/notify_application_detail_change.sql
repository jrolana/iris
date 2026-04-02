CREATE OR REPLACE FUNCTION private.notify_application_detail_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO private
AS $function$
DECLARE
    notif_title TEXT;
    notif_content TEXT;
    title_arr TEXT[] := ARRAY[]::TEXT[];
    content_arr TEXT[] := ARRAY[]::TEXT[];
    i INT;
    techgen UUID;
    safe_project_title TEXT;
    is_withdraw_changed BOOLEAN;
    is_archive_changed BOOLEAN;
BEGIN
    safe_project_title := COALESCE(NULLIF(BTRIM(NEW.project_title), ''), 'this application');

    IF OLD.ip_type IS DISTINCT FROM NEW.ip_type THEN
        notif_title := FORMAT('IP type changed for %s', safe_project_title);
        notif_content := FORMAT(
            'Changed from %s to %s.',
            COALESCE(OLD.ip_type::TEXT, 'none'),
            COALESCE(NEW.ip_type::TEXT, 'none')
        );
        title_arr := array_append(title_arr, notif_title);
        content_arr := array_append(content_arr, notif_content);
    END IF;

    IF OLD.ip_title IS DISTINCT FROM NEW.ip_title THEN
        notif_title := FORMAT('IP title changed for %s', safe_project_title);
        notif_content := FORMAT(
            'Changed to %s.',
            COALESCE(NULLIF(BTRIM(NEW.ip_title), ''), 'no title')
        );
        title_arr := array_append(title_arr, notif_title);
        content_arr := array_append(content_arr, notif_content);
    END IF;

    IF OLD.ip_number IS DISTINCT FROM NEW.ip_number THEN
        notif_title := FORMAT('IP number changed for %s', safe_project_title);
        notif_content := FORMAT(
            'Changed to %s.',
            COALESCE(NULLIF(BTRIM(NEW.ip_number), ''), 'no IP number')
        );
        title_arr := array_append(title_arr, notif_title);
        content_arr := array_append(content_arr, notif_content);
    END IF;

    IF OLD.filing_date IS DISTINCT FROM NEW.filing_date THEN
        notif_title := FORMAT('%s has been filed.', safe_project_title);
        notif_content := FORMAT(
            'Filed at %s.',
            COALESCE(NEW.filing_date::TEXT, 'no filing date')
        );
        title_arr := array_append(title_arr, notif_title);
        content_arr := array_append(content_arr, notif_content);
    END IF;

    IF OLD.registration_date IS DISTINCT FROM NEW.registration_date THEN
        notif_title := FORMAT('%s has been registered.', safe_project_title);
        notif_content := FORMAT(
            'Registered at %s.',
            COALESCE(NEW.registration_date::TEXT, 'no registration date')
        );
        title_arr := array_append(title_arr, notif_title);
        content_arr := array_append(content_arr, notif_content);
    END IF;

    is_archive_changed := NEW.is_archived IS DISTINCT FROM OLD.is_archived;
    is_withdraw_changed := NEW.is_withdrawn IS DISTINCT FROM OLD.is_withdrawn;

    IF is_archive_changed AND is_withdraw_changed THEN
        notif_title := FORMAT('%s status updated', safe_project_title);
        notif_content := FORMAT(
            '%s • %s',
            COALESCE(
                CASE
                    WHEN OLD.is_archived IS FALSE AND NEW.is_archived IS TRUE THEN 'Archived'
                    WHEN OLD.is_archived IS TRUE AND NEW.is_archived IS FALSE THEN 'Removed from archive'
                END,
                'Archive status updated'
            ),
            COALESCE(
                CASE
                    WHEN OLD.is_withdrawn IS FALSE AND NEW.is_withdrawn IS TRUE THEN 'Marked as withdrawn'
                    WHEN OLD.is_withdrawn IS TRUE AND NEW.is_withdrawn IS FALSE THEN 'Withdrawal removed'
                END,
                'Withdrawal status updated'
            )
        );
        title_arr := array_append(title_arr, notif_title);
        content_arr := array_append(content_arr, notif_content);

    ELSIF is_archive_changed THEN
        notif_title := FORMAT('%s archive status changed', safe_project_title);
        notif_content := CASE
            WHEN OLD.is_archived IS FALSE AND NEW.is_archived IS TRUE
                THEN 'This application has been archived.'
            WHEN OLD.is_archived IS TRUE AND NEW.is_archived IS FALSE
                THEN 'This application has been removed from archive.'
            ELSE 'Archive status updated.'
        END;
        title_arr := array_append(title_arr, notif_title);
        content_arr := array_append(content_arr, notif_content);

    ELSIF is_withdraw_changed THEN
        notif_title := FORMAT('%s withdrawal status changed', safe_project_title);
        notif_content := CASE
            WHEN OLD.is_withdrawn IS FALSE AND NEW.is_withdrawn IS TRUE
                THEN 'This application has been marked as withdrawn.'
            WHEN OLD.is_withdrawn IS TRUE AND NEW.is_withdrawn IS FALSE
                THEN 'This application is no longer marked as withdrawn.'
            ELSE 'Withdrawal status updated.'
        END;
        title_arr := array_append(title_arr, notif_title);
        content_arr := array_append(content_arr, notif_content);
    END IF;

    FOR techgen IN
        SELECT DISTINCT techgen_id
        FROM private.inventors
        WHERE application_id = NEW.id
          AND techgen_id IS NOT NULL
    LOOP
        FOR i IN 1..COALESCE(array_length(title_arr, 1), 0) LOOP
            IF title_arr[i] IS NOT NULL AND content_arr[i] IS NOT NULL THEN
                INSERT INTO private.notifications (
                    receiver_id,
                    application_id,
                    title,
                    content
                )
                VALUES (
                    techgen,
                    NEW.id,
                    title_arr[i],
                    content_arr[i]
                );
            END IF;
        END LOOP;
    END LOOP;

    RETURN NEW;
END
$function$;