CREATE OR REPLACE FUNCTION private.audit_reports()
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
    v_reference := COALESCE(
        NULLIF(BTRIM(COALESCE(NEW.subject_name, OLD.subject_name)), ''),
        COALESCE(NEW.subject_id, OLD.subject_id)::TEXT
    );

    IF TG_OP = 'INSERT' THEN
        PERFORM private.log_audit_event(
            'create',
            'Filed report',
            'success',
            'report',
            v_reference,
            jsonb_build_object(
                'after', jsonb_build_object(
                    'application_id', NEW.application_id,
                    'reporter_id', NEW.reporter_id,
                    'reporter_name', NEW.reporter_name,
                    'subject_id', NEW.subject_id,
                    'subject_name', NEW.subject_name,
                    'content', NEW.content,
                    'is_resolved', NEW.is_resolved,
                    'is_meeting_initiated', NEW.is_meeting_initiated
                )
            )
        );

        RETURN NEW;
    END IF;

    v_before := jsonb_build_object(
        'application_id', OLD.application_id,
        'reporter_id', OLD.reporter_id,
        'reporter_name', OLD.reporter_name,
        'subject_id', OLD.subject_id,
        'subject_name', OLD.subject_name,
        'content', OLD.content,
        'is_resolved', OLD.is_resolved,
        'is_meeting_initiated', OLD.is_meeting_initiated
    );
    v_after := jsonb_build_object(
        'application_id', NEW.application_id,
        'reporter_id', NEW.reporter_id,
        'reporter_name', NEW.reporter_name,
        'subject_id', NEW.subject_id,
        'subject_name', NEW.subject_name,
        'content', NEW.content,
        'is_resolved', NEW.is_resolved,
        'is_meeting_initiated', NEW.is_meeting_initiated
    );

    IF v_before = v_after THEN
        RETURN NEW;
    END IF;

    v_action_taken := CASE
        WHEN COALESCE(OLD.is_resolved, FALSE) = FALSE AND COALESCE(NEW.is_resolved, FALSE) = TRUE THEN
            'Resolved report'
        WHEN COALESCE(OLD.is_meeting_initiated, FALSE) = FALSE
            AND COALESCE(NEW.is_meeting_initiated, FALSE) = TRUE THEN
            'Initiated report meeting'
        ELSE
            'Updated report details'
    END;

    PERFORM private.log_audit_event(
        'update',
        v_action_taken,
        'success',
        'report',
        v_reference,
        jsonb_build_object(
            'before', v_before,
            'after', v_after
        )
    );

    RETURN NEW;
END;
$function$;
