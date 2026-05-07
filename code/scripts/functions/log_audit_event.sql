CREATE OR REPLACE FUNCTION private.log_audit_event(
    p_action_type private.actiontype,
    p_action_taken TEXT,
    p_action_result private.actionresult,
    p_record_type private.recordtype,
    p_snapshot_record_reference TEXT,
    p_changed_fields JSONB DEFAULT NULL,
    p_actor_user_id UUID DEFAULT auth.uid(),
    p_fallback_user_name TEXT DEFAULT NULL,
    p_fallback_user_role TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'private'
AS $function$
DECLARE
    v_snapshot_user_name TEXT;
    v_snapshot_user_role TEXT;
    v_audit_id UUID;
BEGIN
    IF p_actor_user_id IS NOT NULL THEN
        SELECT full_name, role::TEXT
        INTO v_snapshot_user_name, v_snapshot_user_role
        FROM private.users
        WHERE id = p_actor_user_id
        LIMIT 1;
    END IF;

    v_snapshot_user_name := COALESCE(
        v_snapshot_user_name,
        p_fallback_user_name,
        'Unknown User'
    );
    v_snapshot_user_role := COALESCE(
        v_snapshot_user_role,
        p_fallback_user_role,
        'Unknown Role'
    );

    INSERT INTO private.audit_trail (
        snapshot_user_name,
        snapshot_user_role,
        action_type,
        action_taken,
        action_result,
        record_type,
        snapshot_record_reference,
        changed_fields
    )
    VALUES (
        v_snapshot_user_name,
        v_snapshot_user_role,
        p_action_type,
        p_action_taken,
        p_action_result,
        p_record_type,
        p_snapshot_record_reference,
        p_changed_fields
    )
    RETURNING id INTO v_audit_id;

    RETURN v_audit_id;
END;
$function$;
