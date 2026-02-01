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
      statusTypes: [ 'submitted_to_ttbdo', 'under_ttbdo_review'], 
      charterStage: 'STAGE_1'
    },
    { id: 'prior-art', label: 'Prior Art Search', statusTypes: ['prior_art_search'], charterStage: 'STAGE_1' },
    { id: 'draft', label: 'Draft Application', statusTypes: ['draft_application'], charterStage: 'STAGE_2' },
    { id: 'file', label: 'Filed with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3' },
    { 
      id: 'publication', 
      label: 'Publication', 
      statusTypes: ['wait_notice_publication']
    },
    { 
      id: 'ser_exam', 
      label: 'Substantive Examination', 
      statusTypes: ['wait_substantive_exam_report','resolve_ser_defects', 'downgraded_to_um']
    },
    {
      id: 'notice_of_issuance', label: 'Notice of Issuance', statusTypes: ['wait_notice_of_issuance']
    },
    {
      id: 'request_cert', label: 'Certificate of Registration', statusTypes: ['req_cert_of_registration', 'wait_cert_of_registration']
    },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered', 'published'] },
  ],
  utility_model: [
    { id: 'idf', label: 'Submit Utility Model IDF', statusTypes: ['submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'prior-art', label: 'Prior Art Search', statusTypes: ['prior_art_search'], charterStage: 'STAGE_1' },
    { id: 'draft', label: 'Draft Application', statusTypes: ['draft_application'], charterStage: 'STAGE_2' },
    { id: 'file', label: 'Filed with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3' },
    { 
      id: 'formality_exam', 
      label: 'Formality Examination', 
      statusTypes: ['wait_formality_exam_report', 'resolve_fer_defects', 'request_revival']
    },
    { 
      id: 'publication', 
      label: 'Publication', 
      statusTypes: ['wait_notice_publication']
    },
    {
      id: 'request_cert', label: '2nd Publication & Certificate of Registration', statusTypes: ['req_cert_of_registration', '2nd_publication', 'wait_cert_of_registration']
    },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered', 'published'] },
  ],
  industrial_design: [
    { id: 'idf', label: 'Submit Industrial Design IDF', statusTypes: ['submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'prior-art', label: 'Prior Art Search', statusTypes: ['prior_art_search'], charterStage: 'STAGE_1' },
    { id: 'draft', label: 'Draft Application', statusTypes: ['draft_application'], charterStage: 'STAGE_2' },
    { id: 'file', label: 'Filed with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3' },
    { 
      id: 'formality_exam', 
      label: 'Formality Examination', 
      statusTypes: ['wait_formality_exam_report', 'resolve_fer_defects', 'request_revival']
    },
    { 
      id: 'publication', 
      label: 'Publication', 
      statusTypes: ['wait_notice_publication']
    },
    {
      id: 'request_cert', label: '2nd Publication & Certificate of Registration', statusTypes: ['req_cert_of_registration', '2nd_publication', 'wait_cert_of_registration']
    },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered', 'published'] },
  ],
  trademark: [
    { id: 'idf', label: 'Submit Trademark IDF', statusTypes: ['submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'prior-art', label: 'Prior Art Search', statusTypes: ['prior_art_search'], charterStage: 'STAGE_2' },
    { id: 'nice_classification', label: 'Nice Classification & Search', statusTypes: ['prepare_nice_classification', 'approve_nice_classification']},
    { id: 'file', label: 'Filed with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3' },
    { 
      id: 'registrability_exam', 
      label: 'Registrability Examination', 
      statusTypes: ['wait_registrability_report', 'resolve_rr_defects', 'request_revival']
    },
    { 
      id: 'publication', 
      label: 'Publication', 
      statusTypes: ['wait_notice_publication']
    },
    {
      id: 'request_cert', label: '2nd Publication & Certificate of Registration', statusTypes: ['req_cert_of_registration', '2nd_publication', 'wait_cert_of_registration']
    },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered', 'published'] },
  ],
  copyright: [
    { id: 'idf', label: 'Submit Copyright IDF', statusTypes: ['submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'sign', label: 'Signing of Documents', statusTypes: ['techgen_sign', 'chancellor_sign']},
    { id: 'notary', label: 'Notarization', statusTypes: ['notarization']},
    { id: 'file', label: 'File with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3'},
    { id: 'notice_of_action', label: 'Notice of Action', statusTypes: ['wait_notice_of_action', 'resolve_additional_requirements']},
    { id: 'payment', label: 'Payment of Fees', statusTypes: ['wait_statement_of_acc', 'pay_fee_application']},
    { id: 'request_cert', label: 'Request for Certificate of Registration', statusTypes: ['mailed_to_ipophl','req_cert_of_registration', 'wait_cert_of_registration']},
    { id: 'grant', label: 'Recordation / Registration', statusTypes: ['registered', 'published'] },
  ],
};