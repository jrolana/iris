CREATE OR REPLACE FUNCTION private.add_status_on_create()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE 
    v_status TEXT;
    default_statuses TEXT[];
    v_index INT := 0;
BEGIN
    default_statuses := ARRAY['draft_classification', 'draft_idf'];

    -- check if it downgraded or not
    -- downgraded apps always has a parent id while new apps always have null
    IF NEW.parent_application_id IS NULL THEN
        FOREACH v_status IN ARRAY default_statuses LOOP
            INSERT INTO private.ipr_statuses (application_id, status_type, created_at)
                VALUES (NEW.id, v_status, NOW() + (v_index * interval '1 second'));
            v_index := v_index + 1;
        END LOOP;
    END IF;

    RETURN NEW;
END
$function$;
