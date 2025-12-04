
import { StatusType } from "../types/ip";

export const STATUS_LABELS: Partial<Record<StatusType, string>> = {
  draft_classification: 'Draft – Classification in progress',
  draft_idf: 'Draft – IDF in progress',
  submitted_to_ttbdo: 'Submitted to TTBDO',
  under_ttbdo_review: 'Under TTBDO review',
  prior_art_search: 'Prior art search',
  draft_application: 'Drafting IPOPHL application',
  filed_with_ipophil: 'Filed with IPOPHL',
  wait_registrability_report: 'Waiting for registrability report',
  wait_formality_exam_report: 'Waiting for formality exam report',
  wait_substantive_exam_report: 'Waiting for substantive exam report',
  wait_notice_publication: 'Waiting for notice of publication',
  registered: 'Registered',
  closed: 'Closed',
};