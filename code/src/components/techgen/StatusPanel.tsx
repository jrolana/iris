"use client";

import React from "react";
import { StatusType } from "@/lib/types/ip";
import { IprStatus } from "@/lib/types/status";
import clsx from "clsx";

export const STATUS_LABELS: Partial<Record<StatusType, string>> = {
  draft_classification: "Draft – Classification in progress",
  draft_idf: "Draft – IDF in progress",
  submitted_to_ttbdo: "Submitted to TTBDO",
  under_ttbdo_review: "Under TTBDO review",
  prior_art_search: "Prior art search",
  draft_application: "Drafting IPOPHL application",
  filed_with_ipophil: "Filed with IPOPHL",
  wait_registrability_report: "Waiting for registrability report",
  wait_formality_exam_report: "Waiting for formality exam report",
  wait_substantive_exam_report: "Waiting for substantive exam report",
  wait_notice_publication: "Waiting for notice of publication",
  registered: "Registered",
  closed: "Closed",
};

interface StatusHistoryPanelProps {
  statuses: IprStatus[];
  currentStatusType: StatusType;
  className?: string;
}

export default function StatusHistoryPanel(props: StatusHistoryPanelProps) {
  const { statuses, currentStatusType, className = "" } = props;
  if (!statuses || statuses.length === 0) {
    return (
      <div
        className={
          "rounded-2xl border border-gray-200 bg-white p-4 text-gray-500 " +
          className
        }
      >
        <h2 className="text-lg font-semibold text-gray-800">Status history</h2>
        <p className="mt-2 leading-snug">
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
      className={"rounded-2xl border border-gray-200 bg-white p-4 " + className}
    >
      <h2 className="text-lg font-semibold text-gray-800">Status history</h2>

      {latestStatus?.note && (
        <div className="mt-1 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
          <p className="font-semibold">Latest note from TTBDO</p>
          <p className="mt-1">{latestStatus.note}</p>
          {latestStatus.deadline && (
            <p className="mt-1 text-xs font-medium">
              {`Deadline: ${new Date(latestStatus.deadline).toLocaleDateString()}`}
            </p>
          )}
        </div>
      )}

      <div className="mt-3 max-h-100 space-y-2 overflow-y-auto pr-1">
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
                <p className="font-semibold text-gray-800">{label}</p>
                {status.note && !isLatest && (
                  <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                    {status.note}
                  </p>
                )}
                {status.deadline && (
                  <p className="mt-1 text-xs text-gray-500">
                    {` Deadline: ${new Date(status.deadline).toLocaleDateString()}`}
                  </p>
                )}
              </div>
              <p className="shrink-0 text-xs text-gray-500">
                {new Date(status.created_at).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
