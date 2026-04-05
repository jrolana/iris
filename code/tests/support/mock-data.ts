export type TestRole = "admin" | "techgen" | "up-official";

export type TestUser = {
  id: string;
  email: string;
  full_name: string;
  role: TestRole;
  college_code: string | null;
  external_institution: string | null;
  other_college_name: string | null;
  created_at: string;
  is_active: boolean;
  image_url?: string;
};

export type ApplicationRecord = {
  id: string;
  created_at: string | null;
  created_by: string | null;
  curr_status: string | null;
  filing_date: string | null;
  funding_source: string;
  ip_number: string | null;
  ip_title: string | null;
  ip_type:
    | "patent"
    | "utility_model"
    | "industrial_design"
    | "trademark"
    | "copyright";
  is_archived: boolean | null;
  is_withdrawn: boolean | null;
  parent_application_id: string | null;
  project_title: string;
  registration_date: string | null;
  updated_at: string | null;
};

export type StatusRecord = {
  application_id: string;
  created_at: string | null;
  deadline: string | null;
  id: string;
  is_public: boolean | null;
  note: string | null;
  status_name: string | null;
  status_type: string;
};

export type InventorRecord = {
  application_id: string;
  college_code: string | null;
  comments: string | null;
  email: string;
  external_institution: string | null;
  full_name: string;
  id: string;
  other_college_name: string | null;
  techgen_id: string | null;
};

export type FileRecord = {
  application_id: string;
  comments: string | null;
  file_description: string | null;
  file_name: string;
  file_type: string;
  id: string;
  modified_at: string | null;
  owner_id: string;
  owner_name: string | null;
  storage_id: string | null;
  storage_path: string;
  uploaded_at: string | null;
};

export type NotificationRecord = {
  application_id: string | null;
  category: string | null;
  content: string;
  created_at: string | null;
  id: string;
  read_at: string | null;
  receiver_id: string;
  title: string;
};

export type PingRecord = {
  acknowledged_at: string | null;
  application_id: string;
  application_name: string;
  created_at: string;
  id: string;
  stage_delayed: string;
  step_delayed: string;
  target_date: string;
};

export type ReportRecord = {
  application_id: string;
  content: string;
  created_at: string | null;
  id: string;
  reporter_id: string | null;
  reporter_name: string | null;
  subject_id: string;
  subject_name: string | null;
};

export type RegistrationRequestRecord = {
  college_code: string | null;
  email: string;
  external_institution: string | null;
  full_name: string;
  id: string;
  invite_expires_at: string | null;
  other_college_name: string | null;
  requested_at: string;
  role: TestRole;
  status: "approved" | "rejected" | "pending";
};

export type DashboardAnalyticsRecord = {
  dashboard_status: "filed" | "granted" | "pending" | "withdrawn" | "downgraded";
  ip_type:
    | "patent"
    | "utility_model"
    | "industrial_design"
    | "trademark"
    | "copyright"
    | null;
  total: number | null;
  year: number | null;
};

export type MockState = {
  currentUser: TestUser;
  users: TestUser[];
  applications: ApplicationRecord[];
  statuses: StatusRecord[];
  inventors: InventorRecord[];
  files: FileRecord[];
  notifications: NotificationRecord[];
  pings: PingRecord[];
  reports: ReportRecord[];
  registrationRequests: RegistrationRequestRecord[];
  dashboardAnalytics: DashboardAnalyticsRecord[];
  nextGeneratedApplicationId: number;
  nextGeneratedStatusId: number;
  nextGeneratedFileId: number;
  nextGeneratedPingId: number;
  nextGeneratedReportId: number;
  nextGeneratedRequestId: number;
};

const ADMIN_USER: TestUser = {
  id: "user-admin-1",
  full_name: "admin iris",
  email: "ttbdo.iris@gmail.com",
  role: "admin",
  college_code: null,
  external_institution: null,
  other_college_name: null,
  created_at: "2025-01-02T09:00:00.000Z",
  is_active: true,
};

const TECHGEN_USER: TestUser = {
  id: "user-techgen-1",
  full_name: "techgen iris",
  email: "techgen.iris@gmail.com",
  role: "techgen",
  college_code: "COT",
  external_institution: null,
  other_college_name: null,
  created_at: "2025-01-05T09:00:00.000Z",
  is_active: true,
};

const UP_OFFICIAL_USER: TestUser = {
  id: "user-up-1",
  full_name: "upofficial iris",
  email: "upofficial.iris@gmail.com",
  role: "up-official",
  college_code: null,
  external_institution: null,
  other_college_name: null,
  created_at: "2025-01-10T09:00:00.000Z",
  is_active: true,
};

export const ROLE_USERS: Record<TestRole, TestUser> = {
  admin: ADMIN_USER,
  techgen: TECHGEN_USER,
  "up-official": UP_OFFICIAL_USER,
};

const USERS: TestUser[] = [
  TECHGEN_USER,
  ADMIN_USER,
  UP_OFFICIAL_USER,
  {
    id: "user-techgen-2",
    full_name: "jrolana",
    email: "jrolana@up.edu.ph",
    role: "techgen",
    college_code: "CAS",
    external_institution: null,
    other_college_name: null,
    created_at: "2025-01-12T09:00:00.000Z",
    is_active: true,
  },
  {
    id: "user-admin-2",
    full_name: "Jhoanna Olana",
    email: "olanajhoanna@gmail.com",
    role: "admin",
    college_code: null,
    external_institution: null,
    other_college_name: null,
    created_at: "2025-01-14T09:00:00.000Z",
    is_active: true,
  },
  {
    id: "user-techgen-3",
    full_name: "Jhoanna Olana",
    email: "jhoannaolana91@gmail.com",
    role: "techgen",
    college_code: null,
    external_institution: "Harvard",
    other_college_name: null,
    created_at: "2025-01-16T09:00:00.000Z",
    is_active: true,
  },
  {
    id: "user-techgen-4",
    full_name: "Jhoanna Olana",
    email: "sharpeidugong@gmail.com",
    role: "techgen",
    college_code: null,
    external_institution: "wvsu",
    other_college_name: null,
    created_at: "2025-01-18T09:00:00.000Z",
    is_active: true,
  },
];

const APPLICATIONS: ApplicationRecord[] = [
  {
    id: "app-1",
    created_at: "2025-01-15T08:00:00.000Z",
    created_by: TECHGEN_USER.id,
    curr_status: "status-1-current",
    filing_date: null,
    funding_source: "DOST",
    ip_number: null,
    ip_title: "Solar Water Purifier",
    ip_type: "patent",
    is_archived: false,
    is_withdrawn: false,
    parent_application_id: null,
    project_title: "Solar Water Purifier",
    registration_date: null,
    updated_at: "2025-02-02T10:00:00.000Z",
  },
  {
    id: "app-2",
    created_at: "2024-11-20T08:00:00.000Z",
    created_by: TECHGEN_USER.id,
    curr_status: "status-2-current",
    filing_date: "2025-01-28T00:00:00.000Z",
    funding_source: "CHED",
    ip_number: "TM-2025-004",
    ip_title: "IRIS Brandmark",
    ip_type: "trademark",
    is_archived: false,
    is_withdrawn: false,
    parent_application_id: null,
    project_title: "IRIS Brand Identity",
    registration_date: null,
    updated_at: "2025-02-12T09:30:00.000Z",
  },
  {
    id: "app-3",
    created_at: "2024-06-01T08:00:00.000Z",
    created_by: "user-techgen-2",
    curr_status: "status-3-current",
    filing_date: "2024-07-12T00:00:00.000Z",
    funding_source: "UPV Research Grant",
    ip_number: "CR-2024-009",
    ip_title: "Campus Analytics Toolkit",
    ip_type: "copyright",
    is_archived: true,
    is_withdrawn: false,
    parent_application_id: null,
    project_title: "Campus Analytics Toolkit",
    registration_date: "2024-10-02T00:00:00.000Z",
    updated_at: "2024-11-10T12:00:00.000Z",
  },
];

const STATUSES: StatusRecord[] = [
  {
    id: "status-1-current",
    application_id: "app-1",
    created_at: "2025-02-02T10:00:00.000Z",
    deadline: "2025-03-15T00:00:00.000Z",
    is_public: true,
    note: "TTBDO is reviewing the disclosure packet.",
    status_name: null,
    status_type: "under_ttbdo_review",
  },
  {
    id: "status-1-initial",
    application_id: "app-1",
    created_at: "2025-01-15T08:30:00.000Z",
    deadline: null,
    is_public: true,
    note: "Application submitted to TTBDO.",
    status_name: null,
    status_type: "submitted_to_ttbdo",
  },
  {
    id: "status-2-current",
    application_id: "app-2",
    created_at: "2025-02-10T09:30:00.000Z",
    deadline: "2026-04-10T00:00:00.000Z",
    is_public: true,
    note: "Awaiting registrability report from IPOPHL.",
    status_name: null,
    status_type: "wait_registrability_report",
  },
  {
    id: "status-3-current",
    application_id: "app-3",
    created_at: "2024-10-02T11:00:00.000Z",
    deadline: null,
    is_public: true,
    note: "Certificate has been received and recorded.",
    status_name: null,
    status_type: "registered",
  },
];

const INVENTORS: InventorRecord[] = [
  {
    id: "inventor-1",
    application_id: "app-1",
    college_code: "COT",
    comments: null,
    email: TECHGEN_USER.email,
    external_institution: null,
    full_name: TECHGEN_USER.full_name,
    other_college_name: null,
    techgen_id: TECHGEN_USER.id,
  },
  {
    id: "inventor-2",
    application_id: "app-1",
    college_code: "CAS",
    comments: null,
    email: "jrolana@up.edu.ph",
    external_institution: null,
    full_name: "jrolana",
    other_college_name: null,
    techgen_id: "user-techgen-2",
  },
  {
    id: "inventor-3",
    application_id: "app-2",
    college_code: "COT",
    comments: null,
    email: TECHGEN_USER.email,
    external_institution: null,
    full_name: TECHGEN_USER.full_name,
    other_college_name: null,
    techgen_id: TECHGEN_USER.id,
  },
  {
    id: "inventor-5",
    application_id: "app-1",
    college_code: null,
    comments: "Awaiting account linking",
    email: "jhoannaolana91@gmail.com",
    external_institution: "Harvard",
    full_name: "Jhoanna O.",
    other_college_name: null,
    techgen_id: null,
  },
  {
    id: "inventor-4",
    application_id: "app-3",
    college_code: null,
    comments: null,
    email: "jhoannaolana91@gmail.com",
    external_institution: "Harvard",
    full_name: "Jhoanna Olana",
    other_college_name: null,
    techgen_id: "user-techgen-3",
  },
];

const FILES: FileRecord[] = [
  {
    id: "file-1",
    application_id: "app-1",
    comments: "Latest version",
    file_description: "Signed patent disclosure bundle v2",
    file_name: "disclosure.pdf",
    file_type: "PDF",
    modified_at: "2025-01-20T09:00:00.000Z",
    owner_id: TECHGEN_USER.id,
    owner_name: TECHGEN_USER.full_name,
    storage_id: "storage-1",
    storage_path: "app-1/disclosure.pdf/storage-1",
    uploaded_at: "2025-01-20T09:00:00.000Z",
  },
  {
    id: "file-2",
    application_id: "app-1",
    comments: "Superseded version",
    file_description: "Signed patent disclosure bundle v1",
    file_name: "disclosure.pdf",
    file_type: "PDF",
    modified_at: "2025-01-15T09:00:00.000Z",
    owner_id: TECHGEN_USER.id,
    owner_name: TECHGEN_USER.full_name,
    storage_id: "storage-2",
    storage_path: "app-1/disclosure.pdf/storage-2",
    uploaded_at: "2025-01-15T09:00:00.000Z",
  },
  {
    id: "file-3",
    application_id: "app-1",
    comments: null,
    file_description: "Market validation summary",
    file_name: "market-summary.pdf",
    file_type: "PDF",
    modified_at: "2025-01-18T09:00:00.000Z",
    owner_id: "user-techgen-2",
    owner_name: "jrolana",
    storage_id: "storage-3",
    storage_path: "app-1/market-summary.pdf/storage-3",
    uploaded_at: "2025-01-18T09:00:00.000Z",
  },
];

const NOTIFICATIONS: NotificationRecord[] = [
  {
    id: "notif-1",
    application_id: "app-1",
    category: "status",
    content: "Solar Water Purifier moved to TTBDO review.",
    created_at: "2026-03-20T08:00:00.000Z",
    read_at: null,
    receiver_id: TECHGEN_USER.id,
    title: "Status updated",
  },
  {
    id: "notif-2",
    application_id: "app-2",
    category: "status",
    content: "IRIS Brand Identity now has a new deadline.",
    created_at: "2026-03-18T10:00:00.000Z",
    read_at: "2026-03-18T12:00:00.000Z",
    receiver_id: TECHGEN_USER.id,
    title: "Deadline adjusted",
  },
  {
    id: "notif-3",
    application_id: "app-1",
    category: "office",
    content: "A techgen asked for clarification on the patent filing packet.",
    created_at: "2026-03-19T11:00:00.000Z",
    read_at: null,
    receiver_id: ADMIN_USER.id,
    title: "Techgen reply received",
  },
  {
    id: "notif-4",
    application_id: "app-2",
    category: "office",
    content: "Trademark application is waiting for office action handling.",
    created_at: "2026-03-17T09:00:00.000Z",
    read_at: "2026-03-17T12:00:00.000Z",
    receiver_id: ADMIN_USER.id,
    title: "Trademark queue reminder",
  },
  {
    id: "notif-5",
    application_id: "app-1",
    category: "status",
    content: "Solar Water Purifier is visible for office monitoring.",
    created_at: "2026-03-15T09:00:00.000Z",
    read_at: null,
    receiver_id: UP_OFFICIAL_USER.id,
    title: "Application visible",
  },
];

const PINGS: PingRecord[] = [
  {
    id: "ping-2",
    acknowledged_at: "2026-03-18T12:00:00.000Z",
    application_id: "app-2",
    application_name: "IRIS Brand Identity",
    created_at: "2026-03-16T08:00:00.000Z",
    stage_delayed: "IPOPHL",
    step_delayed: "wait_registrability_report",
    target_date: "2026-03-12T00:00:00.000Z",
  },
];

const REPORTS: ReportRecord[] = [];

const REGISTRATION_REQUESTS: RegistrationRequestRecord[] = [
  {
    id: "request-1",
    college_code: "CAS",
    email: "new.techgen@up.edu.ph",
    external_institution: null,
    full_name: "New Techgen",
    invite_expires_at: null,
    other_college_name: null,
    requested_at: "2026-03-10T08:00:00.000Z",
    role: "techgen",
    status: "pending",
  },
  {
    id: "request-2",
    college_code: null,
    email: "external.collab@example.com",
    external_institution: "WVSU",
    full_name: "External Collaborator",
    invite_expires_at: "2026-03-22T08:00:00.000Z",
    other_college_name: null,
    requested_at: "2026-03-08T08:00:00.000Z",
    role: "techgen",
    status: "approved",
  },
];

const DASHBOARD_ANALYTICS: DashboardAnalyticsRecord[] = [
  { year: 2024, dashboard_status: "filed", ip_type: "patent", total: 4 },
  { year: 2024, dashboard_status: "granted", ip_type: "patent", total: 1 },
  { year: 2024, dashboard_status: "pending", ip_type: "trademark", total: 2 },
  { year: 2024, dashboard_status: "withdrawn", ip_type: "copyright", total: 1 },
  { year: 2024, dashboard_status: "downgraded", ip_type: "utility_model", total: 1 },
  { year: 2025, dashboard_status: "filed", ip_type: "patent", total: 6 },
  { year: 2025, dashboard_status: "granted", ip_type: "copyright", total: 2 },
  { year: 2025, dashboard_status: "pending", ip_type: "trademark", total: 4 },
  { year: 2025, dashboard_status: "pending", ip_type: "industrial_design", total: 2 },
  { year: 2025, dashboard_status: "withdrawn", ip_type: "patent", total: 1 },
  { year: 2025, dashboard_status: "downgraded", ip_type: "utility_model", total: 1 },
  { year: 2026, dashboard_status: "filed", ip_type: "patent", total: 3 },
  { year: 2026, dashboard_status: "granted", ip_type: "trademark", total: 1 },
  { year: 2026, dashboard_status: "pending", ip_type: "patent", total: 5 },
  { year: 2026, dashboard_status: "withdrawn", ip_type: "copyright", total: 1 },
  { year: 2026, dashboard_status: "downgraded", ip_type: "utility_model", total: 1 },
];

export function createMockState(role: TestRole): MockState {
  return structuredClone({
    currentUser: ROLE_USERS[role],
    users: USERS,
    applications: APPLICATIONS,
    statuses: STATUSES,
    inventors: INVENTORS,
    files: FILES,
    notifications: NOTIFICATIONS,
    pings: PINGS,
    reports: REPORTS,
    registrationRequests: REGISTRATION_REQUESTS,
    dashboardAnalytics: DASHBOARD_ANALYTICS,
    nextGeneratedApplicationId: 4,
    nextGeneratedStatusId: 4,
    nextGeneratedFileId: 4,
    nextGeneratedPingId: 3,
    nextGeneratedReportId: 1,
    nextGeneratedRequestId: 3,
  });
}
