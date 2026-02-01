"use client";

import useStatusUpdateModal from "@/hooks/useStatusUpdateModal";
import { StatusType } from "@/lib/types/ip";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import clsx from "clsx";

import { useGetApplicationStatuses } from "@/hooks/status/useGetApplicationStatuses";
import { useEffect } from "react";
import { formatDate, formatDateTime } from "@/lib/helper/format-date";

interface StatusHistoryPanelProps {
  applicationId: string;
  variant?: "techgen" | "ttbdo";
}

export default function StatusHistoryPanel(props: StatusHistoryPanelProps) {
  const { applicationId, variant = "techgen" } = props;
  const { openModal } = useStatusUpdateModal();

  const { statuses, isLoading, queryClient } = useGetApplicationStatuses({
    applicationId,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["latest-status"] });
  }, [queryClient]);

  function handleClickUpdate() {
    openModal();
  }

  const statusArray = Array.isArray(statuses) ? statuses : [statuses];
  const latestStatus = statusArray[0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Status history</h2>

        {variant === "ttbdo" && (
          <button
            type="button"
            onClick={handleClickUpdate}
            className="rounded-full bg-sky-600 px-3 py-1 text-sm font-medium text-white hover:bg-sky-700"
          >
            Update status
          </button>
        )}
      </div>

      {isLoading && <div>Fetching status...</div>}

      {latestStatus?.note && (
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-semibold text-amber-900">
            {variant === "ttbdo"
              ? "Latest note (for records)"
              : "Latest note from TTBDO"}
          </p>

          <p className="mt-1 text-sm text-amber-900">{latestStatus.note}</p>

          {latestStatus.deadline && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                Deadline · {formatDate(latestStatus.deadline)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mt-2 max-h-64 space-y-2 overflow-y-auto pr-1">
        {statusArray.map((status) => {
          if (!status || !latestStatus) return null;

          const label =
            STATUS_LABELS[status.status_type as StatusType] ??
            status.status_type;

          const isCurrent = status.status_type === latestStatus.status_type;
          const isLatest = status.id === latestStatus.id;

          return (
            <div
              key={status.id}
              className={clsx(
                "rounded-xl border px-3 py-2 transition",
                isCurrent
                  ? "border-sky-400 bg-sky-50"
                  : "border-gray-200 bg-gray-50",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{label}</p>

                  {status.note && !isLatest && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {status.note}
                    </p>
                  )}

                  {status.deadline && (
                    <span
                      className={clsx(
                        "mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        isLatest
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-gray-200 bg-gray-50 text-gray-700",
                      )}
                    >
                      Deadline: {formatDate(status.deadline)}
                    </span>
                  )}
                </div>

                <p className="shrink-0 text-xs text-gray-500">
                  {formatDateTime(status.created_at!)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {!latestStatus &&
        statusArray.length < 1 &&
        (variant == "ttbdo" ? (
          <div>No status history yet. Update status to add. </div>
        ) : (
          <div>No status history yet.</div>
        ))}
    </div>
  );
}
