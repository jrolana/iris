CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE
    v_role private.user_role;
BEGIN
    v_role := COALESCE(
        (NEW.raw_user_meta_data->>'role')::private.user_role,
        'techgen'::private.user_role
    );

    INSERT INTO private.users (id, full_name, email, role, external_institution, college_code, other_college_name)
VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    v_role,
    NEW.raw_user_meta_data->>'external_institution',
    NEW.raw_user_meta_data->>'college_code',
    NEW.raw_user_meta_data->>'other_college_name'
);

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$function$;
