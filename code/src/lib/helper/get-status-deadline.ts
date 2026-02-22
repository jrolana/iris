
import { IprStatusType } from "../types/status";

export const getSuggestedDeadline = (status: IprStatusType["Row"]["status_type"]): string | null => {
  const now = new Date();

  // Helper to format date as YYYY-MM-DD for HTML input
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  switch (status) {
    case "prior_art_search":
      { 
        const twoWeeksLater = new Date(now);
        twoWeeksLater.setDate(now.getDate() + 14);
        return formatDate(twoWeeksLater); 
      }
    // strict 2-month deadline from IPOPHL
    case "resolve_ser_defects": 
    case "resolve_fer_defects": 
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