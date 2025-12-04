import { IpType, StatusType } from '../types/ip';

export type FlowStep = {
  id: string;
  label: string;
  statusTypes: StatusType[];
  description?: string;
};

export const ipApplicationFlows: Record<IpType, FlowStep[]> = {
  patent: [
    {
      id: 'classification',
      label: 'Choose IP Type',
      statusTypes: ['draft_classification'],
    },
    {
      id: 'idf',
      label: 'Submit Patent IDF',
      statusTypes: ['draft_idf', 'submitted_to_ttbdo'],
    },
    {
      id: 'prior-art',
      label: 'Prior Art Search',
      statusTypes: ['prior_art_search'],
    },
    {
      id: 'draft',
      label: 'Draft Application',
      statusTypes: ['draft_application'],
    },
    {
      id: 'file',
      label: 'File with IPOPHL',
      statusTypes: ['filed_with_ipophil'],
    },
    {
      id: 'exam',
      label: 'Examination & Responses',
      statusTypes: ['wait_formality_exam_report', 'wait_substantive_exam_report'],
    },
    {
      id: 'grant',
      label: 'Grant / Registration',
      statusTypes: ['registered', 'closed'],
    },
  ],

  utility_model: [
    {
      id: 'classification',
      label: 'Choose IP Type',
      statusTypes: ['draft_classification'],
    },
    {
      id: 'idf',
      label: 'Submit UM IDF',
      statusTypes: ['draft_idf', 'submitted_to_ttbdo'],
    },
    {
      id: 'search',
      label: 'Registrability Check',
      statusTypes: ['prior_art_search', 'wait_registrability_report'],
    },
    {
      id: 'file',
      label: 'File with IPOPHL',
      statusTypes: ['filed_with_ipophil'],
    },
    {
      id: 'grant',
      label: 'Grant / Registration',
      statusTypes: ['registered', 'closed'],
    },
  ],

  industrial_design: [
    {
      id: 'classification',
      label: 'Choose IP Type',
      statusTypes: ['draft_classification'],
    },
    {
      id: 'idf',
      label: 'Submit ID Design Form',
      statusTypes: ['draft_idf', 'submitted_to_ttbdo'],
    },
    {
      id: 'search',
      label: 'Registrability Check',
      statusTypes: ['wait_registrability_report'],
    },
    {
      id: 'file',
      label: 'File with IPOPHL',
      statusTypes: ['filed_with_ipophil'],
    },
    {
      id: 'grant',
      label: 'Grant / Registration',
      statusTypes: ['registered', 'closed'],
    },
  ],

  trademark: [
    {
      id: 'classification',
      label: 'Choose IP Type',
      statusTypes: ['draft_classification'],
    },
    {
      id: 'idf',
      label: 'Submit Trademark Form',
      statusTypes: ['draft_idf', 'submitted_to_ttbdo'],
    },
    {
      id: 'search',
      label: 'Nice Classification & Search',
      statusTypes: ['prepare_nice_classification', 'approve_nice_classification'],
    },
    {
      id: 'file',
      label: 'File with IPOPHL',
      statusTypes: ['filed_with_ipophil', 'wait_registrability_report'],
    },
    {
      id: 'grant',
      label: 'Grant / Registration',
      statusTypes: ['registered', 'closed'],
    },
  ],

  copyright: [
    {
      id: 'classification',
      label: 'Choose IP Type',
      statusTypes: ['draft_classification'],
    },
    {
      id: 'idf',
      label: 'Submit Copyright Form',
      statusTypes: ['draft_idf', 'submitted_to_ttbdo'],
    },
    {
      id: 'grant',
      label: 'Recordation / Registration',
      statusTypes: ['registered', 'closed'],
    },
  ],
};
