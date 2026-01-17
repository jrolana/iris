-- LOOKUP TABLES

CREATE TABLE private.college_units (
    code VARCHAR(20) PRIMARY KEY,
    full_name TEXT NOT NULL
);

INSERT INTO private.college_units (code, full_name) VALUES
  ('CAS',          'College of Arts and Sciences'),
  ('CAS-Bio',      'CAS - Biology'),
  ('CAS-Chem',     'CAS - Chemistry'),
  ('CAS-DPSM',     'CAS - Division of Physical Sciences and Mathematics'),
  ('CFOS',         'College of Fisheries and Ocean Sciences'),
  ('CFOS-IA',      'CFOS - Institute of Aquaculture'),
  ('CFOS-IFPT',    'CFOS - Institute of Fish Processing Technology'),
  ('CFOS-IMFO',    'CFOS - Institute of Marine Fisheries and Oceanology'),
  ('SoTech',       'School of Technology'),
  ('SoTech-ChE',   'SoTech - Chemical Engineering'),
  ('SoTech-FT',    'SoTech - Food Technology'),
  ('NIMBB',        'National Institute of Molecular Biology and Biotechnology'),
  ('RRC',          'Regional Research Center'),
  ('TTBDO',        'Technology Transfer and Business Development Office'),
  ('UPHSI',        'UP Health Services Unit'),
  ('UPV',          'University of the Philippines Visayas'),
  ('UPVGS',        'UP Visayas Graduate School'),
  ('Other',        'Other / External');

CREATE TYPE private.iprType AS ENUM (
    'patent',
    'utility_model',
    'industrial_design',
    'trademark',
    'copyright'
);

CREATE TABLE private.ipr_status_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL
);

INSERT INTO private.ipr_status_types (code, label) VALUES
  ('draft_classification', 'Draft Classification'),
  ('draft_idf', 'Draft IDF'),
  ('submitted_to_ttbdo', 'Submitted to TTBDO'),
  ('under_ttbdo_review', 'Under TTBDO Review'),
  ('prior_art_search', 'Prior Art Search'),
  ('draft_application', 'Draft Application'),
  ('filed_with_ipophil', 'Filed with IPOPHIL'),
  ('under_examination', 'Under Examination'),
  ('wait_notice_publication', 'Wait Notice Publication'),
  ('wait_registrability_report', 'Wait Registrability Report'),
  ('wait_formality_exam_report', 'Wait Formality Exam Report'),
  ('wait_substantive_exam_report', 'Wait Substantive Exam Report'),
  ('prepare_nice_classification', 'Prepare NICE Classification'),
  ('approve_nice_classification', 'Approve NICE Classification'),
  ('resolve_ser_defects', 'Resolve SER Defects'),
  ('resolve_fer_defects', 'Resolve FER Defects'),
  ('resolve_rr_defects', 'Resolve RR Defects'),
  ('resolve_additional_requirements', 'Resolve Additional Requirements'),
  ('request_revival', 'Request Revival'),
  ('downgraded_to_um', 'Downgraded to UM'),
  ('registered', 'Registered'),
  ('closed', 'Closed');

-- MAIN TABLES

CREATE TABLE private.ipr_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    techgen_id UUID NOT NULL REFERENCES private.users(id) ON DELETE RESTRICT,
    
    ip_title TEXT NOT NULL,
    project_title TEXT NOT NULL,
    ip_type private.iprType NOT NULL,
    funding_source TEXT NOT NULL,

    filing_date DATE,
    registration_date DATE,
    CHECK (registration_date IS NULL OR registration_date >= filing_date),

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users
ADD COLUMN college VARCHAR(20) REFERENCES private.college_units(code) DEFAULT 'Other' NOT NULL;

--  not all inventors have an account
CREATE TABLE private.inventors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES private.users(id) ON DELETE SET NULL,
    
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    college VARCHAR(20) NOT NULL REFERENCES private.college_units(code),
    comments TEXT,

    UNIQUE(application_id, full_name)
);

CREATE TABLE private.ipr_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
    status_type VARCHAR(50) NOT NULL REFERENCES private.ipr_status_types(code) ON UPDATE CASCADE,
    deadline DATE,
    note TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE private.ipr_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   
    application_id UUID NOT NULL REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES private.users(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_description TEXT,
    file_type TEXT NOT NULL,
    comments TEXT,
);

CREATE TABLE private.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL REFERENCES private.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now()
);

-- AUDIT TRAIL

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
);

CREATE TYPE private.recordType AS ENUM (
    'application',
    'document',
    'account',
    'inventor',
    'report'
);

-- changed_fields:
-- {
--   "before": { "status": "draft_application" },
--   "after":  { "status": "filed_with_ipophil" }
-- }

CREATE TABLE private.audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_at TIMESTAMPTZ DEFAULT now(),
    snapshot_user_name TEXT NOT NULL,
    snapshot_user_role TEXT NOT NULL,

    action_type private.actionType NOT NULL,
    action_taken TEXT NOT NULL,
    action_result private.actionResult NOT NULL,

    record_type private.recordType NOT NULL,
    snapshot_record_reference TEXT NOT NULL,

    changed_fields JSONB,
);



