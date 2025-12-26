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
    { id: 'classification', label: 'Choose IP Type', statusTypes: ['draft_classification'] },
    { 
      id: 'idf', 
      label: 'Submit Patent IDF', 
      statusTypes: ['draft_idf', 'submitted_to_ttbdo', 'under_ttbdo_review'], // Fix: under_ttbdo_review added
      charterStage: 'STAGE_1' 
    },
    { id: 'prior-art', label: 'Prior Art Search', statusTypes: ['prior_art_search'], charterStage: 'STAGE_1' },
    { id: 'draft', label: 'Draft Application', statusTypes: ['draft_application'], charterStage: 'STAGE_2' },
    { id: 'file', label: 'File with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3' },
    { 
      id: 'exam', 
      label: 'Examination & Responses', 
      statusTypes: ['wait_formality_exam_report', 'wait_substantive_exam_report', 'resolve_rr_defects'] // Fix: resolve_rr_defects added
    },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered', 'closed'] },
  ],
  utility_model: [
    { id: 'classification', label: 'Choose IP Type', statusTypes: ['draft_classification'] },
    { id: 'idf', label: 'Submit UM IDF', statusTypes: ['draft_idf', 'submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'search', label: 'Registrability Check', statusTypes: ['prior_art_search', 'wait_registrability_report'], charterStage: 'STAGE_1' },
    { id: 'file', label: 'File with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3' },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered', 'closed'] },
  ],
  industrial_design: [
    { id: 'classification', label: 'Choose IP Type', statusTypes: ['draft_classification'] },
    { id: 'idf', label: 'Submit ID Design Form', statusTypes: ['draft_idf', 'submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'search', label: 'Registrability Check', statusTypes: ['wait_registrability_report'], charterStage: 'STAGE_1' },
    { id: 'file', label: 'File with IPOPHL', statusTypes: ['filed_with_ipophil'], charterStage: 'STAGE_3' },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered', 'closed'] },
  ],
  trademark: [
    { id: 'classification', label: 'Choose IP Type', statusTypes: ['draft_classification'] },
    { id: 'idf', label: 'Submit Trademark Form', statusTypes: ['draft_idf', 'submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'search', label: 'Nice Classification & Search', statusTypes: ['prepare_nice_classification', 'approve_nice_classification'], charterStage: 'STAGE_1' },
    { id: 'file', label: 'File with IPOPHL', statusTypes: ['filed_with_ipophil', 'wait_registrability_report'], charterStage: 'STAGE_3' },
    { id: 'grant', label: 'Grant / Registration', statusTypes: ['registered', 'closed'] },
  ],
  copyright: [
    { id: 'classification', label: 'Choose IP Type', statusTypes: ['draft_classification'] },
    { id: 'idf', label: 'Submit Copyright Form', statusTypes: ['draft_idf', 'submitted_to_ttbdo', 'under_ttbdo_review'], charterStage: 'STAGE_1' },
    { id: 'grant', label: 'Recordation / Registration', statusTypes: ['registered', 'closed'] },
  ],
};