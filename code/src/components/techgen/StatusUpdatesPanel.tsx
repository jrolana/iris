"use client";

import { StatusType } from "@/lib/types/ip";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { formatDate, formatDateTime } from "@/lib/helper/format-date";
import { useGetMultipleApplicationStatuses } from "@/hooks/status/useGetMultipleApplicationStatuses";
import { useGetMultipleAppById } from "@/hooks/applications/useGetMultipleApplicationById";
import { IprStatusType } from "@/lib/types/status";
import { ReactNode } from "react";

interface PropsInterface {
  applicationIds: string[];
}

export default function StatusUpdatesPanel(props: PropsInterface) {
  const { applicationIds } = props;

  const { statuses, isLoading: isStatusesLoading } =
    useGetMultipleApplicationStatuses({
      applicationIds,
      isLatest: true,
    });

  const { applications } = useGetMultipleAppById({
    applicationIds,
  });

  if (isStatusesLoading.every(Boolean)) {
    return <StatusUpdateContainer>Fetching statuses...</StatusUpdateContainer>;
  }

  if (
    !statuses ||
    statuses.length < 1 ||
    !applications ||
    applications.length < 1
  ) {
    return (
      <StatusUpdateContainer>
        No status history available.
      </StatusUpdateContainer>
    );
  }

  const statusList = statuses
    .map((status, i) => {
      if (Array.isArray(status)) return null;
      const application = applications[i];
      if (!status || !application) return null;
      if (!status.created_at) return null;

      const timestamp = Date.parse(status.created_at);
      if (isNaN(timestamp)) return null;

      return { ipTitle: application.ip_title, status, timestamp };
    })
    .filter(
      (
        item,
      ): item is {
        ipTitle: string;
        status: IprStatusType["Row"];
        timestamp: number;
      } => item !== null,
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(({ timestamp, ...rest }) => rest);

  return (
    <StatusUpdateContainer>
      <div className="mt-2 h-full space-y-2 overflow-y-auto pr-1">
        {statusList.map((item) => {
          const label =
            STATUS_LABELS[item.status.status_type as StatusType] ??
            item.status.status_type;

          return (
            <div
              key={item.status.created_at}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition hover:border-gray-300 hover:bg-gray-100"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="truncate text-sm font-semibold text-gray-700">
                  {item.ipTitle}
                </h3>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="shrink-0 text-xs text-gray-500">
                      {formatDateTime(item.status.created_at!)}
                    </p>
                  </div>
                  {item.status.note && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {item.status.note}
                    </p>
                  )}
                  {item.status.deadline && (
                    <span className="mt-1 inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      Deadline: {formatDate(item.status.deadline)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </StatusUpdateContainer>
  );
}

function StatusUpdateContainer({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Status history</h2>
      </div>
      {children}
    </div>
  );
}
