export enum ActionCategory {
  CREATE = "Create",
  DELETE = "Delete",
  UPDATE = "Update",
  STATUS_CHANGE = "Status Change",
  UPLOAD = "Upload",
  ROLE_CHANGE = "Role Change"
}

export enum ActionResult {
  SUCCESS = "Success",
  FAILURE = "Failure",
  PENDING = "Pending"
}

export enum RecordType {
  APPLICATION = "Application",
  DOCUMENT = "Document",
  ACCOUNT = "Account",
  INVENTOR = "Inventor",
  REPORT = "Report",
  REQUIREMENT = "Requirement"
}

export type AuditLogType = {
  id: string;
  timestamp: string;        // ISO string
  userName: string;
  userRole: string;
  actionCategory: ActionCategory;  
  actionTaken: string;
  actionResult: ActionResult;      
  recordType: RecordType;          
  recordReference: string;
  changedFields?: unknown | null;
};

export type AuditTrailRow = {
  id: string;
  event_at: string | null;
  snapshot_user_name: string;
  snapshot_user_role: string;
  action_type: "create" | "delete" | "update" | "status_change" | "upload" | "role_change";
  action_taken: string;
  action_result: "success" | "failure" | "pending";
  record_type: "application" | "document" | "account" | "inventor" | "report" | "requirement";
  snapshot_record_reference: string;
  changed_fields?: unknown | null;
};

const actionCategoryMap: Record<AuditTrailRow["action_type"], ActionCategory> = {
  create: ActionCategory.CREATE,
  delete: ActionCategory.DELETE,
  update: ActionCategory.UPDATE,
  status_change: ActionCategory.STATUS_CHANGE,
  upload: ActionCategory.UPLOAD,
  role_change: ActionCategory.ROLE_CHANGE,
};

const actionResultMap: Record<AuditTrailRow["action_result"], ActionResult> = {
  success: ActionResult.SUCCESS,
  failure: ActionResult.FAILURE,
  pending: ActionResult.PENDING,
};

const recordTypeMap: Record<AuditTrailRow["record_type"], RecordType> = {
  application: RecordType.APPLICATION,
  document: RecordType.DOCUMENT,
  account: RecordType.ACCOUNT,
  inventor: RecordType.INVENTOR,
  report: RecordType.REPORT,
  requirement: RecordType.REQUIREMENT
};

export function mapAuditTrailRow(row: AuditTrailRow): AuditLogType {
  return {
    id: row.id,
    timestamp: row.event_at ?? new Date(0).toISOString(),
    userName: row.snapshot_user_name,
    userRole: row.snapshot_user_role,
    actionCategory: actionCategoryMap[row.action_type],
    actionTaken: row.action_taken,
    actionResult: actionResultMap[row.action_result],
    recordType: recordTypeMap[row.record_type],
    recordReference: row.snapshot_record_reference,
    changedFields: row.changed_fields ?? null,
  };
}
