\set ON_ERROR_STOP on

-- Catch-up migration for an existing remote Supabase project.
--
-- Use this when the remote project already exists and has data you want to keep.
-- Unlike remote-lab-bootstrap.psql.sql, this script avoids recreating the whole
-- schema and instead patches older projects up to the current repo layout.
--
-- Recommended:
-- 1. take a Supabase backup or VM snapshot first
-- 2. run this with psql from the repository root
--
-- Example:
--   psql "$EXISTING_DB_URL" -f deploy/sql/catchup-existing-project.psql.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS private;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'private' AND t.typname = 'requirementstatustype'
  ) THEN
    CREATE TYPE private.requirementstatustype AS ENUM (
      'pending',
      'submitted',
      'accepted'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'private' AND t.typname = 'recordtype'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'private'
      AND t.typname = 'recordtype'
      AND e.enumlabel = 'requirement'
  ) THEN
    ALTER TYPE private.recordtype ADD VALUE 'requirement';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS private.college_units (
  code varchar(20) PRIMARY KEY,
  full_name text NOT NULL
);

INSERT INTO private.college_units (code, full_name) VALUES
  ('CAS', 'College of Arts and Sciences'),
  ('CAS-Bio', 'CAS - Biology'),
  ('CAS-Chem', 'CAS - Chemistry'),
  ('CAS-DPSM', 'CAS - Division of Physical Sciences and Mathematics'),
  ('CFOS', 'College of Fisheries and Ocean Sciences'),
  ('CFOS-IA', 'CFOS - Institute of Aquaculture'),
  ('CFOS-IFPT', 'CFOS - Institute of Fish Processing Technology'),
  ('CFOS-IMFO', 'CFOS - Institute of Marine Fisheries and Oceanology'),
  ('SoTech', 'School of Technology'),
  ('SoTech-ChE', 'SoTech - Chemical Engineering'),
  ('SoTech-FT', 'SoTech - Food Technology'),
  ('NIMBB', 'National Institute of Molecular Biology and Biotechnology'),
  ('RRC', 'Regional Research Center'),
  ('TTBDO', 'Technology Transfer and Business Development Office'),
  ('UPHSI', 'UP Health Services Unit'),
  ('UPV', 'University of the Philippines Visayas'),
  ('UPVGS', 'UP Visayas Graduate School'),
  ('Other', 'Other / External')
ON CONFLICT (code) DO UPDATE
SET full_name = EXCLUDED.full_name;

ALTER TABLE private.users
  ADD COLUMN IF NOT EXISTS college_code varchar(20),
  ADD COLUMN IF NOT EXISTS other_college_name text,
  ADD COLUMN IF NOT EXISTS external_institution text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

ALTER TABLE private.inventors
  ADD COLUMN IF NOT EXISTS college_code varchar(20),
  ADD COLUMN IF NOT EXISTS other_college_name text,
  ADD COLUMN IF NOT EXISTS external_institution text;

CREATE TABLE IF NOT EXISTS private.user_registration_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  role private.user_role NOT NULL,
  college_code varchar(20) NULL,
  other_college_name text NULL,
  external_institution text NULL,
  status private.registrationrequestsstatus NOT NULL DEFAULT 'pending',
  rejection_reason text NULL,
  invite_expires_at timestamptz NULL,
  requested_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE private.user_registration_requests
  ADD COLUMN IF NOT EXISTS college_code varchar(20),
  ADD COLUMN IF NOT EXISTS other_college_name text,
  ADD COLUMN IF NOT EXISTS external_institution text,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS invite_expires_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_users_collegecode'
      AND conrelid = 'private.users'::regclass
  ) THEN
    ALTER TABLE private.users
      ADD CONSTRAINT fk_users_collegecode
      FOREIGN KEY (college_code)
      REFERENCES private.college_units(code);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_inventor_collegecode'
      AND conrelid = 'private.inventors'::regclass
  ) THEN
    ALTER TABLE private.inventors
      ADD CONSTRAINT fk_inventor_collegecode
      FOREIGN KEY (college_code)
      REFERENCES private.college_units(code);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_registration_requests_college_code_fkey'
      AND conrelid = 'private.user_registration_requests'::regclass
  ) THEN
    ALTER TABLE private.user_registration_requests
      ADD CONSTRAINT user_registration_requests_college_code_fkey
      FOREIGN KEY (college_code)
      REFERENCES private.college_units(code);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'private'
      AND table_name = 'users'
      AND column_name = 'college'
  ) THEN
    EXECUTE $sql$
      UPDATE private.users
      SET college_code = college
      WHERE college_code IS NULL
        AND college IS NOT NULL
        AND college <> 'Other'
    $sql$;

    EXECUTE $sql$
      UPDATE private.users
      SET other_college_name = COALESCE(other_college_name, 'Unspecified')
      WHERE college = 'Other'
        AND college_code IS NULL
        AND external_institution IS NULL
    $sql$;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'private'
      AND table_name = 'inventors'
      AND column_name = 'college'
  ) THEN
    EXECUTE $sql$
      UPDATE private.inventors
      SET college_code = college
      WHERE college_code IS NULL
        AND college IS NOT NULL
        AND college <> 'Other'
    $sql$;

    EXECUTE $sql$
      UPDATE private.inventors
      SET other_college_name = COALESCE(other_college_name, 'Unspecified')
      WHERE college = 'Other'
        AND college_code IS NULL
        AND external_institution IS NULL
    $sql$;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_key
ON private.users (lower(email));

CREATE UNIQUE INDEX IF NOT EXISTS unique_active_registration_email
ON private.user_registration_requests (lower(email))
WHERE status = 'pending';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_affiliation_check'
      AND conrelid = 'private.users'::regclass
  ) THEN
    ALTER TABLE private.users
      ADD CONSTRAINT users_affiliation_check
      CHECK (
        (
          college_code IS NOT NULL
          AND other_college_name IS NULL
          AND external_institution IS NULL
        )
        OR (
          college_code IS NULL
          AND other_college_name IS NOT NULL
          AND external_institution IS NULL
        )
        OR (
          college_code IS NULL
          AND other_college_name IS NULL
          AND external_institution IS NOT NULL
        )
      ) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'inventors_affiliation_check'
      AND conrelid = 'private.inventors'::regclass
  ) THEN
    ALTER TABLE private.inventors
      ADD CONSTRAINT inventors_affiliation_check
      CHECK (
        (
          college_code IS NOT NULL
          AND other_college_name IS NULL
          AND external_institution IS NULL
        )
        OR (
          college_code IS NULL
          AND other_college_name IS NOT NULL
          AND external_institution IS NULL
        )
        OR (
          college_code IS NULL
          AND other_college_name IS NULL
          AND external_institution IS NOT NULL
        )
      ) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'registration_affiliation_check'
      AND conrelid = 'private.user_registration_requests'::regclass
  ) THEN
    ALTER TABLE private.user_registration_requests
      ADD CONSTRAINT registration_affiliation_check
      CHECK (
        (
          college_code IS NOT NULL
          AND other_college_name IS NULL
          AND external_institution IS NULL
        )
        OR (
          college_code IS NULL
          AND other_college_name IS NOT NULL
          AND external_institution IS NULL
        )
        OR (
          college_code IS NULL
          AND other_college_name IS NULL
          AND external_institution IS NOT NULL
        )
      ) NOT VALID;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS private.ipr_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  application_id uuid NOT NULL REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
  requirement text NOT NULL,
  storage_id uuid NULL REFERENCES storage.objects(id) ON DELETE SET NULL,
  status private.requirementstatustype NOT NULL DEFAULT 'pending',
  CONSTRAINT ipr_requirements_app_req_unique UNIQUE (application_id, requirement)
);

ALTER TABLE private.user_registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.ipr_requirements ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA private TO authenticated, service_role;
GRANT ALL ON TABLE private.ipr_requirements TO authenticated, service_role;
REVOKE ALL ON TABLE private.ipr_requirements FROM anon;

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
\i scripts/functions/notify_requirements.sql
\i scripts/functions/audit_ipr_requirements.sql

\i deploy/sql/002_security_and_policies.sql
\i deploy/sql/003_views_and_triggers.sql

DROP POLICY IF EXISTS "Admins and inventors view requirements" ON private.ipr_requirements;
CREATE POLICY "Admins and inventors view requirements"
ON private.ipr_requirements
FOR SELECT
TO authenticated
USING (
  private.is_admin()
  OR private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Admins add requirements" ON private.ipr_requirements;
CREATE POLICY "Admins add requirements"
ON private.ipr_requirements
FOR INSERT
TO authenticated
WITH CHECK (private.is_admin());

DROP POLICY IF EXISTS "Admins and inventors update requirements" ON private.ipr_requirements;
CREATE POLICY "Admins and inventors update requirements"
ON private.ipr_requirements
FOR UPDATE
TO authenticated
USING (
  private.is_admin()
  OR private.check_inventor_access(application_id)
)
WITH CHECK (
  private.is_admin()
  OR private.check_inventor_access(application_id)
);

DROP POLICY IF EXISTS "Admins delete requirements" ON private.ipr_requirements;
CREATE POLICY "Admins delete requirements"
ON private.ipr_requirements
FOR DELETE
TO authenticated
USING (private.is_admin());

DROP TRIGGER IF EXISTS on_requirement_change ON private.ipr_requirements;
CREATE TRIGGER on_requirement_change
AFTER INSERT OR UPDATE ON private.ipr_requirements
FOR EACH ROW
EXECUTE FUNCTION private.notify_requirements_update();

DROP TRIGGER IF EXISTS audit_requirements_changes ON private.ipr_requirements;
CREATE TRIGGER audit_requirements_changes
AFTER INSERT OR UPDATE ON private.ipr_requirements
FOR EACH ROW
EXECUTE FUNCTION private.audit_ipr_requirements();
