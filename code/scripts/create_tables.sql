-- FROM: src/lib/types/ip.ts
CREATE TYPE private.statusType AS ENUM (
  'draft_classification',
  'draft_idf',
  'submitted_to_ttbdo',
  'under_ttbdo_review',
  'prior_art_search',
  'draft_application',
  'filed_with_ipophil',
  'under_examination',
  'wait_notice_publication',
  'wait_registrability_report',
  'wait_formality_exam_report',
  'wait_substantive_exam_report',
  'prepare_nice_classification',
  'approve_nice_classification',
  'resolve_ser_defects',
  'resolve_fer_defects',
  'resolve_rr_defects',
  'resolve_additional_requirements',
  'request_revival',
  'downgraded_to_um',
  'registered',
  'closed'
)

CREATE TABLE private.ipr_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deadline DATE NOT NULL,
    note TEXT NOT NULL,
    status_type private.statusType NOT NULL DEFAULT 'draft_classification',
    created_at TIMESTAMPTZ DEFAULT now()
)

-- FROM: src/lib/types/ip.ts
CREATE TYPE private.IpType AS ENUM (
    'patent', 
    'utility_model',
    'industrial_design',
    'trademark',
    'copyright'
)

CREATE TABLE private.ipr_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_title TEXT NOT NULL,
    project_title TEXT NOT NULL,
    tech_gen UUID NOT NULL REFERENCES inventors(id) ON DELETE CASCADE,
    current_status UUID NOT NULL REFERENCES ipr_statuses,
    ip_type private.IpType NOT NULL,
    funding_source TEXT NOT NULL,
    filing_date DATE NOT NULL,
    registration_date DATE NOT NULL,
    registration_year INT NOT NULL,
    current_stage_deadline DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ,
)

ALTER TABLE private.ipr_statuses
ADD COLUMN application_id UUID;

ALTER TABLE private.ipr_statuses
ADD CONSTRAINT fk_application_id
FOREIGN KEY (application_id)
REFERENCES private.ipr_applications(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

CREATE TABLE private.ipr_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES ipr_applications(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_description TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    comments TEXT,
)

CREATE TABLE private.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id REFERENCES ipr_applications(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
    read_at TIMESTAMPTZ,
)

-- FROM: src/lib/types/college-units.tS
CREATE TYPE private.college AS ENUM (
  'CAS-Bio',
  'CAS-Chem',
  'CFOS',
  'CFOS-IA',
  'CFOS-IFPT',
  'CFOS-IMFO',
  'ChE-SoTech',
  'Chem-CAS',
  'DPSM-CAS',
  'FT-SoTech',
  'NIMBB',
  'RRC',
  'SoTech',
  'TTBDO',
  'UPHSI',
  'UPV',
  'UPV GS',
  'UPVTC',
  'Other'
)

CREATE TABLE private.inventors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES ipr_applications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comments TEXT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
)

CREATE TYPE private.actionType AS ENUM (
    'create',
    'update',
    'delete',
    'upload',
    'status_change',
    'role_change'
);

CREATE TYPE private.actionResult AS ENUM (
    'success',
    'pending',
    'failure'
)

CREATE TYPE private.recordType AS ENUM (
    'application',
    'document',
    'account',
    'inventor',
    'report'
)

CREATE TABLE private.audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_stamp TIMESTAMPTZ NOT NULL,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action_category private.actionCategory NOT NULL,
    action_taken TEXT NOT NULL,
    action_result private.actionResult NOT NULL,
    record_type private.recordType NOT NULL,
    record_reference TEXT NOT NULL,
    changed_fields JSONB,
)


