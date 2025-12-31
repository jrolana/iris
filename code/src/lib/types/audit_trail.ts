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
  REPORT = "Report"
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
};