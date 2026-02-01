"use client";

import { StatusType } from "@/lib/types/ip";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { formatDate, formatDateTime } from "@/lib/helper/format-date";
import { useGetUserApplicationIds } from "@/hooks/applications/useGetUserApplications";
import { useGetMultipleApplicationStatuses } from "@/hooks/status/useGetMultipleApplicationStatuses";
import { useGetMultipleAppById } from "@/hooks/applications/useGetMultipleApplicationById";

export default function StatusUpdatesPanel() {
  const { userApplicationIds, isLoading: isUserApplicationsLoading } =
    useGetUserApplicationIds();

  const applicationIds =
    userApplicationIds?.map((app) => app.application_id) ?? [];

  const { statuses, isLoading: isStatusesLoading } =
    useGetMultipleApplicationStatuses({
      applicationIds,
      isLatest: true,
    });

  const { applications } = useGetMultipleAppById({
    applicationIds,
  });

  if (isUserApplicationsLoading || isStatusesLoading.every(Boolean)) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Status history
          </h2>
        </div>
        Fetching statuses...
      </div>
    );
  }

  if (!statuses || statuses.length < 1) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Status history
          </h2>
        </div>
        No status history available.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Status history</h2>
      </div>

      <div className="mt-2 max-h-64 space-y-2 overflow-y-auto pr-1">
        {statuses?.map((status, index) => {
          if (!status || Array.isArray(status)) return null;

          const label =
            STATUS_LABELS[status.status_type as StatusType] ??
            status.status_type;

          return (
            <div
              key={status.created_at}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition hover:border-gray-300 hover:bg-gray-100"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="truncate text-sm font-semibold text-gray-700">
                  {applications[index]?.ip_title}
                </h3>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="shrink-0 text-xs text-gray-500">
                      {formatDateTime(status.created_at!)}
                    </p>
                  </div>
                  {status.note && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {status.note}
                    </p>
                  )}
                  {status.deadline && (
                    <span className="mt-1 inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      Deadline: {formatDate(status.deadline)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
