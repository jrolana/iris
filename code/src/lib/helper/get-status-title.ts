import { StatusType } from "@/lib/types/ip";

export const statusTypeToTitle = (status: StatusType | null): string => {
  switch (status) {
    case 'draft_classification':
      return 'Draft Classification';
    case 'draft_idf':
      return 'Draft IDF';
    case 'submitted_to_ttbdo':
      return 'Submitted to TTBDO';
    case 'under_ttbdo_review':
      return 'Under TTBDO Review';
    case 'prior_art_search':
      return 'Prior Art Search';
    case 'draft_application':
      return 'Draft Application';
    case 'filed_with_ipophil':
      return 'Filed with IPOPHIL';
    case 'under_examination':
      return 'Under Examination';
    case 'wait_notice_publication':
      return 'Waiting for Notice Publication';
    case 'wait_registrability_report':
      return 'Waiting for Registrability Report';
    case 'wait_formality_exam_report':
      return 'Waiting for Formality Exam Report';
    case 'wait_substantive_exam_report':
      return 'Waiting for Substantive Exam Report';
    case 'prepare_nice_classification':
      return 'Prepare Nice Classification';
    case 'approve_nice_classification':
      return 'Approve Nice Classification';
    case 'resolve_rr_defects':
      return 'Resolve RR Defects';
    case 'request_revival':
      return 'Request Revival';
    case 'downgraded_to_um':
      return 'Downgraded to UM';
    case 'registered':
      return 'Registered';
    case 'closed':
      return 'Closed';
    default:
      return '';
  }
}
