CREATE OR REPLACE FUNCTION private.add_status_on_create()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE 
    v_status TEXT;
    default_statuses TEXT[];
BEGIN
    default_statuses := ARRAY['draft_classification', 'draft_idf'];

    FOREACH v_status IN ARRAY default_statuses LOOP
        IF EXISTS (SELECT 1 FROM private.ipr_status_types WHERE code = v_status) THEN
            INSERT INTO private.ipr_statuses (application_id, status_type)
            VALUES (NEW.id, v_status);
        --  add delay
        ELSE
            RAISE WARNING 'Cannot add status %, it does not exist in statuses table', v_status;
        END IF;
    END LOOP;

    RETURN NEW;
-- EXCEPTION
--     WHEN OTHERS THEN
--         RAISE WARNING 'Error in adding status on application creation: %', SQLERRM;
--         RETURN NEW;
END
$function$;
