
import { StatusType } from "@/lib/types/ip";

export const getSuggestedDeadline = (status: StatusType): string | null => {
  const now = new Date();

  // Helper to format date as YYYY-MM-DD for HTML input
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  switch (status) {
    // strict 2-month deadline from IPOPHL
    case "wait_formality_exam_report": 
    case "wait_substantive_exam_report": 
    case "resolve_rr_defects": 
    case "request_revival":
    { 
        const twoMonthsLater = new Date(now);
      twoMonthsLater.setMonth(now.getMonth() + 2);
      return formatDate(twoMonthsLater); 
    }

    // dummy deadline
    case "draft_idf":
    { 
        const twoWeeksLater = new Date(now);
      twoWeeksLater.setDate(now.getDate() + 14);
      return formatDate(twoWeeksLater); 
    }

    // Default: No automated suggestion
    default:
      return null;
  }
};