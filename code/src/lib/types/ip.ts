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
  | 'under_examination'
  | 'wait_notice_publication'
  | 'wait_registrability_report'
  | 'wait_formality_exam_report'
  | 'wait_substantive_exam_report'
  | 'prepare_nice_classification'
  | 'approve_nice_classification'
  | 'resolve_ser_defects'
  | 'resolve_fer_defects'
  | 'resolve_rr_defects'
  | 'resolve_additional_requirements'
  | 'request_revival'
  | 'downgraded_to_um'
  | 'registered'
  | 'closed';

//specific ip statuses
export const ipStatuses = {
  patent: [
    'draft_classification',
    'draft_idf',
    'submitted_to_ttbdo',
    'under_ttbdo_review',
    'prior_art_search',
    'draft_application',
    'filed_with_ipophil',
    'wait_formality_exam_report',
    'resolve_ser_defects',
    'wait_substantive_exam_report',
    'downgraded_to_um',
    'registered',
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
    'wait_registrability_report',
    'resolve_fer_defects',
    'registered',
    'closed',
  ],
  industrial_design: [
    'draft_classification',
    'draft_idf',
    'submitted_to_ttbdo',
    'under_ttbdo_review',
    'filed_with_ipophil',
    'wait_registrability_report',
    'resolve_fer_defects',
    'registered',
    'closed',
  ],
  trademark: [
    'draft_classification',
    'draft_idf',
    'submitted_to_ttbdo',
    'under_ttbdo_review',
    'prepare_nice_classification', 
    'approve_nice_classification',
    'wait_registrability_report',
    'resolve_rr_defects',
    'registered',
    'closed',
  ],
  copyright: [
    'draft_classification',
    'draft_idf',
    'submitted_to_ttbdo',
    'under_ttbdo_review',
    'resolve_additional_requirements',
    'registered',
    'closed',
  ],
} satisfies Record<IpType, readonly StatusType[]>;

