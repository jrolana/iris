CREATE TABLE private.ipr_statuses (
    code TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    sort_order INT
);

INSERT INTO private.ipr_statuses (code, label, sort_order) VALUES
  ('draft_classification',           'Draft – Classification', 1),
  ('draft_idf',                      'Draft – IDF', 2),
  ('submitted_to_ttbdo',             'Submitted to TTBDO', 3),
  ('under_ttbdo_review',             'Under TTBDO Review', 4),
  ('prior_art_search',               'Prior Art Search', 5),
  ('draft_application',              'Draft Application', 6),
  ('filed_with_ipophil',             'Filed with IPOPHIL', 7),
  ('under_examination',              'Under Examination', 8),
  ('wait_notice_publication',        'Waiting for Notice of Publication', 9),
  ('wait_registrability_report',     'Waiting for Registrability Report', 10),
  ('wait_formality_exam_report',     'Waiting for Formality Examination Report', 11),
  ('wait_substantive_exam_report',   'Waiting for Substantive Examination Report', 12),
  ('prepare_nice_classification',    'Prepare NICE Classification', 13),
  ('approve_nice_classification',    'Approve NICE Classification', 14),
  ('resolve_ser_defects',            'Resolve SER Defects', 15),
  ('resolve_fer_defects',            'Resolve FER Defects', 16),
  ('resolve_rr_defects',             'Resolve RR Defects', 17),
  ('resolve_additional_requirements','Resolve Additional Requirements', 18),
  ('request_revival',                'Request Revival', 19),
  ('downgraded_to_um',               'Downgraded to Utility Model', 20),
  ('registered',                     'Registered', 21),
  ('closed',                         'Closed', 22);

CREATE TYPE private.IpType AS ENUM (
    'patent', 
    'utility_model',
    'industrial_design',
    'trademark',
    'copyright'
);

CREATE TABLE private.ipr_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_title TEXT NOT NULL,
    project_title TEXT NOT NULL,
    ip_type private.IpType NOT NULL,
    funding_source TEXT NOT NULL,

    filing_date DATE,
    registration_date DATE,

    current_status NOT NULL REFERENCES ipr_statuses(code),
    current_status_deadline DATE,
    current_status_note TEXT,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE private.ipr_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   
    application_id UUID NOT NULL REFERENCES ipr_applications(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id),
    deleted_user_at TIMESTAMPTZ,
    
    storage_path TEXT UNIQUE NOT NULL,
    file_name TEXT NOT NULL,
    file_description TEXT,
    comments TEXT,
    
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE private.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES ipr_applications(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    content TEXT UNIQUE NOT NULL,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE private.colleges (
    code TEXT PRIMARY KEY,
    full_name TEXT
);

INSERT INTO private.colleges (code, full_name) VALUES
  ('CAS-Bio',      'College of Arts and Sciences - Biology'),
  ('CAS-Chem',     'College of Arts and Sciences - Chemistry'),
  ('CFOS',         'College of Fisheries and Ocean Sciences'),
  ('CFOS-IA',      'CFOS - Institute of Aquaculture'),
  ('CFOS-IFPT',    'CFOS - Institute of Fish Processing Technology'),
  ('CFOS-IMFO',    'CFOS - Institute of Marine Fisheries and Oceanology'),
  ('ChE-SoTech',   'Chemical Engineering - School of Technology'),
  ('Chem-CAS',     'Chemistry - College of Arts and Sciences'),
  ('DPSM-CAS',     'Division of Physical Sciences and Mathematics - CAS'),
  ('FT-SoTech',    'Food Technology - School of Technology'),
  ('NIMBB',        'National Institute of Molecular Biology and Biotechnology'),
  ('RRC',          'Regional Research Center'),
  ('SoTech',       'School of Technology'),
  ('TTBDO',        'Technology Transfer and Business Development Office'),
  ('UPHSI',        'UP Health Services Unit'),
  ('UPV',          'University of the Philippines Visayas'),
  ('UPV GS',       'UP Visayas Graduate School'),
  ('Other',        'Other / External');

ALTER TABLE users
ADD COLUMN college TEXT REFERENCES private.colleges(code);

CREATE TABLE private.inventors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES ipr_applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comments TEXT
);

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

    event_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    snapshot_user_name TEXT NOT NULL,
    snapshot_user_role TEXT NOT NULL,

    action_type private.actionType NOT NULL,
    action_taken TEXT NOT NULL,
    action_result private.actionResult NOT NULL,

    record_type private.recordType NOT NULL,
    snapshot_record_reference TEXT NOT NULL,

    changed_fields JSONB,
);



