\set ON_ERROR_STOP on

-- Run from the repository root, for example:
--   psql "$NEW_DB_URL" -f deploy/sql/remote-lab-bootstrap.psql.sql
--
-- This bootstrap targets a fresh remote Supabase project.
-- It sets up:
-- - base schema/tables/enums
-- - auth/storage-related helper functions
-- - RPCs used by the app
-- - RLS policies
-- - dashboard views
-- - app triggers
--
-- It does not deploy Edge Functions or cron jobs.

\i deploy/sql/001_base_schema.sql

\i scripts/functions/format_date.sql
\i scripts/functions/is_admin.sql
\i scripts/functions/is_up_official.sql
\i scripts/functions/check_inventor_access.sql
\i scripts/functions/check_is_published.sql
\i scripts/functions/can_access_app.sql
\i scripts/functions/log_audit_event.sql
\i scripts/functions/add_status_on_app_create.sql
\i scripts/functions/add_creator_as_inventor.sql
\i scripts/functions/handle_update_curr_status.sql
\i scripts/functions/update_updated_at.sql
\i scripts/functions/handle_new_user.sql
\i scripts/functions/handle_new_file_upload.sql
\i scripts/functions/handle_delete_file_strg.sql
\i scripts/functions/notify_status_change.sql
\i scripts/functions/notify_application_detail_change.sql
\i scripts/functions/notify_added_files.sql
\i scripts/functions/notify_deleted_files.sql
\i scripts/functions/notify_inventor_techgen_changes.sql
\i scripts/functions/notify_added_report.sql
\i scripts/functions/audit_api_tokens.sql
\i scripts/functions/audit_inventors.sql
\i scripts/functions/audit_ipr_applications.sql
\i scripts/functions/audit_ipr_files.sql
\i scripts/functions/audit_ipr_statuses.sql
\i scripts/functions/audit_pings.sql
\i scripts/functions/audit_reports.sql
\i scripts/functions/audit_user_registration_requests.sql
\i scripts/functions/audit_users.sql
\i deploy/sql/fixes/process_daily_deadline_reminders.fixed.sql
\i scripts/functions/assert_signin_allowed.sql
\i scripts/functions/create_app_with_inventors.sql
\i scripts/functions/get_user_role.sql
\i scripts/functions/search_application_rpc.sql
\i scripts/functions/search_users_for_linking.sql
\i scripts/functions/submit-registration-request.sql

\i deploy/sql/002_security_and_policies.sql
\i deploy/sql/003_views_and_triggers.sql
