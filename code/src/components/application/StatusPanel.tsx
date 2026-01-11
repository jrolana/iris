"use client";

import { StatusType } from "@/lib/types/ip";
import { IprStatus } from "@/lib/types/status";
import clsx from "clsx";
import { STATUS_LABELS } from "@/lib/helper/status-labels";

interface StatusHistoryPanelProps {
  statuses: IprStatus[];
  currentStatusType: StatusType;
  variant?: "techgen" | "ttbdo";
  className?: string;
  // For TTBDO only – triggers the “unsaved changes” flow
  onStartStatusUpdate?: () => void;
}

export default function StatusHistoryPanel(props: StatusHistoryPanelProps) {
  const {
    statuses,
    currentStatusType,
    variant = "techgen",
    className = "",
    onStartStatusUpdate,
  } = props;
  if (!statuses || statuses.length === 0) {
    return (
      <div
        className={
          "rounded-2xl border border-gray-200 bg-white p-4 text-gray-500 " +
          className
        }
      >
        <h2 className="text-lg font-semibold text-gray-900">Status history</h2>
        <p className="text-md mt-2 leading-snug">
          No status records yet. TTBDO updates will appear here once the
          application starts moving through the process.
        </p>
      </div>
    );
  }

  // The query might have sorted these already
  const sortedStatuses = [...statuses].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const latestStatus = sortedStatuses[0];

  return (
    <div
      className={
        "rounded-2xl border border-gray-200 bg-white p-4 text-gray-700 " +
        className
      }
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">Status history</h2>
        {variant === "ttbdo" && onStartStatusUpdate && (
          <button
            type="button"
            onClick={onStartStatusUpdate}
            className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700 hover:bg-sky-100"
          >
            Update status
          </button>
        )}
      </div>

      {latestStatus?.note && (
        <div className="mt-1 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">
            {variant === "ttbdo"
              ? "Latest note for records"
              : "Latest note from TTBDO"}
          </p>
          <p className="mt-1">{latestStatus.note}</p>
          {latestStatus.deadline && (
            <p className="mt-1 text-sm font-medium">
              {`Deadline: ${new Date(latestStatus.deadline).toLocaleDateString()}`}
            </p>
          )}
        </div>
      )}

      <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
        {sortedStatuses.map((status) => {
          const label = STATUS_LABELS[status.status_type] ?? status.status_type;
          const isCurrent = status.status_type === currentStatusType;
          const isLatest = status.statusId === latestStatus?.statusId;

          return (
            <div
              key={status.statusId}
              className={clsx(
                "flex items-start justify-between gap-3 rounded-lg border px-3 py-2",
                isCurrent
                  ? "border-2 border-sky-500 bg-sky-50"
                  : "border-gray-100 bg-gray-50",
              )}
            >
              <div className="flex-1">
                <p className="text-md font-semibold text-gray-800">{label}</p>
                {status.note && !isLatest && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {status.note}
                  </p>
                )}
                {status.deadline && (
                  <p className="mt-1 text-sm text-gray-500">
                    {` Deadline: ${new Date(status.deadline).toLocaleDateString()}`}
                  </p>
                )}
              </div>
              <p className="shrink-0 text-sm text-gray-500">
                {new Date(status.created_at).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
