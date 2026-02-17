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
    
    ip_title TEXT NULL,
    project_title TEXT NOT NULL,
    ip_type private.iprType NOT NULL,
    funding_source TEXT NOT NULL,

    filing_date DATE,
    registration_date DATE,
    created_by uuid NULL DEFAULT auth.uid(),
    ip_number TEXT NULL,
    curr_status uuid NULL,

    CONSTRAINT fk_app_created_by FOREIGN KEY(created_by) REFERENCES private.users(id) ON DELETE SET NULL,
    CONSTRAINT fk_app_curr_status FOREIGN KEY(curr_status) REFERENCES private.ipr_statuses(id) ON UPDATE CASCADE ON DELETE SET NULL,
    
    CHECK (registration_date IS NULL OR registration_date >= filing_date),

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE private.users
ADD COLUMN college VARCHAR(20) DEFAULT 'Other' NOT NULL,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE NOT NULL,
ADD CONSTRAINT fk_users_college FOREIGN KEY(college) REFERENCES private.college_units(code);

-- Acts the junction table for ipr_applications and users
--  not all inventors have an account
CREATE TABLE private.inventors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL,
    techgen_id UUID,
    
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    college VARCHAR(20) NOT NULL,
    comments TEXT,
    external_institution TEXT NULL,

    UNIQUE(application_id, email),

    CONSTRAINT fk_inventor_techgen FOREIGN KEY(techgen_id) REFERENCES private.users(id) ON DELETE SET NULL,
    CONSTRAINT fk_inventor_application FOREIGN KEY(application_id) REFERENCES private.ipr_applications(id) ON DELETE CASCADE,

    CONSTRAINT fk_inventor_college FOREIGN KEY(college) REFERENCES private.college_units(code)
 
    CHECK (
    (college = 'Other' AND external_institution IS NOT NULL) OR 
    (college != 'Other' AND external_institution IS NULL)
    )
);

CREATE TABLE private.ipr_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL,
    status_type VARCHAR(50) NOT NULL,
    deadline DATE,
    note TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT fk_statuses_application_id FOREIGN KEY(application_id) REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_statuses_status_type FOREIGN KEY(status_type) REFERENCES private.ipr_status_types(code) ON UPDATE CASCADE
);

CREATE TABLE private.ipr_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   
    application_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    owner_name TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    modified_at TIMESTAMPTZ DEFAULT now(),
    
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_description TEXT,
    file_type TEXT NOT NULL,
    comments TEXT,
    storage_id UUID NOT NULL,

    CONSTRAINT fk_ipr_files_app_id FOREIGN KEY(application_id) REFERENCES private.ipr_applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_ipr_files_owner_id FOREIGN KEY(owner_id) REFERENCES private.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ipr_files_storage_id FOREIGN KEY (storage_id) REFERENCES storage.objects (id) ON DELETE CASCADE
);

CREATE TABLE private.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    receiver_id UUID NOT NULL,
    application_id UUID,
    
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT fk_notifs_user_id FOREIGN KEY(user_id) REFERENCES private.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifs_app_id FOREIGN KEY(application_id) REFERENCES private.ipr_applications(id) ON DELETE CASCADE
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

    changed_fields JSONB
);

CREATE TYPE private.registrationRequestsStatus AS ENUM (
    'pending',
    'email_verified',
    'approved',
    'rejected',
    'expired'
);

CREATE TABLE private.user_registration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role private.user_role NOT NULL,
    college_code VARCHAR(20) NULL,
    other_college_name TEXT NULL,
    external_institution TEXT NULL,

    status private.registrationRequestsStatus NOT NULL DEFAULT 'pending',

    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,

    CONSTRAINT fk_user_registration_college FOREIGN KEY(college_code)
    REFERENCES private.college_units(code),

    CONSTRAINT registration_affiliation_check CHECK
    (
        (
        (
            (college_code IS NOT NULL)
            AND (other_college_name IS NULL)
            AND (external_institution IS NULL)
        )
        OR (
            (college_code IS NULL)
            AND (other_college_name IS NOT NULL)
            AND (external_institution IS NULL)
        )
        OR (
            (college_code IS NULL)
            AND (other_college_name IS NULL)
            AND (external_institution IS NOT NULL)
        )
        )
    )
);


