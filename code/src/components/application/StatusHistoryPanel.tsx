"use client";

import useStatusUpdateModal from "@/hooks/useStatusUpdateModal";
import { useConfirm } from "@/hooks/useConfirm";
import { StatusType } from "@/lib/types/ip";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import clsx from "clsx";

import { useGetApplicationStatuses } from "@/hooks/status/useGetApplicationStatuses";
import { formatDate, formatDateTime } from "@/lib/helper/format-date";
import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { toast } from "sonner";
import { ApplicationType } from "@/lib/types/application";
import { Button } from "../ui/button";

interface StatusHistoryPanelProps {
  application: ApplicationType["Row"];
  variant?: "techgen" | "ttbdo";
}

export default function StatusHistoryPanel(props: StatusHistoryPanelProps) {
  const { application, variant = "techgen" } = props;
  const { openModal } = useStatusUpdateModal();
  const confirm = useConfirm();
  const { isLoading: isWithdrawing, updateApp } = useUpdateApplication({
    appId: application.id,
  });

  const { statuses, isLoading } = useGetApplicationStatuses({
    applicationId: application.id,
  });

  function handleClickUpdate() {
    openModal();
  }

  async function handleWithdrawApplication() {
    const isConfirmed = await confirm({
      title: "Withdraw Application",
      message:
        "Are you sure you want to withdraw this application? You can revert this action later if needed.",
    });

    if (!isConfirmed) return;

    toast.promise(
      updateApp({
        id: application.id,
        applicationData: { is_withdrawn: true },
      }),
      {
        loading: "Withdrawing application...",
        success: "Application withdrawn successfully",
        error: "Failed to withdraw application",
      },
    );
  }

  async function handleUnwithdrawApplication() {
    const isConfirmed = await confirm({
      title: "Revert Withdrawal",
      message:
        "Are you sure you want to revert the withdrawal of this application?",
    });

    if (!isConfirmed) return;

    toast.promise(
      updateApp({
        id: application.id,
        applicationData: { is_withdrawn: false },
      }),
      {
        loading: "Reverting withdrawal...",
        success: "Application is no longer withdrawn",
        error: "Failed to revert withdrawal",
      },
    );
  }

  const statusArray = Array.isArray(statuses) ? statuses : [statuses];
  const latestStatus = statusArray[0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="xsm:flex-row xsm:items-center xsm:justify-between mb-3 flex flex-col justify-start gap-2">
        <h2 className="text-lg font-semibold text-gray-900">Status history</h2>

        {variant === "ttbdo" && (
          <div className="flex justify-between gap-2">
            {application.is_withdrawn ? (
              <Button
                type="button"
                onClick={handleUnwithdrawApplication}
                disabled={isWithdrawing}
                className="rounded-full border border-green-600 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 hover:text-green-800"
              >
                Revert Withdrawal
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleWithdrawApplication}
                disabled={isWithdrawing}
                className="rounded-full border bg-rose-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:border-rose-600 hover:bg-white hover:text-rose-600"
              >
                Withdraw
              </Button>
            )}
            <Button
              type="button"
              disabled={isWithdrawing || (application.is_withdrawn ?? false)}
              onClick={handleClickUpdate}
              className="rounded-full border border-sky-700 bg-sky-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:border-sky-600 hover:bg-white hover:text-sky-600"
            >
              Update status
            </Button>
          </div>
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
          <div>
            No status history yet. Add a status update to start tracking
            progress.{" "}
          </div>
        ) : (
          <div>
            No status updates yet. We’ll show updates here as soon as your
            application begins processing.
          </div>
        ))}
    </div>
  );
}
