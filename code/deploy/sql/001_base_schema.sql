-- Fresh remote Supabase bootstrap for the IRIS app.
-- Run through psql against a brand-new remote Supabase project.
-- This file creates the baseline schema that matches the current app types
-- and current repo behavior as closely as possible.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS private;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'private' AND t.typname = 'actionresult'
  ) THEN
    CREATE TYPE private.actionresult AS ENUM ('success', 'pending', 'failure');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'private' AND t.typname = 'actiontype'
  ) THEN
    CREATE TYPE private.actiontype AS ENUM (
      'create',
      'update',
      'delete',
      'upload',
      'status_change',
      'role_change'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'private' AND t.typname = 'inventorstatustype'
  ) THEN
    CREATE TYPE private.inventorstatustype AS ENUM ('pending', 'member', 'non-member');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'private' AND t.typname = 'iprtype'
  ) THEN
    CREATE TYPE private.iprtype AS ENUM (
      'patent',
      'utility_model',
      'industrial_design',
      'trademark',
      'copyright'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'private' AND t.typname = 'recordtype'
  ) THEN
    CREATE TYPE private.recordtype AS ENUM (
      'application',
      'document',
      'account',
      'inventor',
      'report'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'private' AND t.typname = 'registrationrequestsstatus'
  ) THEN
    CREATE TYPE private.registrationrequestsstatus AS ENUM ('pending', 'approved', 'rejected');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'private' AND t.typname = 'user_role'
  ) THEN
    CREATE TYPE private.user_role AS ENUM ('admin', 'up-official', 'techgen');
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
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS private.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  role private.user_role NOT NULL DEFAULT 'techgen',
  college_code varchar(20) NULL REFERENCES private.college_units(code),
  other_college_name text NULL,
  external_institution text NULL,
  image_url text NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT users_affiliation_check CHECK (
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
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_key
ON private.users (lower(email));

CREATE TABLE IF NOT EXISTS private.user_registration_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  role private.user_role NOT NULL,
  college_code varchar(20) NULL REFERENCES private.college_units(code),
  other_college_name text NULL,
  external_institution text NULL,
  status private.registrationrequestsstatus NOT NULL DEFAULT 'pending',
  rejection_reason text NULL,
  invite_expires_at timestamptz NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT registration_affiliation_check CHECK (
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
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_active_registration_email
ON private.user_registration_requests (lower(email))
WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS private.ipr_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_title text NULL,
  project_title text NOT NULL,
  ip_type private.iprtype NOT NULL,
  funding_source text NOT NULL,
  filing_date date NULL,
  registration_date date NULL,
  created_by uuid NULL REFERENCES private.users(id) ON DELETE SET NULL,
  ip_number text NULL,
  curr_status uuid NULL,
  parent_application_id uuid NULL REFERENCES private.ipr_applications(id) ON DELETE SET NULL,
  is_archived boolean DEFAULT false,
  is_withdrawn boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT ipr_applications_registration_after_filing CHECK (
    registration_date IS NULL OR filing_date IS NULL OR registration_date >= filing_date
  )
);

CREATE TABLE IF NOT EXISTS private.inventors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
  techgen_id uuid NULL REFERENCES private.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  college_code varchar(20) NULL REFERENCES private.college_units(code),
  other_college_name text NULL,
  external_institution text NULL,
  comments text NULL,
  status private.inventorstatustype NOT NULL DEFAULT 'member',
  CONSTRAINT inventors_application_email_key UNIQUE (application_id, email),
  CONSTRAINT inventors_affiliation_check CHECK (
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
  )
);

CREATE TABLE IF NOT EXISTS private.ipr_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
  status_type varchar(50) NOT NULL,
  deadline date NULL,
  note text NULL,
  status_name text NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT check_status_type_valid CHECK (status_type IN (
    'draft_classification',
    'draft_idf',
    'submitted_to_ttbdo',
    'under_ttbdo_review',
    'prior_art_search',
    'draft_application',
    'filed_with_ipophil',
    'wait_notice_publication',
    'wait_substantive_exam_report',
    'resolve_ser_defects',
    'downgraded_to_um',
    'wait_notice_of_issuance',
    'req_cert_of_registration',
    'wait_cert_of_registration',
    'registered',
    'published',
    'wait_formality_exam_report',
    'resolve_fer_defects',
    'request_revival',
    '2nd_publication',
    'prepare_nice_classification',
    'approve_nice_classification',
    'wait_registrability_report',
    'resolve_rr_defects',
    'techgen_sign',
    'chancellor_sign',
    'notarization',
    'wait_notice_of_action',
    'resolve_additional_requirements',
    'wait_statement_of_acc',
    'pay_fee_application',
    'mailed_to_ipophl',
    'closed'
  ))
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ipr_applications_curr_status_fkey'
      AND conrelid = 'private.ipr_applications'::regclass
  ) THEN
    ALTER TABLE private.ipr_applications
      ADD CONSTRAINT ipr_applications_curr_status_fkey
      FOREIGN KEY (curr_status)
      REFERENCES private.ipr_statuses(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS private.ipr_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES private.users(id) ON DELETE CASCADE,
  owner_name text NULL,
  uploaded_at timestamptz DEFAULT now(),
  modified_at timestamptz DEFAULT now(),
  storage_path text NOT NULL,
  file_name text NOT NULL,
  file_description text NULL,
  file_type text NOT NULL,
  comments text NULL,
  storage_id uuid NULL REFERENCES storage.objects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS private.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receiver_id uuid NOT NULL REFERENCES private.users(id) ON DELETE CASCADE,
  application_id uuid NULL REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NULL,
  read_at timestamptz NULL,
  has_email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_category_per_app_user UNIQUE (receiver_id, application_id, category)
);

CREATE TABLE IF NOT EXISTS private.api_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  token text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS private.audit_trail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_at timestamptz DEFAULT now(),
  snapshot_user_name text NOT NULL,
  snapshot_user_role text NOT NULL,
  action_type private.actiontype NOT NULL,
  action_taken text NOT NULL,
  action_result private.actionresult NOT NULL,
  record_type private.recordtype NOT NULL,
  snapshot_record_reference text NOT NULL,
  changed_fields jsonb NULL
);

CREATE TABLE IF NOT EXISTS private.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES private.ipr_applications(id),
  reporter_id uuid NULL REFERENCES private.inventors(id) ON DELETE SET NULL,
  subject_id uuid NOT NULL REFERENCES private.inventors(id) ON DELETE CASCADE,
  content text NOT NULL,
  reporter_name text NOT NULL,
  subject_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_resolved boolean DEFAULT false,
  is_meeting_initiated boolean DEFAULT false,
  CONSTRAINT unique_report_pair UNIQUE (reporter_id, subject_id, application_id),
  CONSTRAINT self_report_check CHECK (reporter_id IS NULL OR reporter_id <> subject_id)
);

CREATE TABLE IF NOT EXISTS private.pings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_delayed varchar(50) NOT NULL,
  step_delayed varchar(50) NOT NULL,
  application_name text NOT NULL,
  application_id uuid NOT NULL REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
  target_date timestamptz NOT NULL,
  acknowledged_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_active_ping
ON private.pings (application_id, stage_delayed, step_delayed)
WHERE acknowledged_at IS NULL;

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('ipr_files_bucket', 'ipr_files_bucket', false),
  ('ipr_public_resources_bucket', 'ipr_public_resources_bucket', true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE private.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.user_registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.ipr_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.inventors ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.ipr_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.ipr_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.pings ENABLE ROW LEVEL SECURITY;
