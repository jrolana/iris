CREATE OR REPLACE FUNCTION private.check_inventor_access(target_app_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = private, public
AS $$
DECLARE
    v_parent_id uuid;
    v_has_access boolean;
BEGIN
    -- get parent id
    SELECT parent_application_id INTO v_parent_id 
    FROM private.ipr_applications 
    WHERE id = target_app_id;

    -- check if auth.uid() is in either app_id or parent_id
    SELECT EXISTS (
        SELECT 1 
        FROM private.inventors
        WHERE techgen_id = auth.uid()
        AND (application_id = target_app_id OR application_id = v_parent_id)
    ) INTO v_has_access;

    RETURN v_has_access;
END;
$$;