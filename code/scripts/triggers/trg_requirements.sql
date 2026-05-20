CREATE OR REPLACE FUNCTION private.notify_requirements_update()
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
    notif_title TEXT;
    notif_content TEXT;
BEGIN
    SELECT project_title
    INTO ip_name
    FROM private.ipr_applications
    WHERE id = NEW.application_id;

    ip_name := COALESCE(ip_name, 'Unknown application');

    FOR techgen IN
        SELECT techgen_id
        FROM private.inventors
        WHERE application_id = NEW.application_id
    LOOP
        IF techgen IS NOT NULL THEN
            receivers := array_append(receivers, techgen);
        END IF;
    END LOOP;


    IF TG_OP = 'INSERT' THEN
        -- if admin created the requirement, then notify all techgens
        notif_title := FORMAT('New Requirement for %s', ip_name);
        notif_content := FORMAT('A new requirement "%s" has been added.', NEW.requirement);
        
        
    ELSIF TG_OP = 'UPDATE' AND NEW.is_accomplished = true AND OLD.is_accomplished = false THEN
        -- requirement is checked off (could be manual from admin or upload from techgen)
        notif_title := FORMAT('Requirement Completed: %s', ip_name);
        notif_content := FORMAT('The requirement "%s" has been accomplished.', NEW.requirement);
    ELSE
        -- if it's an update but NOT checking off the requirement (e.g. fixing a typo), exit early
        RETURN NEW;
    END IF;

    -- fetch all admins
    SELECT COALESCE(array_agg(id), '{}'::UUID[])
    INTO admins
    FROM private.users
    WHERE role = 'admin';

    -- merge admins into the receivers array
    receivers := array_cat(receivers, admins);

    -- if receivers is null then cardinality returns null
    -- null > 0 is treated as false in if/else 
    IF CARDINALITY(receivers) > 0 THEN
        INSERT INTO private.notifications (receiver_id, application_id, title, content)
        SELECT DISTINCT
            r.receiver_id,
            NEW.application_id,
            notif_title,
            notif_content
        FROM unnest(receivers) AS r(receiver_id);
    END IF;

    RETURN NEW;
END;
$function$;