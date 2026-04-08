CREATE OR REPLACE FUNCTION public.search_applications(
    p_title TEXT DEFAULT NULL,
    p_statuses TEXT[] DEFAULT NULL,
    p_colleges TEXT[] DEFAULT NULL,
    p_techgens TEXT[] DEFAULT NULL,
    p_ip_types TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    ip_title TEXT,
    project_title TEXT,
    status_type TEXT,
    inventors JSONB,           
    funding_agency TEXT, 
    ip_type TEXT,
    registration_date DATE, 
    filing_date DATE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    is_archived BOOLEAN,
    is_withdrawn BOOLEAN
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
        SELECT
            application_id,
            college_code,
            full_name,
            other_college_name,
            external_institution
        FROM private.inventors

        UNION

        -- copy the parent's inventors (college_code and name) and stamp the child's ID on them
        SELECT
            child_app.id AS application_id,
            parent_inv.college_code,
            parent_inv.full_name,
            parent_inv.other_college_name,
            parent_inv.external_institution
        FROM private.ipr_applications child_app
        JOIN private.inventors parent_inv ON child_app.parent_application_id = parent_inv.application_id
        WHERE child_app.parent_application_id IS NOT NULL
    ),
    -- aggregate to keep this table flat (no duplication of rows)
    app_inventors AS (
        SELECT
            application_id,
            -- bundle the row into a JSON object so names and colleges stay locked together
            jsonb_agg(
                jsonb_build_object(
                    'full_name', full_name,
                    'college', college_code,
                    'other_college_name', other_college_name,
                    'external_institution', external_institution
                )
            ) AS aggregated_inventors
        FROM expanded_inventors
        GROUP BY application_id
    ),
    -- merge status and app_inventor table to the main application table, and apply filters
    filtered_apps AS (
        SELECT
            app.id,
            app.ip_title,
            app.project_title,
            stat.status_type::TEXT AS status_type, 
            COALESCE(app_inventor.aggregated_inventors, '[]'::jsonb) AS inventors,
            app.funding_source AS funding_agency,
            app.ip_type::TEXT,
            app.registration_date,
            app.filing_date,
            app.created_at,
            app.updated_at,
            app.is_archived,
            app.is_withdrawn
        FROM private.ipr_applications app
        LEFT JOIN private.ipr_statuses stat ON app.curr_status = stat.id 
        LEFT JOIN app_inventors app_inventor ON app.id = app_inventor.application_id
        WHERE
            -- RLS policy-like access control:
            (
                v_is_admin                           -- Admins see all
                OR v_is_official                     -- Officials see all
                OR (private.check_inventor_access(app.id) AND NOT app.is_archived) -- Inventors see their own except archived
                OR (
                    v_role = 'anon' AND
                    stat.is_public AND
                    NOT app.is_archived AND
                    stat.status_type::TEXT != 'downgraded_to_um'
                ) -- Guests see published except archived and downgraded
                
                -- NOTE: (v_role = 'anon' AND stat.name = 'published') means inventors cannot see published apps that they don't have access to
                -- stat.name = 'published' means that anyone can see published apps
            )
            
            -- apply filters only to the result of the access control, to avoid doing expensive operations
            AND (
                p_title IS NULL OR p_title = '' OR 
                app.ip_title ILIKE '%' || p_title || '%' OR 
                app.project_title ILIKE '%' || p_title || '%'
            )
            AND (p_statuses IS NULL OR array_length(p_statuses, 1) IS NULL OR stat.status_type::TEXT = ANY(p_statuses))
            AND (
                p_colleges IS NULL OR 
                array_length(p_colleges, 1) IS NULL OR 
                EXISTS (
                    SELECT 1 
                    FROM jsonb_array_elements(COALESCE(app_inventor.aggregated_inventors, '[]'::jsonb)) AS inv 
                    WHERE inv->>'college' = ANY(p_colleges)
                )
            )
            AND (
                p_techgens IS NULL OR 
                array_length(p_techgens, 1) IS NULL OR 
                EXISTS (
                    -- Unpack the application's inventors and the user's search terms
                    SELECT 1 
                    FROM jsonb_array_elements(COALESCE(app_inventor.aggregated_inventors, '[]'::jsonb)) AS inv
                    JOIN unnest(p_techgens) AS search_term 
                        ON (inv->>'full_name') ILIKE '%' || search_term || '%'
                )
            )
            AND (
                p_ip_types IS NULL OR array_length(p_ip_types, 1) IS NULL  OR app.ip_type::TEXT = ANY(p_ip_types)
            )
    )
    SELECT * FROM filtered_apps;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;