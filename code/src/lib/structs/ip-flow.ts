// lib/structs/ip-flow.ts
import { IpType, StatusType } from '../types/ip';
import { CHARTER_DEADLINES } from './charter';

export type FlowStep = {
  id: string;
  label: string;
  statusTypes: StatusType[];
  charterStage?: keyof typeof CHARTER_DEADLINES;
};

export const ipApplicationFlows: Record<IpType, FlowStep[]> = {
  patent: [
    { 
      id: 'idf', 
      label: 'Submit Patent IDF', 
      statusTypes: ['draft_classification','draft_idf', 'submitted_to_ttbdo', 'under_ttbdo_review'], 
      charterStage: 'STAGE_1'
    },
    { id: 'prior-art', label: 'Prior Art Search', statusTypes: ['prior_art_search'], charterStage: 'STAGE_1' },
    { id: 'draft', label: 'Draft Application', statusTypes: ['draft_application'], charterStage: 'STAGE_2' },
    { id: 'file', label: 'Filed with IPOPHL', statusTypes: ['filed_with_ipophil', 'wait_notice_publication'], charterStage: 'STAGE_3' },
    { 
      id: 'publication', 
      label: '1st Publication', 
      statusTypes: ['published', 'request_substantive_exam_report', 'wait_substantive_exam_report']
    },
    { 
      id: 'ser_exam', 
      label: 'Substantive Examination', 
      statusTypes: ['wait_substantive_exam_report','resolve_ser_defects', 'downgraded_to_um', 'wait_notice_of_issuance']
    },
    {
      id: 'notice_of_issuance', label: 'Notice of Issuance', statusTypes: ['req_cert_of_registration', 'wait_cert_of_registration']
    },
    {
      id: 'request_cert', label: 'Certificate of Registration', statusTypes: ['req_cert_of_registration', 'wait_cert_of_registration']
    },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered'] },
  ],
  utility_model: [
    { id: 'idf', label: 'Submit Utility Model IDF', statusTypes: ['draft_classification','draft_idf','submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'prior-art', label: 'Prior Art Search', statusTypes: ['prior_art_search'], charterStage: 'STAGE_1' },
    { id: 'draft', label: 'Draft Application', statusTypes: ['draft_application'], charterStage: 'STAGE_2' },
    { id: 'file', label: 'Filed with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3' },
    { 
      id: 'formality_exam', 
      label: 'Formality Examination', 
      statusTypes: ['wait_formality_exam_report', 'resolve_fer_defects', 'request_revival', 'wait_notice_publication']
    },
    {
      id: 'publish', label: 'Notice of Publication', statusTypes: ['published', 'req_cert_of_registration', 'wait_cert_of_registration']
    },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered'] },
  ],
  industrial_design: [
    { id: 'idf', label: 'Submit Industrial Design IDF', statusTypes: ['draft_classification','draft_idf','submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'prior-art', label: 'Prior Art Search', statusTypes: ['prior_art_search'], charterStage: 'STAGE_1' },
    { id: 'draft', label: 'Draft Application', statusTypes: ['draft_application'], charterStage: 'STAGE_2' },
    { id: 'file', label: 'Filed with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3' },
    { 
      id: 'formality_exam', 
      label: 'Formality Examination', 
      statusTypes: ['wait_formality_exam_report', 'resolve_fer_defects', 'request_revival', 'wait_notice_publication']
    },
    { 
      id: 'publication', 
      label: 'Notice of Publication', 
      statusTypes: ['published', 'req_for_issuance_of_cert_and_2nd_publication']
    },
    {
      id: 'request_cert', label: '2nd Publication & Certificate of Registration', statusTypes: ['wait_cert_of_registration']
    },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered'] },
  ],
  trademark: [
    { id: 'idf', label: 'Submit Trademark IDF', statusTypes: ['draft_classification','draft_idf','submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'prior-art', label: 'Prior Art Search', statusTypes: ['prior_art_search'], charterStage: 'STAGE_2' },
    { id: 'nice_classification', label: 'Nice Classification & Search', statusTypes: ['prepare_nice_classification', 'approve_nice_classification']},
    { id: 'file', label: 'Filed with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3' },
    { 
      id: 'registrability_exam', 
      label: 'Registrability Examination', 
      statusTypes: ['wait_registrability_report', 'resolve_rr_defects', 'request_revival', 'wait_notice_publication']
    },
    { 
      id: 'publication', 
      label: 'Notice of Publication', 
      statusTypes: ['published', 'req_cert_of_registration', 'wait_cert_of_registration']
    },
    {
      id: 'request_cert', label: '2nd Publication & Certificate of Registration', statusTypes: ['req_cert_of_registration', '2nd_publication', 'wait_cert_of_registration']
    },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered'] },
  ],
  copyright: [
    { id: 'idf', label: 'Submit Copyright IDF', statusTypes: ['draft_classification','draft_idf','submitted_to_ttbdo', 'under_ttbdo_review', 'print_copyright_forms', 'endorse_copyright'], charterStage: 'STAGE_1' },
    { id: 'sign', label: 'Signing of Documents', statusTypes: ['techgen_sign', 'chancellor_sign', 'submit_to_ovcre']},
    { id: 'notary', label: 'Notarization', statusTypes: ['notarization']},
    { id: 'file', label: 'File with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3'},
    { id: 'notice_of_action', label: 'Notice of Action', statusTypes: ['wait_notice_of_action', 'resolve_additional_requirements']},
    { id: 'send_orig_docs', label: 'Send Original Signed Documents to IPOPHL', statusTypes: ['mailed_to_ipophl', 'wait_statement_of_acc']},
    { id: 'payment', label: 'Payment of Fees', statusTypes: ['pay_fee_application', 'wait_cert_of_registration']},
    { id: 'grant', label: 'Recordation / Registration', statusTypes: ['registered'] },
  ],
};