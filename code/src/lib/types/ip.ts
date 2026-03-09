export type IpType =
  | 'patent'
  | 'utility_model'
  | 'industrial_design'
  | 'trademark'
  | 'copyright';

//global StatusType
export type StatusType =
  | 'draft_classification'
  | 'draft_idf'
  | 'submitted_to_ttbdo'
  | 'under_ttbdo_review'
  | 'prior_art_search'
  | 'draft_application'
  | 'filed_with_ipophil'
  | 'wait_notice_publication'
  | 'wait_substantive_exam_report'
  | 'resolve_ser_defects'
  | 'downgraded_to_um'
  | 'wait_notice_of_issuance'
  | 'req_cert_of_registration'
  | 'wait_cert_of_registration'
  | 'registered'
  | 'published'
  | 'request_substantive_exam_report'
  | 'wait_formality_exam_report'
  | 'resolve_fer_defects'
  | 'request_revival'
  | '2nd_publication'
  | 'prepare_nice_classification'
  | 'approve_nice_classification'
  | 'wait_registrability_report'
  | 'resolve_rr_defects'
  | 'req_for_issuance_of_cert_and_2nd_publication'
  | 'endorse_copyright'
  | 'print_copyright_forms'
  | 'submit_to_ovcre'
  | 'techgen_sign'
  | 'chancellor_sign'
  | 'notarization'
  | 'wait_notice_of_action'
  | 'discussing_downgrade'
  | 'resolve_additional_requirements'
  | 'wait_statement_of_acc'
  | 'pay_fee_application'
  | 'mailed_to_ipophl'
  | 'closed'
  | 'removal_from_record'
  | 'expired';

//specific ip statuses
export const IpStatuses: Record<IpType, readonly StatusType[]> = {
  patent: [
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
    'discussing_downgrade',
    'downgraded_to_um',
    'wait_notice_of_issuance',
    'req_cert_of_registration',
    'wait_cert_of_registration',
    'registered',
    'published',
    'closed',
  ],
  utility_model: [
    'draft_classification',
    'draft_idf',
    'submitted_to_ttbdo',
    'under_ttbdo_review',
    'prior_art_search',
    'draft_application',
    'filed_with_ipophil',
    'wait_formality_exam_report',
    'resolve_fer_defects',
    'request_revival',
    'wait_notice_publication',
    'req_cert_of_registration',
    '2nd_publication',
    'wait_cert_of_registration',
    'registered',
    'published',
    'closed',
  ],
  industrial_design: [
    'draft_classification',
    'draft_idf',
    'submitted_to_ttbdo',
    'under_ttbdo_review',
    'prior_art_search',
    'draft_application',
    'filed_with_ipophil',
    'wait_formality_exam_report',
    'resolve_fer_defects',
    'request_revival',
    'wait_notice_publication',
    'req_cert_of_registration',
    '2nd_publication',
    'wait_cert_of_registration',
    'registered',
    'published',
    'closed',
  ],
  trademark: [
    'draft_classification',
    'draft_idf',
    'submitted_to_ttbdo',
    'under_ttbdo_review',
    'prior_art_search',
    'prepare_nice_classification',
    'approve_nice_classification',
    'filed_with_ipophil',
    'wait_registrability_report',
    'resolve_rr_defects',
    'request_revival',
    'wait_notice_publication',
    'req_cert_of_registration',
    '2nd_publication',
    'wait_cert_of_registration',
    'registered',
    'published',
    'closed',
  ],
  copyright: [
    'draft_classification',
    'draft_idf',
    'submitted_to_ttbdo',
    'under_ttbdo_review',
    'techgen_sign',
    'chancellor_sign',
    'notarization',
    'filed_with_ipophil',
    'wait_notice_of_action',
    'resolve_additional_requirements',
    'wait_statement_of_acc',
    'pay_fee_application',
    'mailed_to_ipophl',
    'req_cert_of_registration',
    'wait_cert_of_registration',
    'registered',
    'published',
    'closed',
  ],
} satisfies Record<IpType, readonly StatusType[]>;

