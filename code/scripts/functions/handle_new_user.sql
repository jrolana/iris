CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE
    v_metadata jsonb;
    v_request private.user_registration_requests%ROWTYPE;
    v_full_name text;
    v_role private.user_role;
    v_college_code text;
    v_other_college_name text;
    v_external_institution text;
    v_image_url text;
BEGIN
    v_metadata := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);

    SELECT *
    INTO v_request
    FROM private.user_registration_requests
    WHERE lower(email) = lower(NEW.email)
    ORDER BY
        CASE status
            WHEN 'approved' THEN 0
            WHEN 'pending' THEN 1
            ELSE 2
        END,
        requested_at DESC
    LIMIT 1;

    v_role := CASE
        WHEN v_metadata->>'role' IN ('admin', 'up-official', 'techgen')
            THEN (v_metadata->>'role')::private.user_role
        WHEN v_request.role IS NOT NULL
            THEN v_request.role
        ELSE 'techgen'::private.user_role
    END;

    v_full_name := COALESCE(
        NULLIF(v_metadata->>'name', ''),
        NULLIF(v_metadata->>'full_name', ''),
        v_request.full_name,
        split_part(NEW.email, '@', 1)
    );

    v_college_code := COALESCE(
        NULLIF(v_metadata->>'college_code', ''),
        v_request.college_code
    );
    v_other_college_name := COALESCE(
        NULLIF(v_metadata->>'other_college_name', ''),
        v_request.other_college_name
    );
    v_external_institution := COALESCE(
        NULLIF(v_metadata->>'external_institution', ''),
        v_request.external_institution
    );

    -- Keep exactly one affiliation source so users_affiliation_check passes.
    IF v_college_code IS NOT NULL AND v_college_code <> 'Other' THEN
        v_other_college_name := NULL;
        v_external_institution := NULL;
    ELSIF v_external_institution IS NOT NULL THEN
        v_college_code := NULL;
        v_other_college_name := NULL;
    ELSE
        v_college_code := NULL;
        v_external_institution := NULL;
        v_other_college_name := COALESCE(v_other_college_name, 'Unspecified');
    END IF;

    v_image_url := COALESCE(
        NULLIF(v_metadata->>'avatar_url', ''),
        NULLIF(v_metadata->>'picture', ''),
        NULLIF(v_metadata->>'image_url', '')
    );

    INSERT INTO private.users AS existing_user (
        id,
        full_name,
        email,
        role,
        external_institution,
        college_code,
        other_college_name,
        image_url
    )
    VALUES (
        NEW.id,
        v_full_name,
        NEW.email,
        v_role,
        v_external_institution,
        v_college_code,
        v_other_college_name,
        v_image_url
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        external_institution = EXCLUDED.external_institution,
        college_code = EXCLUDED.college_code,
        other_college_name = EXCLUDED.other_college_name,
        image_url = COALESCE(EXCLUDED.image_url, existing_user.image_url);

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$function$;
