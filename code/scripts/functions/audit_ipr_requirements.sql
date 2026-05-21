CREATE OR REPLACE FUNCTION private.audit_ipr_requirements()
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
BEGIN
    IF TG_OP = 'INSERT' THEN

        PERFORM private.log_audit_event(
            'create',
            FORMAT('Added requirement'),
            'success',
            'requirement',
            NEW.requirement,
            jsonb_build_object(
                'before', NULL,
                'after', jsonb_build_object(
                    'requirement', NEW.requirement,
                    'status', NEW.status
                )
            )
        );

        RETURN NEW;
    END IF;

    v_before := jsonb_build_object(
        'requirement', OLD.requirement,
        'status', OLD.status
    );
    v_after := jsonb_build_object(
        'requirement', NEW.requirement,
        'status', NEW.status
    );

    IF v_before = v_after THEN
        RETURN NEW;
    END IF;

    -- Track status changes specifically
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        PERFORM private.log_audit_event(
            'update',
            CASE
                WHEN NEW.status = 'submitted' THEN FORMAT('Submitted requirement')
                WHEN NEW.status = 'accepted' THEN FORMAT('Accepted requirement')
                ELSE FORMAT('Updated requirement status')
            END,
            'success',
            'requirement',
            NEW.requirement,
            jsonb_build_object(
                'before', v_before,
                'after', v_after
            )
        );

        RETURN NEW;
    END IF;

    -- Fallback for general text updates to the requirement row
    PERFORM private.log_audit_event(
        'update',
        FORMAT('Updated requirement details'),
        'success',
        'requirement',
        OLD.requirement,
        jsonb_build_object(
            'before', v_before,
            'after', v_after
        )
    );

    RETURN NEW;
END;
$function$;
