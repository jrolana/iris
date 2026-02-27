CREATE OR REPLACE FUNCTION private.can_access_app_files(app_id_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- admin is always allowed 
    IF (SELECT private.is_admin()) THEN
        RETURN TRUE;
    END IF;

    -- creators are also allowed
    IF EXISTS (
        SELECT 1 
        FROM private.ipr_applications 
        WHERE id::text = app_id_text AND created_by = auth.uid()
    ) THEN
        RETURN TRUE;
    END IF;

    -- use helper function
    RETURN private.check_inventor_access(app_id_text::uuid);
END;
$$;