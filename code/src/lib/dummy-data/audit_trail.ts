import { AuditLogType, ActionCategory, ActionResult, RecordType } from "../types/audit_trail";


export const dummyAuditTrail: AuditLogType[] = [
  {
    id: "1",
    timestamp: "2025-12-31T08:15:00Z",
    userName: "Alice Johnson",
    userRole: "Admin",
    actionCategory: ActionCategory.CREATE,
    actionTaken: "Created new application record",
    actionResult: ActionResult.SUCCESS,
    recordType: RecordType.APPLICATION,
    recordReference: "App-20251231-001"
  },
  {
    id: "2",
    timestamp: "2025-12-31T08:45:00Z",
    userName: "Bob Smith",
    userRole: "Technology Generators",
    actionCategory: ActionCategory.UPDATE,
    actionTaken: "Updated disclosure form",
    actionResult: ActionResult.PENDING,
    recordType: RecordType.DOCUMENT,
    recordReference: "Disclosure_Form_v2.pdf"
  },
  {
    id: "3",
    timestamp: "2025-12-31T09:10:00Z",
    userName: "Charlie Lee",
    userRole: "UP Official",
    actionCategory: ActionCategory.DELETE,
    actionTaken: "Deleted inventor record",
    actionResult: ActionResult.FAILURE,
    recordType: RecordType.INVENTOR,
    recordReference: "Inventor-00023"
  },
  {
    id: "4",
    timestamp: "2025-12-31T09:30:00Z",
    userName: "Dana White",
    userRole: "Admin",
    actionCategory: ActionCategory.ROLE_CHANGE,
    actionTaken: "Changed user role to Technology Generators",
    actionResult: ActionResult.SUCCESS,
    recordType: RecordType.ACCOUNT,
    recordReference: "User-1001"
  },
  {
    id: "5",
    timestamp: "2025-12-31T10:05:00Z",
    userName: "Evan Green",
    userRole: "UP Official",
    actionCategory: ActionCategory.UPLOAD,
    actionTaken: "Uploaded monthly report",
    actionResult: ActionResult.SUCCESS,
    recordType: RecordType.REPORT,
    recordReference: "Monthly_Report_Dec2025.pdf"
  },
  {
    id: "6",
    timestamp: "2025-12-31T10:40:00Z",
    userName: "Fiona Black",
    userRole: "Technology Generators",
    actionCategory: ActionCategory.STATUS_CHANGE,
    actionTaken: "Marked application as reviewed",
    actionResult: ActionResult.SUCCESS,
    recordType: RecordType.APPLICATION,
    recordReference: "App-20251231-002"
  },
  {
    id: "7",
    timestamp: "2025-12-31T11:00:00Z",
    userName: "George King",
    userRole: "UP Official",
    actionCategory: ActionCategory.CREATE,
    actionTaken: "Created new document",
    actionResult: ActionResult.PENDING,
    recordType: RecordType.DOCUMENT,
    recordReference: "New_Document_v1.pdf"
  },
  {
    id: "8",
    timestamp: "2025-12-31T11:25:00Z",
    userName: "Hannah Scott",
    userRole: "Admin",
    actionCategory: ActionCategory.DELETE,
    actionTaken: "Deleted report",
    actionResult: ActionResult.SUCCESS,
    recordType: RecordType.REPORT,
    recordReference: "Monthly_Report_Nov2025.pdf"
  },
  {
    id: "9",
    timestamp: "2025-12-31T11:55:00Z",
    userName: "Ian Brown",
    userRole: "Technology Generators",
    actionCategory: ActionCategory.UPDATE,
    actionTaken: "Updated inventor details",
    actionResult: ActionResult.SUCCESS,
    recordType: RecordType.INVENTOR,
    recordReference: "Inventor-00045"
  },
  {
    id: "10",
    timestamp: "2025-12-31T12:15:00Z",
    userName: "Jane Doe",
    userRole: "UP Official",
    actionCategory: ActionCategory.UPLOAD,
    actionTaken: "Uploaded updated disclosure form",
    actionResult: ActionResult.PENDING,
    recordType: RecordType.DOCUMENT,
    recordReference: "Disclosure_Form_v3.pdf"
  }
];

