CREATE OR REPLACE FUNCTION private.add_status_on_create()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE 
    v_status VARCHAR(50), 
BEGIN
    v_status := SELECT code FROM private.statuses
        WHERE code = 'draft_classification';
    
    INSERT INTO private.statuses (application_id, status_type)
    VALUES (
        NEW.id,
        v_status
    );

    v_status := SELECT code FROM private.statuses
        WHERE code = 'draft_idf';

    INSERT INTO private.statuses (application_id, status_type)
    VALUES (
        NEW.id,
        v_status
    );

    RETURN NEW;
END
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in adding status on application creation: %', SQLERRM;
        RETURN NEW;
$function$;