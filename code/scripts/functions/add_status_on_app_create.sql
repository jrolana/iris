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

    FOREACH v_status IN ARRAY default_statuses LOOP
        INSERT INTO private.ipr_statuses (application_id, status_type, created_at)
            VALUES (NEW.id, v_status, NOW() + (v_index * interval '1 second'));
        v_index := v_index + 1;
    END LOOP;

    RETURN NEW;
END
$function$;
