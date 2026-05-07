CREATE OR REPLACE FUNCTION private.audit_inventors()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'private'
AS $function$
DECLARE
    v_before JSONB;
    v_after JSONB;
    v_reference TEXT;
    v_action_taken TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_reference := COALESCE(
            NULLIF(BTRIM(NEW.full_name), ''),
            NULLIF(BTRIM(NEW.email), ''),
            NEW.id::TEXT
        );

        v_action_taken := CASE
            WHEN NEW.techgen_id IS NOT NULL THEN 'Added inventor and linked technology generator'
            ELSE 'Added inventor'
        END;

        PERFORM private.log_audit_event(
            'create',
            v_action_taken,
            'success',
            'inventor',
            v_reference,
            jsonb_build_object(
                'after', jsonb_build_object(
                    'full_name', NEW.full_name,
                    'email', NEW.email,
                    'status', NEW.status,
                    'techgen_id', NEW.techgen_id,
                    'college_code', NEW.college_code,
                    'other_college_name', NEW.other_college_name,
                    'external_institution', NEW.external_institution,
                    'comments', NEW.comments
                )
            )
        );

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        v_reference := COALESCE(
            NULLIF(BTRIM(OLD.full_name), ''),
            NULLIF(BTRIM(OLD.email), ''),
            OLD.id::TEXT
        );

        v_action_taken := CASE
            WHEN OLD.techgen_id IS NOT NULL THEN 'Removed technology generator from application'
            ELSE 'Removed inventor'
        END;

        PERFORM private.log_audit_event(
            'delete',
            v_action_taken,
            'success',
            'inventor',
            v_reference,
            jsonb_build_object(
                'before', jsonb_build_object(
                    'full_name', OLD.full_name,
                    'email', OLD.email,
                    'status', OLD.status,
                    'techgen_id', OLD.techgen_id,
                    'college_code', OLD.college_code,
                    'other_college_name', OLD.other_college_name,
                    'external_institution', OLD.external_institution,
                    'comments', OLD.comments
                )
            )
        );

        RETURN OLD;
    END IF;

    v_before := jsonb_build_object(
        'full_name', OLD.full_name,
        'email', OLD.email,
        'status', OLD.status,
        'techgen_id', OLD.techgen_id,
        'college_code', OLD.college_code,
        'other_college_name', OLD.other_college_name,
        'external_institution', OLD.external_institution,
        'comments', OLD.comments
    );
    v_after := jsonb_build_object(
        'full_name', NEW.full_name,
        'email', NEW.email,
        'status', NEW.status,
        'techgen_id', NEW.techgen_id,
        'college_code', NEW.college_code,
        'other_college_name', NEW.other_college_name,
        'external_institution', NEW.external_institution,
        'comments', NEW.comments
    );

    IF v_before = v_after THEN
        RETURN NEW;
    END IF;

    v_reference := COALESCE(
        NULLIF(BTRIM(NEW.full_name), ''),
        NULLIF(BTRIM(NEW.email), ''),
        NEW.id::TEXT
    );

    v_action_taken := CASE
        WHEN OLD.techgen_id IS NULL AND NEW.techgen_id IS NOT NULL THEN
            'Linked technology generator to inventor'
        WHEN OLD.techgen_id IS NOT NULL AND NEW.techgen_id IS NULL THEN
            'Removed technology generator from inventor'
        WHEN OLD.techgen_id IS DISTINCT FROM NEW.techgen_id THEN
            'Changed linked technology generator'
        WHEN OLD.status IS DISTINCT FROM NEW.status THEN
            FORMAT('Updated inventor status to %s', NEW.status)
        ELSE
            'Updated inventor details'
    END;

    PERFORM private.log_audit_event(
        'update',
        v_action_taken,
        'success',
        'inventor',
        v_reference,
        jsonb_build_object(
            'before', v_before,
            'after', v_after
        )
    );

    RETURN NEW;
END;
$function$;
