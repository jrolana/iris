CREATE OR REPLACE FUNCTION private.audit_ipr_statuses()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'private'
AS $function$
DECLARE
    v_before JSONB;
    v_after JSONB;
    v_reference TEXT;
    v_application_id UUID;
    v_status_label TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_application_id := NEW.application_id;

        SELECT COALESCE(
            NULLIF(BTRIM(project_title), ''),
            NULLIF(BTRIM(ip_title), ''),
            id::TEXT
        )
        INTO v_reference
        FROM private.ipr_applications
        WHERE id = v_application_id;

        v_reference := COALESCE(v_reference, v_application_id::TEXT);

        IF
            NEW.status_type IN ('draft_classification', 'draft_idf')
            AND NEW.status_name IS NULL
            AND NEW.deadline IS NULL
            AND NEW.note IS NULL
        THEN
            RETURN NEW;
        END IF;

        v_status_label := COALESCE(NEW.status_name, NEW.status_type);

        PERFORM private.log_audit_event(
            'status_change',
            FORMAT('Changed application status to %s', v_status_label),
            'success',
            'application',
            v_reference,
            jsonb_build_object(
                'before', NULL,
                'after', jsonb_build_object(
                    'status_type', NEW.status_type,
                    'status_name', NEW.status_name,
                    'deadline', NEW.deadline,
                    'note', NEW.note
                )
            )
        );

        RETURN NEW;
    END IF;

    v_application_id := OLD.application_id;

    SELECT COALESCE(
        NULLIF(BTRIM(project_title), ''),
        NULLIF(BTRIM(ip_title), ''),
        id::TEXT
    )
    INTO v_reference
    FROM private.ipr_applications
    WHERE id = v_application_id;

    v_reference := COALESCE(v_reference, v_application_id::TEXT);

    v_before := jsonb_build_object(
        'status_type', OLD.status_type,
        'status_name', OLD.status_name,
        'deadline', OLD.deadline,
        'note', OLD.note
    );
    v_after := jsonb_build_object(
        'status_type', NEW.status_type,
        'status_name', NEW.status_name,
        'deadline', NEW.deadline,
        'note', NEW.note
    );

    IF v_before = v_after THEN
        RETURN NEW;
    END IF;

    IF NEW.status_type IS DISTINCT FROM OLD.status_type THEN
        v_status_label := COALESCE(NEW.status_name, NEW.status_type);

        PERFORM private.log_audit_event(
            'status_change',
            FORMAT('Changed application status to %s', v_status_label),
            'success',
            'application',
            v_reference,
            jsonb_build_object(
                'before', v_before,
                'after', v_after
            )
        );

        RETURN NEW;
    END IF;

    PERFORM private.log_audit_event(
        'update',
        'Updated application status details',
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
