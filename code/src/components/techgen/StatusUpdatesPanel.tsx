"use client";

import Link from "next/link";
import { ReactNode } from "react";

import { StatusType } from "@/lib/types/ip";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { formatDate, formatDateTime } from "@/lib/helper/format-date";
import { useGetMultipleApplicationStatuses } from "@/hooks/status/useGetMultipleApplicationStatuses";
import { useGetMultipleAppById } from "@/hooks/applications/useGetMultipleApplicationById";
import { IprStatusType } from "@/lib/types/status";
import { Clock3 } from "lucide-react";

interface PropsInterface {
  applicationIds: string[];
}

type StatusListItem = {
  applicationId: string;
  ipTitle: string;
  status: IprStatusType["Row"];
  timestamp: number;
};

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

  if (isStatusesLoading.length > 0 && isStatusesLoading.every(Boolean)) {
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
        <EmptyStateText>No status history available.</EmptyStateText>
      </StatusUpdateContainer>
    );
  }

  const statusList: StatusListItem[] = statuses
    .map((status, i) => {
      if (Array.isArray(status)) return null;

      const application = applications[i];
      if (!status || !application || !status.created_at) return null;

      const timestamp = Date.parse(status.created_at);
      if (isNaN(timestamp)) return null;

      return {
        applicationId: application.id,
        ipTitle: application.ip_title,
        status,
        timestamp,
      };
    })
    .filter((item): item is StatusListItem => item !== null)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <StatusUpdateContainer>
      <div className="mt-3 max-h-[24rem] overflow-y-auto pr-1">
        <div className="relative pl-5">
          <div className="absolute top-1 bottom-1 left-[7px] w-px bg-[var(--color-gray-200)]" />

          <div className="space-y-3">
            {statusList.map((item) => {
              const label =
                STATUS_LABELS[item.status.status_type as StatusType] ??
                item.status.status_type;

              return (
                <TimelineItem
                  key={`${item.applicationId}-${item.status.created_at}`}
                  applicationId={item.applicationId}
                  ipTitle={item.ipTitle}
                  label={label}
                  createdAt={item.status.created_at!}
                  note={item.status.note}
                  deadline={item.status.deadline}
                />
              );
            })}
          </div>
        </div>
      </div>
    </StatusUpdateContainer>
  );
}

interface TimelineItemProps {
  applicationId: string;
  ipTitle: string;
  label: string;
  createdAt: string;
  note?: string | null;
  deadline?: string | null;
}

function TimelineItem({
  applicationId,
  ipTitle,
  label,
  createdAt,
  note,
  deadline,
}: TimelineItemProps) {
  return (
    <div className="relative">
      <div className="absolute top-2.5 -left-5 h-3.5 w-3.5 rounded-full border border-[var(--color-gray-300)] bg-white">
        <div className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gray-400)]" />
      </div>

      <div className="rounded-xl border border-[var(--color-gray-200)] bg-white px-3 py-2.5 hover:border-[var(--color-gray-300)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/applications/${applicationId}`}
                className="truncate text-sm font-medium text-[var(--color-gray-900)] hover:text-[var(--color-brand-600)]"
              >
                {ipTitle}
              </Link>

              <p className="shrink-0 text-[11px] text-[var(--color-gray-500)]">
                {formatDateTime(createdAt)}
              </p>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs font-medium text-[var(--color-gray-700)]">
                {label}
              </p>

              <span className="h-1 w-1 rounded-full bg-[var(--color-gray-300)]" />

              <Link
                href={`/techgen/view-application?applicationID=${applicationId}`}
                className="text-xs text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)]"
              >
                View
              </Link>
            </div>

            {note && (
              <p className="mt-2 line-clamp-2 text-xs text-[var(--color-gray-600)]">
                {note}
              </p>
            )}

            {deadline && (
              <p className="mt-1 text-xs text-[var(--color-error-600)]">
                Deadline: {formatDate(deadline)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusUpdateContainer({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-gray-200)] bg-white p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-brand-50 flex h-8 w-8 items-center justify-center rounded-lg">
            <Clock3 className="text-brand-600 h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Updates
          </h2>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Latest update for each application
        </p>
      </div>
      {children}
    </div>
  );
}

function EmptyStateText({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-[var(--color-gray-200)] bg-[var(--color-gray-25)] px-4 text-sm text-[var(--color-gray-500)]">
      {children}
    </div>
  );
}
