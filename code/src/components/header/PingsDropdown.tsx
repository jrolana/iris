"use client";

import { ReactNode, useMemo, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { differenceInCalendarDays, isToday } from "date-fns";
import { formatDateTime, formatTime } from "@/lib/helper/format-date";
import { useRouter } from "next/navigation";

type StatusUpdateRequest = {
  id: string;
  curr_stage: string;
  app_id: string;
  app_name: string;
  target_date: string; // ISO
  requested_at: string; // ISO
  acknowledged_at: string | null; // ISO|null
};

export default function PingsDropdown() {
  const [requests, setRequests] =
    useState<StatusUpdateRequest[]>(dummyRequests);
  const [savingId, setSavingId] = useState<string | null>(null);

  const router = useRouter();

  const pendingCount = useMemo(
    () => requests.reduce((acc, r) => acc + (r.acknowledged_at ? 0 : 1), 0),
    [requests],
  );

  const hasPendingOfficeResponse = pendingCount > 0;

  const visibleRequests = useMemo(() => {
    // Pending first, then most delayed first
    return [...requests].sort((a, b) => {
      const aAck = a.acknowledged_at ? 1 : 0;
      const bAck = b.acknowledged_at ? 1 : 0;
      if (aAck !== bAck) return aAck - bAck;
      return daysDelayed(b.target_date) - daysDelayed(a.target_date);
    });
  }, [requests]);

  function handleViewAll() {
    router.push("/admin/pings");
  }

  function handleOpenApplication(appId: string) {
    console.log("Open application:", appId);
  }

  async function acknowledgeRequest(requestId: string) {
    if (savingId) return;
    setSavingId(requestId);

    await new Promise((r) => setTimeout(r, 350));

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, acknowledged_at: new Date().toISOString() }
          : r,
      ),
    );

    setSavingId(null);
  }

  const isLoading = false;
  if (isLoading) return <RequestBody>Loading…</RequestBody>;
  if (!visibleRequests.length)
    return <RequestBody>No requests yet.</RequestBody>;

  return (
    <RequestContainer hasPendingOfficeResponse={hasPendingOfficeResponse}>
      <div className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">
            Requests
          </div>
          <div className="text-sm font-semibold text-gray-800">
            Status update queue
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {pendingCount > 0 ? (
            <Pill tone="rose">{pendingCount} pending</Pill>
          ) : (
            <Pill tone="emerald">All clear</Pill>
          )}
          <Pill tone="gray">{requests.length} total</Pill>
        </div>
      </div>

      {/* List */}
      <ul className="custom-scrollbar flex max-h-[340px] flex-col gap-2 overflow-y-auto pr-1">
        {visibleRequests.map((req) => {
          const isAck = Boolean(req.acknowledged_at);
          const saving = savingId === req.id;
          const delayedDays = daysDelayed(req.target_date);

          return (
            <li key={req.id}>
              <DropdownItem
                onItemClick={() => handleOpenApplication(req.app_id)}
                className="group rounded-xl border border-gray-200 bg-white px-3 py-2.5 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">
                        {req.curr_stage}
                      </span>

                      {delayedDays > 0 ? (
                        <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                          {delayedDays}d delayed
                        </span>
                      ) : null}
                    </div>

                    {/* App name */}
                    <div className="mt-1 truncate text-sm font-semibold text-gray-900">
                      {req.app_name}
                    </div>

                    {/* Meta row */}
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-gray-600">
                      <span>
                        <span className="font-medium text-gray-700">
                          Target:
                        </span>{" "}
                        {formatSmartDate(req.target_date)}
                      </span>

                      {isAck && req.acknowledged_at ? (
                        <span className="text-emerald-700">
                          Received {formatSmartDate(req.acknowledged_at)}
                        </span>
                      ) : (
                        <span>
                          <span className="font-medium text-gray-700">
                            Requested:
                          </span>{" "}
                          {formatSmartDate(req.requested_at)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenApplication(req.app_id);
                      }}
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
                      aria-label="Open application"
                      title="Open application"
                    >
                      Open application
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="stroke-current"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 17L17 7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 7H17V14"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Right: real button */}
                  <div className="shrink-0">
                    {isAck ? (
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                        Received
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          acknowledgeRequest(req.id);
                        }}
                        disabled={saving}
                        className={[
                          "inline-flex items-center justify-center rounded-lg px-3.5 py-2",
                          "text-[11px] font-semibold tracking-wide uppercase",
                          "border border-emerald-700/20 bg-emerald-600 text-white shadow-sm",
                          "hover:bg-emerald-700 hover:shadow",
                          "active:translate-y-[0.5px] active:shadow-sm",
                          "focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1 focus:outline-none",
                          saving ? "cursor-wait opacity-80" : "",
                        ].join(" ")}
                      >
                        {saving ? "Saving…" : "Acknowledge"}
                      </button>
                    )}
                  </div>
                </div>
              </DropdownItem>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <button
        onClick={handleViewAll}
        className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-gray-700 uppercase transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-orange-200 focus:ring-offset-1 focus:outline-none"
      >
        View All Requests
      </button>
    </RequestContainer>
  );
}

function RequestBody({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 text-sm text-gray-600 shadow-sm">
      {children}
    </div>
  );
}

interface PropsInterface {
  children: ReactNode;
  hasPendingOfficeResponse?: boolean;
}

function RequestContainer({
  children,
  hasPendingOfficeResponse = false,
}: PropsInterface) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen((v) => !v);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const triggerBase =
    "relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition";
  const triggerHover =
    "hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200";

  return (
    <div className="relative">
      <button
        className={[triggerBase, triggerHover].join(" ")}
        onClick={toggleDropdown}
        aria-label="Open requests"
        title="Open requests"
      >
        {hasPendingOfficeResponse ? (
          <>
            <span className="absolute -inset-1 rounded-full ring-2 ring-rose-300/70" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
          </>
        ) : null}

        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.25 7C11.25 6.58579 11.5858 6.25 12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V11.4393L15.5303 14.2197C15.8232 14.5126 15.8232 14.9874 15.5303 15.2803C15.2374 15.5732 14.7626 15.5732 14.4697 15.2803L11.4697 12.2803C11.329 12.1397 11.25 11.9489 11.25 11.75V7Z"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="shadow-theme-lg absolute left-0 mt-3 flex h-fit w-screen max-w-[380px] flex-col rounded-2xl border border-gray-200 bg-white p-3 lg:right-0 lg:left-auto"
      >
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
          <h5 className="text-base font-semibold text-gray-900">
            Status Update Requests
          </h5>
          <button
            onClick={toggleDropdown}
            className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
            title="Close"
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {children}
      </Dropdown>
    </div>
  );
}

function Pill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "rose" | "amber" | "emerald" | "gray";
}) {
  const styles =
    tone === "rose"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : tone === "emerald"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-gray-200 bg-white text-gray-700";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
        styles,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/* ---------- Date helpers ---------- */

function daysDelayed(targetISO: string) {
  const diff = differenceInCalendarDays(new Date(), new Date(targetISO));
  return Math.max(diff, 0);
}

function formatSmartDate(iso: string) {
  const d = new Date(iso);
  return isToday(d) ? formatTime(iso) : formatDateTime(iso);
}

/* ---------- Dummy data ---------- */

function dummyRequests(): StatusUpdateRequest[] {
  const now = new Date();
  const iso = (d: Date) => d.toISOString();
  const days = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + n);
    return d;
  };
  const hoursAgo = (h: number) => {
    const d = new Date(now);
    d.setHours(d.getHours() - h);
    return d;
  };

  return [
    {
      id: "req_001",
      curr_stage: "Evaluation",
      app_id: "APP-10421",
      app_name: "Techgen Permit Renewal",
      target_date: iso(days(-5)),
      requested_at: iso(hoursAgo(9)),
      acknowledged_at: null,
    },
    {
      id: "req_002",
      curr_stage: "Payment",
      app_id: "APP-10436",
      app_name: "Business License — Santos Trading",
      target_date: iso(days(-2)),
      requested_at: iso(hoursAgo(20)),
      acknowledged_at: null,
    },
    {
      id: "req_003",
      curr_stage: "Inspection",
      app_id: "APP-10398",
      app_name: "Fire Safety Clearance",
      target_date: iso(days(1)),
      requested_at: iso(hoursAgo(35)),
      acknowledged_at: null,
    },
  ];
}
