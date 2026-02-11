CREATE OR REPLACE FUNCTION private.notify_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE 
    current_status VARCHAR(50);
    ip_name TEXT;
    title TEXT;
    content TEXT;
    receiver UUID;
    is_note_changed BOOLEAN;
    is_deadline_changed BOOLEAN;
BEGIN
    current_status := NEW.status_type;
    SELECT ip_title INTO ip_name FROM private.ipr_applications WHERE id = NEW.application_id;
    ip_name := COALESCE(ip_name, 'Unknown application');
    
    FOR receiver IN
        SELECT techgen_id FROM private.inventors WHERE application_id = NEW.application_id 
    LOOP
        IF (receiver IS NOT NULL) THEN 
            IF (TG_OP = 'INSERT') THEN
                title := FORMAT('Status updated for %s', ip_name);
                content := FORMAT('Status is now: %s.', current_status);

            ELSIF (TG_OP = 'UPDATE') THEN
                title := FORMAT('Status updated for %s', ip_name);

                is_note_changed := NEW.note IS DISTINCT FROM OLD.note;
                is_deadline_changed := NEW.deadline IS DISTINCT FROM OLD.deadline;

                IF is_note_changed AND is_deadline_changed THEN
                    content := FORMAT('Note and deadline updated for %s.', current_status);
                ELSIF is_note_changed THEN
                    content := FORMAT('Note updated for %s.', current_status);
                ELSIF is_deadline_changed THEN
                    content := FORMAT('Deadline updated for %s.', current_status);
                END IF;
            END IF;
                
            INSERT INTO private.notifications (receiver_id, application_id, title, content)
                VALUES (receiver, NEW.application_id, title, content);
        END IF;
    END LOOP;

    RETURN NEW;
END
$function$;