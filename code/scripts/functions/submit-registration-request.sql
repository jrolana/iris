CREATE OR REPLACE FUNCTION public.submit_registration_request(
    p_full_name text,
    p_email text,
    p_role text,
    p_college_code text DEFAULT NULL,
    p_other_college_name text DEFAULT NULL,
    p_external_institution text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = private
AS $$
BEGIN
    -- handles cases where it is already a user of the system
    -- can re-request if the previous requests have been rejected
    IF EXISTS (
        SELECT 1
        FROM private.users
        WHERE email = p_email
    ) THEN
        RAISE EXCEPTION 'An account with this email already exists.'
        USING ERRCODE = 'P0001';
    END IF;

    -- invite havent expired
    IF EXISTS (
        SELECT 1 
        FROM private.user_registration_requests
        WHERE email = p_email
        AND (status = 'approved' AND invite_expires_at > NOW())
    ) THEN
        RAISE EXCEPTION 'An invite has already been sent to this email.'
        USING ERRCODE = 'P0002';
    END IF;

    BEGIN
        INSERT INTO private.user_registration_requests 
            (full_name, email, role, college_code, other_college_name, external_institution, status)
        VALUES 
            (
                p_full_name,
                p_email,
                p_role::private.user_role,
                p_college_code,
                p_other_college_name,
                p_external_institution,
                'pending'
            );
    EXCEPTION
        WHEN unique_violation THEN
            RAISE EXCEPTION 'A registration request for this email is already pending approval.'
            USING ERRCODE = 'P0003';
    END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_registration_request TO anon;