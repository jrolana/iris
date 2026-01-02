import { ActionCategory, ActionResult } from "../types/audit_trail";

export const ActionCategoryBadgeClasses: Record<ActionCategory, string> = {
  [ActionCategory.CREATE]: "bg-success-50 text-success-700",
  [ActionCategory.DELETE]: "bg-error-50 text-error-700",
  [ActionCategory.UPDATE]: "bg-brand-50 text-brand-700",
  [ActionCategory.STATUS_CHANGE]: "bg-warning-50 text-warning-700",
  [ActionCategory.UPLOAD]: "bg-blue-light-50 text-blue-light-700",
  [ActionCategory.ROLE_CHANGE]: "bg-purple-50 text-purple-700",
};

export const ActionResultBadgeClasses: Record<ActionResult, string> = {
  [ActionResult.SUCCESS]: "bg-success-50 text-success-700",
  [ActionResult.FAILURE]: "bg-error-50 text-error-700",
  [ActionResult.PENDING]: "bg-warning-50 text-warning-700",
};


export const COLORS = [
    "#5C75FF", 
    "#7282FF", 
    "#6D7385", 
    "#40C387", 
    "#F4D06A"  
]

export const MONOCHROMATIC_COLORS = ["#4169E1", "#1B263B", "#89CFF0", "#E0E7FF", "#64748B"];

export const ANALOGOUS_COLORS = ["#4169E1", "#2DD4BF", "#6366F1", "#06B6D4", "#94A3B8"];
  