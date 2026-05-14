CREATE OR REPLACE FUNCTION private.audit_user_registration_requests()
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
        NULLIF(BTRIM(COALESCE(NEW.full_name, OLD.full_name)), ''),
        NULLIF(BTRIM(COALESCE(NEW.email, OLD.email)), ''),
        COALESCE(NEW.id, OLD.id)::TEXT
    );

    IF TG_OP = 'INSERT' THEN
        PERFORM private.log_audit_event(
            'create',
            'Submitted registration request',
            'success',
            'account',
            v_reference,
            jsonb_build_object(
                'after', jsonb_build_object(
                    'full_name', NEW.full_name,
                    'email', NEW.email,
                    'role', NEW.role,
                    'status', NEW.status,
                    'college_code', NEW.college_code,
                    'other_college_name', NEW.other_college_name,
                    'external_institution', NEW.external_institution
                )
            )
        );

        RETURN NEW;
    END IF;

    v_before := jsonb_build_object(
        'full_name', OLD.full_name,
        'email', OLD.email,
        'role', OLD.role,
        'status', OLD.status,
        'rejection_reason', OLD.rejection_reason,
        'invite_expires_at', OLD.invite_expires_at,
        'college_code', OLD.college_code,
        'other_college_name', OLD.other_college_name,
        'external_institution', OLD.external_institution
    );
    v_after := jsonb_build_object(
        'full_name', NEW.full_name,
        'email', NEW.email,
        'role', NEW.role,
        'status', NEW.status,
        'rejection_reason', NEW.rejection_reason,
        'invite_expires_at', NEW.invite_expires_at,
        'college_code', NEW.college_code,
        'other_college_name', NEW.other_college_name,
        'external_institution', NEW.external_institution
    );

    IF v_before = v_after THEN
        RETURN NEW;
    END IF;

    v_action_taken := CASE
        WHEN OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'approved' THEN
            'Approved registration request'
        WHEN OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'rejected' THEN
            'Rejected registration request'
        WHEN OLD.role IS DISTINCT FROM NEW.role THEN
            FORMAT('Updated registration request role to %s', NEW.role)
        ELSE
            'Updated registration request details'
    END;

    PERFORM private.log_audit_event(
        'update',
        v_action_taken,
        'success',
        'account',
        v_reference,
        jsonb_build_object(
            'before', v_before,
            'after', v_after
        )
    );

    RETURN NEW;
END;
$function$;
