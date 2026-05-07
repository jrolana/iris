CREATE OR REPLACE FUNCTION private.audit_api_tokens()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'private'
AS $function$
BEGIN
    PERFORM private.log_audit_event(
        'create',
        'Generated API token',
        'success',
        'account',
        NEW.id::TEXT,
        jsonb_build_object(
            'after', jsonb_build_object(
                'id', NEW.id,
                'created_at', NEW.created_at
            )
        )
    );

    RETURN NEW;
END;
$function$;
