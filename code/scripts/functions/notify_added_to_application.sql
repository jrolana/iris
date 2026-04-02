CREATE OR REPLACE FUNCTION private.notify_added_to_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE 
    ip_name TEXT;
    title TEXT;
    content TEXT;
BEGIN
    SELECT project_title INTO ip_name
    FROM private.ipr_applications
    WHERE id = NEW.application_id;

    ip_name := COALESCE(ip_name, 'Unknown project');

    IF (TG_OP = 'INSERT' AND NEW.techgen_id IS NOT NULL)
    OR (TG_OP = 'UPDATE' AND OLD.techgen_id IS NULL AND NEW.techgen_id IS NOT NULL) THEN
        title := FORMAT('Added to %s', ip_name);
        content := 'You have been added as an inventor to this application.';
        INSERT INTO private.notifications (
            receiver_id,
            application_id,
            title,
            content
        )
        VALUES (
            NEW.techgen_id,
            NEW.application_id,
            title,
            content
        );
    END IF;

    RETURN NEW;
END
$function$;