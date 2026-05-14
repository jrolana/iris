CREATE OR REPLACE FUNCTION private.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP VIEW IF EXISTS public.v_dashboard_status CASCADE;
CREATE VIEW public.v_dashboard_status
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
  WHERE a.is_archived = false
)
SELECT
  id,
  ip_type,
  dashboard_status,
  CASE dashboard_status
    WHEN 'withdrawn' THEN updated_at
    WHEN 'downgraded' THEN updated_at
    WHEN 'granted' THEN registration_date::timestamptz
    WHEN 'filed' THEN filing_date::timestamptz
    ELSE created_at
  END AS time_concerned
FROM status_class;

DROP VIEW IF EXISTS public.v_dashboard_analytics CASCADE;
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

GRANT SELECT ON public.v_dashboard_status TO authenticated;
GRANT SELECT ON public.v_dashboard_analytics TO authenticated, anon;
GRANT SELECT ON public.v_dashboard_analytics_techgen TO authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION private.handle_new_user();

DROP TRIGGER IF EXISTS trg_update_ipr_applications ON private.ipr_applications;
CREATE TRIGGER trg_update_ipr_applications
BEFORE UPDATE ON private.ipr_applications
FOR EACH ROW
EXECUTE FUNCTION private.touch_updated_at();

DROP TRIGGER IF EXISTS trg_add_status_on_create ON private.ipr_applications;
CREATE TRIGGER trg_add_status_on_create
AFTER INSERT ON private.ipr_applications
FOR EACH ROW
EXECUTE FUNCTION private.add_status_on_create();

DROP TRIGGER IF EXISTS on_application_created ON private.ipr_applications;
CREATE TRIGGER on_application_created
AFTER INSERT ON private.ipr_applications
FOR EACH ROW
EXECUTE FUNCTION private.add_creator_as_inventor();

DROP TRIGGER IF EXISTS on_add_status ON private.ipr_statuses;
CREATE TRIGGER on_add_status
AFTER INSERT ON private.ipr_statuses
FOR EACH ROW
EXECUTE FUNCTION private.update_curr_status();

DROP TRIGGER IF EXISTS trg_update_ipr_application_from_status ON private.ipr_statuses;
CREATE TRIGGER trg_update_ipr_application_from_status
AFTER INSERT OR UPDATE OR DELETE ON private.ipr_statuses
FOR EACH ROW
EXECUTE FUNCTION private.update_ipr_application_from_status();

DROP TRIGGER IF EXISTS on_file_upload ON storage.objects;
CREATE TRIGGER on_file_upload
AFTER INSERT OR UPDATE ON storage.objects
FOR EACH ROW
WHEN (NEW.bucket_id = 'ipr_files_bucket')
EXECUTE FUNCTION private.handle_new_file_upload();

DROP TRIGGER IF EXISTS on_file_delete ON private.ipr_files;
CREATE TRIGGER on_file_delete
AFTER DELETE ON private.ipr_files
FOR EACH ROW
EXECUTE FUNCTION private.remove_file_from_storage();

DROP TRIGGER IF EXISTS trg_notify_status_change ON private.ipr_statuses;
CREATE TRIGGER trg_notify_status_change
AFTER INSERT OR UPDATE ON private.ipr_statuses
FOR EACH ROW
EXECUTE FUNCTION private.notify_status_change();

DROP TRIGGER IF EXISTS trg_notify_application_detail_change ON private.ipr_applications;
CREATE TRIGGER trg_notify_application_detail_change
AFTER UPDATE ON private.ipr_applications
FOR EACH ROW
EXECUTE FUNCTION private.notify_application_detail_change();

DROP TRIGGER IF EXISTS trgy_notify_added_files ON private.ipr_files;
CREATE TRIGGER trgy_notify_added_files
AFTER INSERT ON private.ipr_files
FOR EACH ROW
EXECUTE FUNCTION private.notify_added_files();

DROP TRIGGER IF EXISTS trgy_notify_deleted_files ON private.ipr_files;
CREATE TRIGGER trgy_notify_deleted_files
AFTER DELETE ON private.ipr_files
FOR EACH ROW
EXECUTE FUNCTION private.notify_deleted_files();

DROP TRIGGER IF EXISTS trg_notify_inventor_techgen_changes ON private.inventors;
CREATE TRIGGER trg_notify_inventor_techgen_changes
AFTER INSERT OR UPDATE OR DELETE ON private.inventors
FOR EACH ROW
EXECUTE FUNCTION private.notify_inventor_techgen_changes();

DROP TRIGGER IF EXISTS trg_notify_added_report ON private.reports;
CREATE TRIGGER trg_notify_added_report
AFTER INSERT ON private.reports
FOR EACH ROW
EXECUTE FUNCTION private.notify_added_report();

DROP TRIGGER IF EXISTS trg_audit_api_tokens ON private.api_tokens;
CREATE TRIGGER trg_audit_api_tokens
AFTER INSERT ON private.api_tokens
FOR EACH ROW
EXECUTE FUNCTION private.audit_api_tokens();

DROP TRIGGER IF EXISTS on_audit_inventors ON private.inventors;
CREATE TRIGGER on_audit_inventors
AFTER INSERT OR UPDATE OR DELETE ON private.inventors
FOR EACH ROW
EXECUTE FUNCTION private.audit_inventors();

DROP TRIGGER IF EXISTS on_audit_ipr_applications ON private.ipr_applications;
CREATE TRIGGER on_audit_ipr_applications
AFTER INSERT OR UPDATE OR DELETE ON private.ipr_applications
FOR EACH ROW
EXECUTE FUNCTION private.audit_ipr_applications();

DROP TRIGGER IF EXISTS on_audit_ipr_files ON private.ipr_files;
CREATE TRIGGER on_audit_ipr_files
AFTER INSERT OR UPDATE OR DELETE ON private.ipr_files
FOR EACH ROW
EXECUTE FUNCTION private.audit_ipr_files();

DROP TRIGGER IF EXISTS on_audit_ipr_statuses ON private.ipr_statuses;
CREATE TRIGGER on_audit_ipr_statuses
AFTER INSERT OR UPDATE ON private.ipr_statuses
FOR EACH ROW
EXECUTE FUNCTION private.audit_ipr_statuses();

DROP TRIGGER IF EXISTS trg_audit_pings ON private.pings;
CREATE TRIGGER trg_audit_pings
AFTER INSERT OR UPDATE ON private.pings
FOR EACH ROW
EXECUTE FUNCTION private.audit_pings();

DROP TRIGGER IF EXISTS trg_audit_reports ON private.reports;
CREATE TRIGGER trg_audit_reports
AFTER INSERT OR UPDATE ON private.reports
FOR EACH ROW
EXECUTE FUNCTION private.audit_reports();

DROP TRIGGER IF EXISTS trg_audit_user_registration_requests ON private.user_registration_requests;
CREATE TRIGGER trg_audit_user_registration_requests
AFTER INSERT OR UPDATE ON private.user_registration_requests
FOR EACH ROW
EXECUTE FUNCTION private.audit_user_registration_requests();

DROP TRIGGER IF EXISTS on_audit_users ON private.users;
CREATE TRIGGER on_audit_users
AFTER INSERT OR UPDATE ON private.users
FOR EACH ROW
EXECUTE FUNCTION private.audit_users();
