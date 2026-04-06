import type { Page, Route } from "@playwright/test";
import {
  createMockState,
  type ApplicationRecord,
  type DashboardAnalyticsRecord,
  type FileRecord,
  type MockState,
  type PingRecord,
  type RegistrationRequestRecord,
  type ReportRecord,
  type StatusRecord,
  type TestRole,
  type ViewerRole,
} from "./mock-data";

const PUBLIC_RESOURCE_FILES: Record<
  string,
  Array<{
    id: string;
    name: string;
    updated_at: string;
    metadata: { size: number; mimetype: string };
  }>
> = {
  patent: [
    {
      id: "public-patent-disclosure",
      name: "patent-disclosure-form.pdf",
      updated_at: "2026-03-01T09:00:00.000Z",
      metadata: {
        size: 245_760,
        mimetype: "application/pdf",
      },
    },
  ],
  utility_model: [
    {
      id: "public-um-disclosure",
      name: "utility-model-disclosure-form.pdf",
      updated_at: "2026-03-01T09:00:00.000Z",
      metadata: {
        size: 233_472,
        mimetype: "application/pdf",
      },
    },
  ],
};

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
  "access-control-allow-headers": "*",
  "content-type": "application/json",
};

function fulfillJson(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  });
}

function fulfillEmpty(route: Route, status = 204) {
  return route.fulfill({
    status,
    headers: CORS_HEADERS,
    body: "",
  });
}

function parseEqValue(rawValue: string | null) {
  if (!rawValue?.startsWith("eq.")) {
    return null;
  }

  return decodeURIComponent(rawValue.slice(3));
}

function parseInValues(rawValue: string | null) {
  if (!rawValue?.startsWith("in.(") || !rawValue.endsWith(")")) {
    return [];
  }

  return rawValue
    .slice(4, -1)
    .split(",")
    .map((value) => decodeURIComponent(value))
    .filter(Boolean);
}

function readBody(route: Route) {
  const postData = route.request().postData();
  return postData ? (JSON.parse(postData) as Record<string, unknown>) : null;
}

function wantsSingleObject(route: Route) {
  const accept = route.request().headers()["accept"];
  return accept?.includes("application/vnd.pgrst.object+json") ?? false;
}

function isApplicationPublicForGuest(
  state: MockState,
  applicationId: string | null | undefined,
) {
  if (!applicationId) {
    return false;
  }

  const application = state.applications.find((item) => item.id === applicationId);
  const latestStatus = state.statuses.find(
    (status) => status.id === application?.curr_status,
  );

  return latestStatus?.is_public === true;
}

function buildSearchApplications(state: MockState) {
  return state.applications.map((application) => {
    const latestStatus = state.statuses.find(
      (status) => status.id === application.curr_status,
    );
    const inventors = state.inventors.filter(
      (inventor) => inventor.application_id === application.id,
    );

    return {
      id: application.id,
      ip_title: application.ip_title,
      project_title: application.project_title,
      ip_type: application.ip_type,
      filing_date: application.filing_date,
      registration_date: application.registration_date,
      funding_agency: application.funding_source,
      techgens: inventors.map((inventor) => inventor.full_name),
      inventors: inventors.map((inventor) => ({
        full_name: inventor.full_name,
        college:
          inventor.college_code ??
          inventor.external_institution ??
          inventor.other_college_name ??
          "",
        college_name:
          inventor.external_institution ??
          inventor.other_college_name ??
          inventor.college_code ??
          "",
      })),
      colleges: inventors.map(
        (inventor) =>
          inventor.college_code ??
          inventor.external_institution ??
          inventor.other_college_name ??
          "",
      ),
      college_names: inventors.map(
        (inventor) =>
          inventor.external_institution ??
          inventor.other_college_name ??
          inventor.college_code ??
          "",
      ),
      status_type: latestStatus?.status_type ?? "submitted_to_ttbdo",
      is_public: latestStatus?.is_public === true,
      is_archived: application.is_archived ?? false,
      is_withdrawn: application.is_withdrawn ?? false,
      created_at: application.created_at,
      updated_at: application.updated_at,
    };
  });
}

function matchesSearchFilters(
  record: ReturnType<typeof buildSearchApplications>[number],
  body: Record<string, unknown> | null,
) {
  if (!body) {
    return true;
  }

  const title = String(body.p_title ?? "").trim().toLowerCase();
  if (
    title &&
    !`${record.ip_title ?? ""} ${record.project_title}`
      .toLowerCase()
      .includes(title)
  ) {
    return false;
  }

  const statuses = Array.isArray(body.p_statuses) ? body.p_statuses : [];
  if (statuses.length > 0 && !statuses.includes(record.status_type)) {
    return false;
  }

  const ipTypes = Array.isArray(body.p_ip_types) ? body.p_ip_types : [];
  if (ipTypes.length > 0 && !ipTypes.includes(record.ip_type)) {
    return false;
  }

  const colleges = Array.isArray(body.p_colleges) ? body.p_colleges : [];
  if (
    colleges.length > 0 &&
    !record.colleges.some((college) => colleges.includes(college))
  ) {
    return false;
  }

  const techgens = Array.isArray(body.p_techgens)
    ? body.p_techgens.map((value) => String(value).toLowerCase())
    : [];
  if (
    techgens.length > 0 &&
    !record.techgens.some((techgen) =>
      techgens.some((query) => techgen.toLowerCase().includes(query)),
    )
  ) {
    return false;
  }

  return true;
}

function createApplication(state: MockState, body: Record<string, unknown>) {
  const appId = `app-${state.nextGeneratedApplicationId}`;
  const statusId = `status-${state.nextGeneratedStatusId}-current`;
  const now = "2026-03-23T10:00:00.000Z";

  const application: ApplicationRecord = {
    id: appId,
    created_at: now,
    created_by: state.currentUser.id,
    curr_status: statusId,
    filing_date: null,
    funding_source: String(body.p_funding_source ?? ""),
    ip_number: null,
    ip_title: null,
    ip_type: body.p_ip_type as ApplicationRecord["ip_type"],
    is_archived: false,
    is_withdrawn: false,
    parent_application_id: null,
    project_title: String(body.p_project_title ?? ""),
    registration_date: null,
    updated_at: now,
  };

  const status: StatusRecord = {
    id: statusId,
    application_id: appId,
    created_at: now,
    deadline: "2026-04-25T00:00:00.000Z",
    is_public: true,
    note: "Application created from Playwright flow.",
    status_name: null,
    status_type: "submitted_to_ttbdo",
  };

  const inventors = Array.isArray(body.p_inventors) ? body.p_inventors : [];

  state.applications.unshift(application);
  state.statuses.unshift(status);

  inventors.forEach((inventor, index) => {
    const record = inventor as Record<string, unknown>;
    state.inventors.push({
      id: `inventor-generated-${state.nextGeneratedApplicationId}-${index + 1}`,
      application_id: appId,
      college_code: (record.college_code as string | null) ?? null,
      comments: (record.comments as string | null) ?? null,
      email: String(record.email ?? ""),
      external_institution:
        (record.external_institution as string | null) ?? null,
      full_name: String(record.full_name ?? ""),
      other_college_name:
        (record.other_college_name as string | null) ?? null,
      techgen_id: (record.techgen_id as string | null) ?? null,
    });
  });

  state.nextGeneratedApplicationId += 1;
  state.nextGeneratedStatusId += 1;

  return appId;
}

function createRegistrationRequest(
  state: MockState,
  body: Record<string, unknown>,
) {
  const id = `request-${state.nextGeneratedRequestId}`;
  const request: RegistrationRequestRecord = {
    id,
    full_name: String(body.p_full_name ?? ""),
    email: String(body.p_email ?? ""),
    role: body.p_role as RegistrationRequestRecord["role"],
    college_code: (body.p_college_code as string | null) ?? null,
    other_college_name:
      (body.p_other_college_name as string | null) ?? null,
    external_institution:
      (body.p_external_institution as string | null) ?? null,
    invite_expires_at: null,
    requested_at: "2026-03-23T09:00:00.000Z",
    status: "pending",
  };

  state.registrationRequests.unshift(request);
  state.nextGeneratedRequestId += 1;
  return id;
}

function createPing(state: MockState, body: Record<string, unknown>) {
  const id = `ping-${state.nextGeneratedPingId}`;
  const record: PingRecord = {
    id,
    acknowledged_at: null,
    application_id: String(body.application_id ?? ""),
    application_name: String(body.application_name ?? ""),
    created_at: "2026-04-05T09:00:00.000Z",
    stage_delayed: String(body.stage_delayed ?? ""),
    step_delayed: String(body.step_delayed ?? ""),
    target_date: String(body.target_date ?? ""),
  };

  state.pings.unshift(record);
  state.nextGeneratedPingId += 1;
  return record;
}

function createReport(state: MockState, body: Record<string, unknown>) {
  const id = `report-${state.nextGeneratedReportId}`;
  const record: ReportRecord = {
    id,
    application_id: String(body.application_id ?? ""),
    content: String(body.content ?? ""),
    created_at: "2026-04-05T09:10:00.000Z",
    reporter_id: (body.reporter_id as string | null) ?? null,
    reporter_name: (body.reporter_name as string | null) ?? null,
    subject_id: String(body.subject_id ?? ""),
    subject_name: (body.subject_name as string | null) ?? null,
  };

  state.reports.unshift(record);
  state.nextGeneratedReportId += 1;
  return record;
}

function filterDashboardData(
  data: DashboardAnalyticsRecord[],
  searchParams: URLSearchParams,
) {
  return data.filter((item) => {
    const yearFilters = searchParams.getAll("year");
    const gte = yearFilters.find((value) => value.startsWith("gte."));
    const lte = yearFilters.find((value) => value.startsWith("lte."));

    if (gte && item.year !== null && item.year < Number(gte.slice(4))) {
      return false;
    }

    if (lte && item.year !== null && item.year > Number(lte.slice(4))) {
      return false;
    }

    const dashboardStatus = parseEqValue(searchParams.get("dashboard_status"));
    if (dashboardStatus && item.dashboard_status !== dashboardStatus) {
      return false;
    }

    const ipType = parseEqValue(searchParams.get("ip_type"));
    if (ipType && item.ip_type !== ipType) {
      return false;
    }

    return true;
  });
}

function upsertUploadedFile(state: MockState, storagePath: string) {
  const existing = state.files.find((file) => file.storage_path === storagePath);
  if (existing) {
    return existing;
  }

  const [applicationId, fileName] = storagePath.split("/");
  const now = "2026-03-23T10:05:00.000Z";
  const record: FileRecord = {
    id: `file-${state.nextGeneratedFileId}`,
    application_id: applicationId ?? "unknown-app",
    comments: null,
    file_description: null,
    file_name: fileName ?? "uploaded.pdf",
    file_type: "PDF",
    modified_at: now,
    owner_id: state.currentUser.id,
    owner_name: state.currentUser.full_name,
    storage_id: `storage-${state.nextGeneratedFileId}`,
    storage_path: storagePath,
    uploaded_at: now,
  };

  state.files.push(record);
  state.nextGeneratedFileId += 1;
  return record;
}

function createStatus(state: MockState, body: Record<string, unknown>) {
  const applicationId = String(body.application_id ?? "");
  const id = `status-${state.nextGeneratedStatusId}-current`;
  const now = "2026-04-06T09:30:00.000Z";

  const record: StatusRecord = {
    id,
    application_id: applicationId,
    created_at: now,
    deadline: (body.deadline as string | null) ?? null,
    is_public: (body.is_public as boolean | null) ?? false,
    note: (body.note as string | null) ?? null,
    status_name: (body.status_name as string | null) ?? null,
    status_type: String(body.status_type ?? ""),
  };

  state.statuses.unshift(record);

  const applicationIndex = state.applications.findIndex(
    (application) => application.id === applicationId,
  );

  if (applicationIndex >= 0) {
    state.applications[applicationIndex] = {
      ...state.applications[applicationIndex],
      curr_status: id,
      updated_at: now,
    };
  }

  state.nextGeneratedStatusId += 1;
  return record;
}

function createApiToken() {
  return `iris-e2e-token-${Math.random().toString(36).slice(2, 10)}`;
}

async function handleAuth(route: Route, state: MockState, viewerRole: ViewerRole) {
  if (route.request().method() === "OPTIONS") {
    return fulfillEmpty(route);
  }

  const url = new URL(route.request().url());
  if (url.pathname.endsWith("/auth/v1/user")) {
    if (viewerRole === "guest") {
      return fulfillJson(route, { message: "Auth session missing!" }, 401);
    }

    return fulfillJson(route, state.currentUser);
  }

  if (url.pathname.endsWith("/auth/v1/logout")) {
    return fulfillJson(route, {});
  }

  return fulfillJson(route, {});
}

async function handleRpc(
  route: Route,
  state: MockState,
  rpcName: string,
  viewerRole: ViewerRole,
) {
  const body = readBody(route);

  switch (rpcName) {
    case "get_user_role":
      return fulfillJson(route, state.currentUser.role);
    case "search_applications":
      return fulfillJson(
        route,
        buildSearchApplications(state).filter(
          (record) =>
            (viewerRole !== "guest" || record.is_public === true) &&
            matchesSearchFilters(record, body),
        ),
      );
    case "search_users_for_linking": {
      const query = String(body?.search_query ?? "").toLowerCase();
      const excludedIds = Array.isArray(body?.excluded_ids)
        ? body.excluded_ids
        : [];

      return fulfillJson(
        route,
        state.users.filter((user) => {
          if (excludedIds.includes(user.id) || user.role !== "techgen") {
            return false;
          }

          if (!query) {
            return true;
          }

          return (
            user.full_name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
          );
        }),
      );
    }
    case "create_application_with_inventors":
      return fulfillJson(route, createApplication(state, body ?? {}));
    case "submit_registration_request":
      return fulfillJson(route, createRegistrationRequest(state, body ?? {}));
    default:
      return fulfillJson(route, []);
  }
}

function tableRows(state: MockState, tableName: string) {
  switch (tableName) {
    case "users":
      return state.users;
    case "user_registration_requests":
      return state.registrationRequests;
    case "ipr_applications":
      return state.applications;
    case "ipr_statuses":
      return state.statuses;
    case "inventors":
      return state.inventors;
    case "ipr_files":
      return state.files;
    case "notifications":
      return state.notifications;
    case "pings":
      return state.pings;
    case "reports":
      return state.reports;
    case "v_dashboard_analytics":
      return state.dashboardAnalytics;
    default:
      return [];
  }
}

function filterRows<T extends Record<string, unknown>>(
  rows: T[],
  searchParams: URLSearchParams,
) {
  return rows.filter((row) =>
    Array.from(searchParams.entries()).every(([key, value]) => {
      if (key === "select" || key === "order") {
        return true;
      }

      if (value.startsWith("eq.")) {
        return String(row[key]) === decodeURIComponent(value.slice(3));
      }

      if (value.startsWith("in.(")) {
        return parseInValues(value).includes(String(row[key]));
      }

      return true;
    }),
  );
}

function sortRows<T extends Record<string, unknown>>(
  rows: T[],
  searchParams: URLSearchParams,
) {
  const order = searchParams.get("order");
  if (!order) {
    return rows;
  }

  const [field, direction] = order.split(".");
  const sorted = [...rows].sort((left, right) =>
    String(left[field]).localeCompare(String(right[field])),
  );

  return direction === "desc" ? sorted.reverse() : sorted;
}

function updateRows<T extends { id: string } & Record<string, unknown>>(
  rows: T[],
  searchParams: URLSearchParams,
  updates: Record<string, unknown>,
) {
  const id = parseEqValue(searchParams.get("id"));
  if (!id) {
    return [];
  }

  const now = "2026-03-23T10:10:00.000Z";
  const updatedRows: T[] = [];

  rows.forEach((row, index) => {
    if (row.id !== id) {
      return;
    }

    const updatedRow = {
      ...row,
      ...updates,
      ...(Object.prototype.hasOwnProperty.call(row, "updated_at")
        ? { updated_at: now }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(row, "modified_at")
        ? { modified_at: now }
        : {}),
    } as T;

    rows[index] = updatedRow;
    updatedRows.push(updatedRow);
  });

  return updatedRows;
}

function deleteRows<T extends { id: string } & Record<string, unknown>>(
  rows: T[],
  searchParams: URLSearchParams,
) {
  const id = parseEqValue(searchParams.get("id"));
  if (!id) {
    return [];
  }

  const deletedRows = rows.filter((row) => row.id === id);

  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (rows[index].id === id) {
      rows.splice(index, 1);
    }
  }

  return deletedRows;
}

async function handleTable(
  route: Route,
  state: MockState,
  tableName: string,
  viewerRole: ViewerRole,
) {
  const method = route.request().method();
  if (method === "OPTIONS") {
    return fulfillEmpty(route);
  }

  const url = new URL(route.request().url());

  if (tableName === "v_dashboard_analytics" && method === "GET") {
    return fulfillJson(
      route,
      filterDashboardData(state.dashboardAnalytics, url.searchParams),
    );
  }

  const rows = tableRows(state, tableName) as Array<Record<string, unknown>>;
  const guestFilteredRows =
    viewerRole === "guest" && tableName === "ipr_applications"
      ? rows.filter((row) => isApplicationPublicForGuest(state, String(row.id)))
      : rows;

  if (method === "GET") {
    const results = sortRows(
      filterRows(guestFilteredRows, url.searchParams),
      url.searchParams,
    );
    if (wantsSingleObject(route)) {
      return fulfillJson(route, results[0] ?? null, results[0] ? 200 : 404);
    }
    return fulfillJson(route, results);
  }

  if (method === "PATCH") {
    const updatedRows = updateRows(
      rows as Array<{ id: string } & Record<string, unknown>>,
      url.searchParams,
      readBody(route) ?? {},
    );

    if (wantsSingleObject(route)) {
      return fulfillJson(
        route,
        updatedRows[0] ?? null,
        updatedRows[0] ? 200 : 404,
      );
    }

    return fulfillJson(route, updatedRows);
  }

  if (method === "POST") {
    const body = readBody(route);
    const payload = Array.isArray(body) ? body : body ? [body] : [];

    if (tableName === "ipr_statuses") {
      const inserted = payload.map((item) =>
        createStatus(state, item as Record<string, unknown>),
      );
      return fulfillJson(
        route,
        wantsSingleObject(route) ? inserted[0] ?? null : inserted,
      );
    }

    if (tableName === "api_tokens") {
      const inserted = payload.map((item) => ({
        ...(item as Record<string, unknown>),
        token: createApiToken(),
      }));
      return fulfillJson(
        route,
        wantsSingleObject(route) ? inserted[0] ?? null : inserted,
      );
    }

    if (tableName === "pings") {
      const inserted = payload.map((item) =>
        createPing(state, item as Record<string, unknown>),
      );
      return fulfillJson(
        route,
        wantsSingleObject(route) ? inserted[0] ?? null : inserted,
      );
    }

    if (tableName === "reports") {
      const inserted = payload.map((item) =>
        createReport(state, item as Record<string, unknown>),
      );
      return fulfillJson(
        route,
        wantsSingleObject(route) ? inserted[0] ?? null : inserted,
      );
    }

    return fulfillJson(route, []);
  }

  if (method === "DELETE") {
    const deletedRows = deleteRows(
      rows as Array<{ id: string } & Record<string, unknown>>,
      url.searchParams,
    );

    if (wantsSingleObject(route)) {
      return fulfillJson(
        route,
        deletedRows[0] ?? null,
        deletedRows[0] ? 200 : 404,
      );
    }

    return fulfillJson(route, deletedRows);
  }

  return fulfillJson(route, []);
}

async function handleStorage(route: Route, state: MockState) {
  if (route.request().method() === "OPTIONS") {
    return fulfillEmpty(route);
  }

  const url = new URL(route.request().url());

  const listMatch = url.pathname.match(/\/storage\/v1\/object\/list\/([^/]+)$/);
  if (listMatch) {
    const bucketName = listMatch[1];
    const body = readBody(route);
    const prefix = String(body?.prefix ?? "");

    if (bucketName === "ipr_public_resources_bucket") {
      return fulfillJson(route, PUBLIC_RESOURCE_FILES[prefix] ?? []);
    }

    return fulfillJson(route, []);
  }

  const prefix = "/storage/v1/object/";
  const fullStoragePath = decodeURIComponent(url.pathname.slice(prefix.length));
  const [, ...objectPathParts] = fullStoragePath.split("/");
  const objectPath = objectPathParts.join("/");

  upsertUploadedFile(state, objectPath);
  return fulfillJson(route, { Key: objectPath });
}

export async function installSupabaseMocks(page: Page, role: ViewerRole) {
  const state = createMockState(role === "guest" ? "techgen" : role);
  const viewerRole = role;

  await page.route("**/auth/v1/**", async (route) => {
    await handleAuth(route, state, viewerRole);
  });

  await page.route("**/storage/v1/object/sign**", async (route) => {
    const url = new URL(route.request().url());
    const prefix = "/storage/v1/object/sign/";
    const fullStoragePath = decodeURIComponent(url.pathname.slice(prefix.length));
    const signedPath = `/object/sign/${fullStoragePath}?token=playwright-token`;

    await fulfillJson(route, {
      signedURL: signedPath,
    });
  });

  await page.route("**/storage/v1/object/**", async (route) => {
    await handleStorage(route, state);
  });

  await page.route("**/rest/v1/**", async (route) => {
    const url = new URL(route.request().url());
    const rpcMatch = url.pathname.match(/\/rest\/v1\/rpc\/([^/]+)$/);

    if (rpcMatch) {
      await handleRpc(route, state, rpcMatch[1], viewerRole);
      return;
    }

    const tableName = url.pathname.split("/").pop();
    if (!tableName) {
      await fulfillJson(route, []);
      return;
    }

    await handleTable(route, state, tableName, viewerRole);
  });

  return state;
}
