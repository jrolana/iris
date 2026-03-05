CREATE OR REPLACE FUNCTION public.search_applications(
    p_title TEXT DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_colleges TEXT[] DEFAULT NULL,
    p_techgens TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    ip_title TEXT,
    project_title TEXT,
    status_name TEXT,
    colleges TEXT[],
    techgens TEXT[]
    ) AS $$
DECLARE
    v_is_admin BOOLEAN;
    v_is_official BOOLEAN;
    v_role TEXT;
BEGIN
    -- prefetch user roles because putting it in where would cause it to be evaluated for every row, which is inefficient.
    v_is_admin := private.is_admin();
    v_is_official := private.is_official();
    v_role := auth.role(); -- returns 'anon' for guests, 'authenticated' for logged-in users

    RETURN QUERY
    -- merge application with inventors to get the colleges and techgens in an aggregated form
    WITH expanded_inventors AS (
    -- grab all direct inventors of an application
    SELECT application_id, college_code, name
    FROM private.inventors

    UNION

    -- copy the parent's inventors (college_code and name) and stamp the child's ID on them
    SELECT child_app.id AS application_id, parent_inv.college_code, parent_inv.name
    FROM private.ipr_applications child_app
    JOIN private.inventors parent_inv ON child_app.parent_application_id = parent_inv.application_id
    WHERE child_app.parent_application_id IS NOT NULL
    ),
    -- aggregate to keep this table flat (no duplication of rows)
    app_inventors AS (
    SELECT
        application_id,
        array_agg(DISTINCT college_code) AS agg_colleges,
        array_agg(DISTINCT name) AS agg_techgens
    FROM expanded_inventors
    GROUP BY application_id
    ),
    -- merge status and app_inventor table to the main application table, and apply filters
    filtered_apps AS (
    SELECT
        app.id,
        app.ip_title,
        app.project_title,
        stat.name AS status_name, 
        COALESCE(app_inventor.agg_colleges, ARRAY[]::TEXT[]) AS colleges,
        COALESCE(app_inventor.agg_techgens, ARRAY[]::TEXT[]) AS techgens
    FROM private.ipr_applications app
    LEFT JOIN private.statuses stat ON app.curr_status = stat.id 
    LEFT JOIN app_inventors app_inventor ON app.id = app_inventor.application_id
    WHERE
        -- RLS policy-like access control:
        (
        v_is_admin                           -- Admins see all
        OR v_is_official                     -- Officials see all
        OR private.check_inventor_access(app.id) -- Inventors see their own
        OR stat.name = 'published'              -- Guests (and everyone else) see published
        
       
        -- NOTE: (v_role = 'anon' AND stat.name = 'published') means inventors cannot see published apps that they don't have access to
        -- stat.name = 'published' means that anyone can see published apps
        )
        
        -- apply filters only to the result of the access control, to avoid doing expensive operations
        AND (
        p_title IS NULL OR p_title = '' OR 
        app.ip_title ILIKE '%' || p_title || '%' OR 
        app.project_title ILIKE '%' || p_title || '%'
        )
        AND (p_status IS NULL OR p_status = '' OR s.name = p_status)
        AND (
        p_colleges IS NULL OR 
        array_length(p_colleges, 1) IS NULL OR 
        app_inventor.agg_colleges && p_colleges
        )
        AND (
        p_techgens IS NULL OR 
        array_length(p_techgens, 1) IS NULL OR 
        app_inventor.agg_techgens && p_techgens
        )
    )
    SELECT * FROM filtered_apps;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;