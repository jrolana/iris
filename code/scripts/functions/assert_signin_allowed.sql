CREATE OR REPLACE FUNCTION public.assert_signin_allowed(p_email text)
RETURNS TABLE (
    full_name text,
    email text,
    role private.user_role,
    college_code text,
    other_college_name text,
    external_institution text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = private
AS $$
BEGIN
    IF p_email IS NULL OR btrim(p_email) = '' THEN
        RAISE EXCEPTION 'We could not read your Google account email.'
        USING ERRCODE = 'P0100';
    END IF;

    RETURN QUERY
    SELECT
        u.full_name,
        u.email,
        u.role,
        u.college_code,
        u.other_college_name,
        u.external_institution
    FROM private.users AS u
    WHERE lower(u.email) = lower(p_email)
    LIMIT 1;

    IF FOUND THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        urr.full_name,
        urr.email,
        urr.role,
        urr.college_code,
        urr.other_college_name,
        urr.external_institution
    FROM private.user_registration_requests AS urr
    WHERE lower(urr.email) = lower(p_email)
      AND urr.status = 'approved'
    ORDER BY urr.requested_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        IF EXISTS (
            SELECT 1
            FROM private.user_registration_requests
            WHERE lower(email) = lower(p_email)
              AND status = 'pending'
        ) THEN
            RAISE EXCEPTION 'Your registration request is still pending approval.'
            USING ERRCODE = 'P0101';
        END IF;

        IF EXISTS (
            SELECT 1
            FROM private.user_registration_requests
            WHERE lower(email) = lower(p_email)
              AND status = 'rejected'
        ) THEN
            RAISE EXCEPTION 'Your registration request was rejected. Please contact ttbdo.upvisayas@up.edu.ph.'
            USING ERRCODE = 'P0102';
        END IF;

        RAISE EXCEPTION 'Your account isn''t registered yet. Please sign up first.'
        USING ERRCODE = 'P0103';
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.assert_signin_allowed(text) TO authenticated;
