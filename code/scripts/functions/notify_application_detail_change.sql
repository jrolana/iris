CREATE OR REPLACE FUNCTION private.notify_application_detail_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE
    title TEXT;
    content TEXT;
    title_arr TEXT[] := '{}';
    content_arr TEXT[] := '{}';
    i INT;
    techgen UUID;
BEGIN
    IF (OLD.ip_type IS DISTINCT FROM NEW.ip_type) THEN
        title := FORMAT('IP type changed for %s', NEW.project_title);
        content := FORMAT('Changed from %s to %s.', OLD.ip_type, NEW.ip_type);
        title_arr := array_append(title_arr, title);
        content_arr := array_append(content_arr, content);
    END IF;

    IF (OLD.ip_title IS DISTINCT FROM NEW.ip_title) THEN
        title := FORMAT('IP title changed for %s', NEW.project_title);
        content := FORMAT('Changed to %s.', NEW.ip_title);
        title_arr := array_append(title_arr, title);
        content_arr := array_append(content_arr, content);
    END IF;

    IF (OLD.ip_number IS DISTINCT FROM NEW.ip_number) THEN
        title := FORMAT('IP number changed for %s', NEW.project_title);
        content := FORMAT('Changed to %s.', NEW.ip_number);
        title_arr := array_append(title_arr, title);
        content_arr := array_append(content_arr, content);
    END IF;

    -- should work even on applications started by admins
    -- since every application has at least one inventor associated with it
    FOR techgen IN
        SELECT techgen_id FROM private.inventors WHERE application_id = NEW.id
    LOOP
        IF (techgen IS NOT NULL) THEN
            FOR i IN 1..array_length(title_arr, 1) LOOP
                INSERT INTO private.notifications (receiver_id, application_id, title, content)
                VALUES (
                    techgen,
                    NEW.id,
                    title_arr[i],
                    content_arr[i]
                );
            END LOOP;
        END IF;
    END LOOP;
    
    RETURN NEW;
END
$function$;