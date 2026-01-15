CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'private'
AS $function$
DECLARE 
    v_role text;
BEGIN
    SELECT role
    INTO v_role
    FROM private.users
    WHERE uid = auth.uid()
    limit 1;

    return v_role;
END;
$function$;