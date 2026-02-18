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
    INSERT INTO private.user_registration_requests 
        (full_name, email, role, college_code, other_college_name, external_institution, status, approved_at)
    VALUES 
        (
            p_full_name,
            p_email,
            p_role::private.user_role,
            p_college_code,
            p_other_college_name,
            p_external_institution,
            'pending',
            NULL);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_registration_request TO anon;