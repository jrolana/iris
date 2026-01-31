"use client";

import React, { useMemo } from "react";
import { ipApplicationFlows } from "@/lib/structs/ip-flow";
import { IpType, StatusType } from "@/lib/types/ip";
import { CHARTER_DEADLINES } from "@/lib/structs/charter";
import clsx from "clsx";
import Hint from "../common/Tooltip";

interface ApplicationStepperProps {
  ipType: IpType;
  statusType: StatusType;
  currentStageDeadline?: string | Date; // From ipr_applications table
}

export default function ApplicationStepper({
  ipType,
  statusType,
  currentStageDeadline,
}: ApplicationStepperProps) {
  const steps = ipApplicationFlows[ipType];

  // Calculate current progress
  const currentIndex = useMemo(
    () =>
      Math.max(
        0,
        steps.findIndex((step) => step.statusTypes.includes(statusType)),
      ),
    [steps, statusType],
  );

  const currentStep = steps[currentIndex];

  // Deadline calculation logic
  const deadlineInfo = useMemo(() => {
    if (!currentStageDeadline || !currentStep.charterStage) return null;

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
  }, [currentStageDeadline, currentStep]);

  return (
    <div className="w-full space-y-6">
      <div className="w-full overflow-x-auto pb-2">
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

                {index !== steps.length - 1 && (
                  <div
                    className={clsx(
                      "mx-2 mt-4.5 hidden h-0.5 flex-1 rounded-full sm:block",
                      index < currentIndex ? "bg-emerald-500" : "bg-slate-200",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Citizen's Charter Status Indicator */}
      {deadlineInfo && (
        <div
          className={clsx(
            "flex items-center justify-between rounded-lg border p-3 shadow-sm transition-all",
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
                Citizen&apos;s Charter Status:{" "}
                {CHARTER_DEADLINES[currentStep.charterStage!].label}
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
