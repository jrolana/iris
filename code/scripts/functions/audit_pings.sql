CREATE OR REPLACE FUNCTION private.audit_pings()
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
        NULLIF(BTRIM(COALESCE(NEW.application_name, OLD.application_name)), ''),
        COALESCE(NEW.application_id, OLD.application_id)::TEXT
    );

    IF TG_OP = 'INSERT' THEN
        PERFORM private.log_audit_event(
            'create',
            'Created delay ping',
            'success',
            'application',
            v_reference,
            jsonb_build_object(
                'after', jsonb_build_object(
                    'application_id', NEW.application_id,
                    'stage_delayed', NEW.stage_delayed,
                    'step_delayed', NEW.step_delayed,
                    'target_date', NEW.target_date,
                    'acknowledged_at', NEW.acknowledged_at
                )
            )
        );

        RETURN NEW;
    END IF;

    v_before := jsonb_build_object(
        'application_id', OLD.application_id,
        'application_name', OLD.application_name,
        'stage_delayed', OLD.stage_delayed,
        'step_delayed', OLD.step_delayed,
        'target_date', OLD.target_date,
        'acknowledged_at', OLD.acknowledged_at
    );
    v_after := jsonb_build_object(
        'application_id', NEW.application_id,
        'application_name', NEW.application_name,
        'stage_delayed', NEW.stage_delayed,
        'step_delayed', NEW.step_delayed,
        'target_date', NEW.target_date,
        'acknowledged_at', NEW.acknowledged_at
    );

    IF v_before = v_after THEN
        RETURN NEW;
    END IF;

    v_action_taken := CASE
        WHEN OLD.acknowledged_at IS NULL AND NEW.acknowledged_at IS NOT NULL THEN
            'Acknowledged delay ping'
        ELSE
            'Updated delay ping'
    END;

    PERFORM private.log_audit_event(
        'update',
        v_action_taken,
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
