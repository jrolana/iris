REVOKE USAGE ON SCHEMA private FROM anon;
REVOKE SELECT ON private.ipr_applications FROM anon;
REVOKE SELECT ON private.ipr_statuses FROM anon;

GRANT SELECT ON public.v_dashboard_analytics TO authenticated, anon;
