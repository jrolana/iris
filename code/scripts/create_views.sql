DROP VIEW IF EXISTS public.v_dashboard_status CASCADE;


CREATE VIEW public.v_dashboard_status
-- security_barrier for protection
-- disabled security_invoker so that this uses the
-- view's creator's privileges (security_definer)
-- hence even when anon have limited rls policy on the underlying tables of this view,
-- it can still see this view
WITH (security_barrier = true)
AS
WITH status_class AS (
    SELECT 
    a.*,
    CASE
      WHEN a.is_withdrawn = true THEN 'withdrawn'
      WHEN s.status_type = 'downgraded_to_um' THEN 'downgraded'
      WHEN s.status_type = 'registered' THEN 'granted'
      WHEN s.status_type IN (
        'filed_with_ipophil',
        'wait_registrability_report',
        'resolve_rr_defects',
        'wait_formality_exam_report',
        'resolve_fer_defects',
        'request_revival',
        'wait_notice_publication',
        'published',
        'request_substantive_exam_report',
        'wait_substantive_exam_report',
        'resolve_ser_defects',
        'wait_notice_of_issuance',
        'req_cert_of_registration',
        'wait_cert_of_registration',
        'req_for_issuance_of_cert_and_2nd_publication',
        '2nd_publication',
        'wait_notice_of_action',
        'resolve_additional_requirements',
        'mailed_to_ipophl',
        'wait_statement_of_acc',
        'pay_fee_application',
        'prepare_nice_classification',
        'approve_nice_classification'
      ) THEN 'filed'
      ELSE 'pending'
    END AS dashboard_status
  FROM private.ipr_applications AS a
  JOIN private.ipr_statuses AS s
    ON s.id = a.curr_status
)
SELECT 
  id,
  ip_type,
  dashboard_status,
  CASE dashboard_status
    WHEN 'withdrawn'   THEN updated_at
    WHEN 'downgraded'  THEN updated_at
    WHEN 'granted'     THEN registration_date::timestamptz
    WHEN 'filed'       THEN filing_date::timestamptz
    ELSE created_at
  END AS time_concerned
FROM status_class;

DROP VIEW IF EXISTS public.v_dashboard_analytics;
CREATE VIEW public.v_dashboard_analytics
WITH (security_barrier = true)
AS
SELECT 
  COUNT(*) AS total,
  ip_type,
  dashboard_status,
  EXTRACT(YEAR FROM time_concerned)::int AS year
FROM public.v_dashboard_status
WHERE time_concerned IS NOT NULL
GROUP BY ip_type, dashboard_status, EXTRACT(YEAR FROM time_concerned);

DROP VIEW IF EXISTS public.v_dashboard_analytics_techgen CASCADE;
CREATE VIEW public.v_dashboard_analytics_techgen
WITH (security_barrier = true)
AS
SELECT
  COUNT(*) AS total,
  ip_type,
  dashboard_status,
  EXTRACT(YEAR FROM time_concerned)::int AS year,
  techgen_id
FROM public.v_dashboard_status AS v_d
INNER JOIN private.inventors AS i
ON v_d.id = i.application_id
WHERE time_concerned IS NOT NULL
GROUP BY ip_type, dashboard_status, EXTRACT(YEAR FROM time_concerned), techgen_id;