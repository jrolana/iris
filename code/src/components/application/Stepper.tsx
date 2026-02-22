"use client";

import React, { useMemo } from "react";
import { ipApplicationFlows } from "@/lib/structs/ip-flow";
import { IpType, StatusType } from "@/lib/types/ip";
import { CHARTER_DEADLINES } from "@/lib/structs/charter";
import clsx from "clsx";
import Hint from "../common/Tooltip";
import { IprStatusType } from "@/lib/types/status";
import { STATUS_LABELS } from "@/lib/helper/status-labels";

interface ApplicationStepperProps {
  ipType: IpType;
  currentStageDeadline?: string | Date; // From ipr_applications table
  currentStatus: IprStatusType["Row"];
}

export default function ApplicationStepper(props: ApplicationStepperProps) {
  const { ipType, currentStageDeadline, currentStatus } = props;
  const statusType = currentStatus.status_type as StatusType;
  const steps = ipApplicationFlows[ipType];

  const ipophilIndex = steps.findIndex((step) =>
    step.statusTypes.includes("filed_with_ipophil"),
  );

  // Calculate current progress
  const currentIndex = useMemo(
    () =>
      Math.max(
        0,
        steps.findIndex((step) => step.statusTypes.includes(statusType)),
      ),
    [steps, statusType],
  );

  const inIpophilStages = currentIndex >= ipophilIndex;

  const currentStep = steps[currentIndex];

  // Deadline calculation logic
  const deadlineInfo = useMemo(() => {
    if (!currentStageDeadline) return null;

    const now = new Date();
    const deadline = new Date(currentStageDeadline);
    const diff = deadline.getTime() - now.getTime();
    const isOverdue = diff < 0;

    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);

    return {
      isOverdue,
      timeString: `${days}d ${hours}h`,
      formattedDate: deadline.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  }, [currentStageDeadline]);

  // Deadline calculation logic
  const charterInfo = useMemo(() => {
    if (!currentStep.charterStage) return null;

    const now = new Date();
    const deadline = new Date(currentStatus.created_at!);
    deadline.setDate(
      deadline.getDate() +
        CHARTER_DEADLINES[currentStep.charterStage].durationMs /
          (1000 * 60 * 60 * 24),
    );
    const diff = deadline.getTime() - now.getTime();
    const isOverdue = diff < 0;

    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);

    return {
      isOverdue,
      timeString: `${days}d ${hours}h`,
      formattedDate: deadline.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  }, [currentStatus.created_at, currentStep.charterStage]);

  return (
    <div className="w-full space-y-6 p-2">
      <div className="w-full overflow-x-auto">
        <div className="flex w-full justify-end px-2 sm:px-0">
          <div
            className={clsx(
              "mb-4 flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase shadow-sm transition-colors",
              inIpophilStages
                ? "border-sky-200 bg-sky-50 text-sky-700"
                : "border-amber-200 bg-amber-50 text-amber-700",
            )}
          >
            <div
              className={clsx(
                "h-1.5 w-1.5 rounded-full",
                inIpophilStages ? "bg-sky-500" : "bg-amber-500",
              )}
            />
            {inIpophilStages
              ? "Interal + External: IPOPHIL Phase"
              : "Internal: TTBDO Phase"}
          </div>
        </div>
        <ol className="flex min-w-[600px] items-stretch gap-3 px-1 sm:min-w-0 sm:gap-4 sm:px-0">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <li key={step.id} className="flex flex-1 items-start">
                <div className="flex w-full flex-col items-center text-center">
                  <div
                    className={clsx(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                      isCompleted &&
                        "border-emerald-500 bg-emerald-500 text-white",
                      isActive && "border-sky-600 bg-sky-50 text-sky-700",
                      !isCompleted &&
                        !isActive &&
                        "border-slate-300 bg-white text-slate-400",
                    )}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <Hint label={step.label} side="bottom">
                    <span
                      className={clsx(
                        "mt-2 line-clamp-3 w-21 px-1 text-xs leading-tight font-medium sm:text-sm",
                        isActive ? "text-sky-900" : "text-slate-500",
                      )}
                    >
                      {step.label}
                    </span>
                  </Hint>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Citizen's Charter Status Indicator */}
      {charterInfo && (
        <div
          className={clsx(
            "flex items-center justify-between rounded-lg border p-3 shadow-sm transition-all",
            charterInfo.isOverdue
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-sky-200 bg-sky-50 text-sky-700",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "h-3 w-3 animate-pulse rounded-full",
                charterInfo.isOverdue ? "bg-red-500" : "bg-sky-500",
              )}
            />
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                Citizen&apos;s Charter Status:{" "}
                {CHARTER_DEADLINES[currentStep.charterStage!].label}
              </p>
              <p className="text-sm font-semibold">
                {charterInfo.isOverdue
                  ? `Overdue by ${charterInfo.timeString}`
                  : `Within Processing Time (${charterInfo.timeString} remaining)`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
              Target Completion
            </p>
            <p className="font-mono text-sm font-bold">
              {charterInfo.formattedDate}
            </p>
          </div>
        </div>
      )}

      {/* Deadline Status Indicator */}
      {deadlineInfo && (
        <div
          className={clsx(
            "-mt-4 flex items-center justify-between rounded-lg border p-3 shadow-sm transition-all",
            deadlineInfo.isOverdue
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-sky-200 bg-sky-50 text-sky-700",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "h-3 w-3 animate-pulse rounded-full",
                deadlineInfo.isOverdue ? "bg-red-500" : "bg-sky-500",
              )}
            />
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                Current Status:{" "}
                {STATUS_LABELS[currentStatus.status_type as StatusType]}
              </p>
              <p className="text-sm font-semibold">
                {deadlineInfo.isOverdue
                  ? `Overdue by ${deadlineInfo.timeString}`
                  : `Within Processing Time (${deadlineInfo.timeString} remaining)`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
              Target Completion
            </p>
            <p className="font-mono text-sm font-bold">
              {deadlineInfo.formattedDate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
