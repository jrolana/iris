CREATE OR REPLACE FUNCTION private.audit_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'private'
AS $function$
DECLARE
    v_reference TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_reference := COALESCE(NEW.full_name, NEW.email, NEW.id::TEXT);

        PERFORM private.log_audit_event(
            'create',
            'Created account',
            'success',
            'account',
            v_reference,
            NULL,
            auth.uid(),
            NEW.full_name,
            NEW.role::TEXT
        );

        RETURN NEW;
    END IF;

    IF NEW.role IS NOT DISTINCT FROM OLD.role THEN
        RETURN NEW;
    END IF;

    v_reference := COALESCE(NEW.full_name, NEW.email, NEW.id::TEXT);

    PERFORM private.log_audit_event(
        'role_change',
        FORMAT('Changed role from %s to %s', OLD.role, NEW.role),
        'success',
        'account',
        v_reference,
        jsonb_build_object(
            'before', jsonb_build_object('role', OLD.role),
            'after', jsonb_build_object('role', NEW.role)
        ),
        auth.uid(),
        NEW.full_name,
        NEW.role::TEXT
    );

    RETURN NEW;
END;
$function$;
