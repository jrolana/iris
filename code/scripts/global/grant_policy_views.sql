GRANT SELECT ON public.v_dashboard_analytics TO authenticated, anon;

GRANT USAGE ON SCHEMA private TO anon;
GRANT SELECT ON private.ipr_applications TO anon;
GRANT SELECT ON private.ipr_statuses TO anon;
