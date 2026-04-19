CREATE OR REPLACE FUNCTION private.notify_inventor_techgen_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE 
    v_ip_name TEXT;
    v_title TEXT;
    v_content TEXT;
    target_techgen UUID;
    v_application_id UUID;
    removed_techgen_name TEXT;
BEGIN
    v_application_id := CASE
        WHEN TG_OP = 'DELETE' THEN OLD.application_id
        ELSE NEW.application_id
    END;

    v_ip_name := COALESCE(
        (
            SELECT project_title
            FROM private.ipr_applications
            WHERE id = v_application_id
            LIMIT 1
        ),
        'Unknown project'
    );


    IF TG_OP = 'INSERT' AND NEW.techgen_id IS NOT NULL THEN
        v_title := FORMAT('Added to %s', v_ip_name);
        v_content := 'You have been added as an inventor to this application.';
        INSERT INTO private.notifications (
            receiver_id,
            application_id,
            title,
            content
        )
        VALUES (
            NEW.techgen_id,
            v_application_id,
            v_title,
            v_content
        );

        RETURN NEW;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        IF OLD.techgen_id IS NULL AND NEW.techgen_id IS NOT NULL THEN
            v_title := FORMAT('Added to %s', v_ip_name);
            v_content := 'You have been added as an inventor to this application.';
            INSERT INTO private.notifications (
                receiver_id,
                application_id,
                title,
                content
            )
            VALUES (
                NEW.techgen_id,
                v_application_id,
                v_title,
                v_content
            );
        END IF;

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' AND OLD.techgen_id IS NOT NULL THEN
        removed_techgen_name := COALESCE(OLD.full_name, 'A technology generator');
        v_title := FORMAT('Technology generator removed from %s', v_ip_name);
        v_content := FORMAT('%s is no longer listed as a technology generator on this application.', removed_techgen_name);

        FOR target_techgen IN
            SELECT DISTINCT techgen_id
            FROM private.inventors
            WHERE application_id = v_application_id
              AND techgen_id IS NOT NULL
              AND techgen_id <> OLD.techgen_id
        LOOP
            INSERT INTO private.notifications (
                receiver_id,
                application_id,
                title,
                content
            )
            VALUES (
                target_techgen,
                v_application_id,
                v_title,
                v_content
            );
        END LOOP;

        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$function$;
