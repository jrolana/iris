CREATE OR REPLACE FUNCTION private.audit_ipr_applications()
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
        v_reference := COALESCE(NEW.ip_title, NEW.project_title, NEW.id::TEXT);

        PERFORM private.log_audit_event(
            'create',
            'Created application',
            'success',
            'application',
            v_reference
        );

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        v_reference := COALESCE(OLD.ip_title, OLD.project_title, OLD.id::TEXT);

        PERFORM private.log_audit_event(
            'delete',
            'Deleted application',
            'success',
            'application',
            v_reference
        );

        RETURN OLD;
    END IF;

    v_before := jsonb_build_object(
        'ip_title', OLD.ip_title,
        'project_title', OLD.project_title,
        'ip_type', OLD.ip_type,
        'funding_source', OLD.funding_source,
        'filing_date', OLD.filing_date,
        'registration_date', OLD.registration_date,
        'ip_number', OLD.ip_number,
        'parent_application_id', OLD.parent_application_id,
        'is_archived', OLD.is_archived,
        'is_withdrawn', OLD.is_withdrawn
    );
    v_after := jsonb_build_object(
        'ip_title', NEW.ip_title,
        'project_title', NEW.project_title,
        'ip_type', NEW.ip_type,
        'funding_source', NEW.funding_source,
        'filing_date', NEW.filing_date,
        'registration_date', NEW.registration_date,
        'ip_number', NEW.ip_number,
        'parent_application_id', NEW.parent_application_id,
        'is_archived', NEW.is_archived,
        'is_withdrawn', NEW.is_withdrawn
    );

    IF v_before = v_after THEN
        RETURN NEW;
    END IF;

    v_reference := COALESCE(NEW.ip_title, NEW.project_title, NEW.id::TEXT);

    PERFORM private.log_audit_event(
        'update',
        'Updated application details',
        'success',
        'application',
        v_reference,
        jsonb_build_object(
            'before', v_before,
            'after', v_after
        )
    );

    RETURN NEW;
END;
$function$;
