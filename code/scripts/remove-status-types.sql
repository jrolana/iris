BEGIN;

-- Drop foreign key constraint from ipr_statuses
ALTER TABLE private.ipr_statuses 
DROP CONSTRAINT IF EXISTS fk_statuses_status_type;

-- for validation
-- modify if ip-status-type changes
ALTER TABLE private.ipr_statuses
ADD CONSTRAINT check_status_type_valid 
CHECK (status_type IN (
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
));

-- Verify data integrity before dropping
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  -- Check for any status values not in your TypeScript enum
  SELECT COUNT(*) INTO invalid_count
  FROM private.ipr_statuses
  WHERE status_type NOT IN (
    'draft_classification', 'draft_idf', 'submitted_to_ttbdo',
    'under_ttbdo_review', 'prior_art_search', 'draft_application',
    'filed_with_ipophil', 'wait_notice_publication',
    'wait_substantive_exam_report', 'resolve_ser_defects',
    'downgraded_to_um', 'wait_notice_of_issuance',
    'req_cert_of_registration', 'wait_cert_of_registration',
    'registered', 'published', 'wait_formality_exam_report',
    'resolve_fer_defects', 'request_revival', '2nd_publication',
    'prepare_nice_classification', 'approve_nice_classification',
    'wait_registrability_report', 'resolve_rr_defects',
    'techgen_sign', 'chancellor_sign', 'notarization',
    'wait_notice_of_action', 'resolve_additional_requirements',
    'wait_statement_of_acc', 'pay_fee_application',
    'mailed_to_ipophl', 'closed'
  );
  
  IF invalid_count > 0 THEN
    RAISE EXCEPTION 'Found % invalid status_type values. Fix before proceeding.', invalid_count;
  END IF;
END $$;

-- Drop the lookup table
DROP TABLE IF EXISTS private.ipr_status_types CASCADE;

COMMIT;