CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
BEGIN
    INSERT INTO private.users (uid, full_name, email, college, role)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'full_name',
            split_part(NEW.email, '@', 1)
        ),
        NEW.email,
        (NEW.raw_user_meta_data->>'college'),
        (NEW.raw_user_meta_data->>'role')::private.user_role
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$function$;
