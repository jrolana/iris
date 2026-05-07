CREATE OR REPLACE FUNCTION private.audit_ipr_files()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'private'
AS $function$
DECLARE
    v_before JSONB;
    v_after JSONB;
    v_reference TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_reference := COALESCE(NEW.file_name, NEW.storage_path, NEW.id::TEXT);

        PERFORM private.log_audit_event(
            'upload',
            'Uploaded document',
            'success',
            'document',
            v_reference,
            NULL,
            p_fallback_user_name => NEW.owner_name
        );

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        v_reference := COALESCE(OLD.file_name, OLD.storage_path, OLD.id::TEXT);

        PERFORM private.log_audit_event(
            'delete',
            'Deleted document',
            'success',
            'document',
            v_reference,
            NULL,
            p_fallback_user_name => OLD.owner_name
        );

        RETURN OLD;
    END IF;

    v_before := jsonb_build_object(
        'file_name', OLD.file_name,
        'file_description', OLD.file_description,
        'file_type', OLD.file_type,
        'comments', OLD.comments
    );
    v_after := jsonb_build_object(
        'file_name', NEW.file_name,
        'file_description', NEW.file_description,
        'file_type', NEW.file_type,
        'comments', NEW.comments
    );

    IF v_before = v_after THEN
        RETURN NEW;
    END IF;

    v_reference := COALESCE(NEW.file_name, NEW.storage_path, NEW.id::TEXT);

    PERFORM private.log_audit_event(
        'update',
        'Updated document details',
        'success',
        'document',
        v_reference,
        jsonb_build_object(
            'before', v_before,
            'after', v_after
        ),
        p_fallback_user_name => NEW.owner_name
    );

    RETURN NEW;
END;
$function$;
