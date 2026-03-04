"use client";

import React, { useMemo } from "react";
import { ipApplicationFlows } from "@/lib/structs/ip-flow";
import { IpType, StatusType } from "@/lib/types/ip";
import { CHARTER_DEADLINES } from "@/lib/structs/charter";
import clsx from "clsx";
import Hint from "../common/Tooltip";
import { IprStatusType } from "@/lib/types/status";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import Ping from "./Ping";

interface ApplicationStepperProps {
  ipType: IpType;
  currentStageDeadline?: string | Date; // From ipr_applications table
  currentStatus: IprStatusType["Row"];
  isAdmin?: boolean;
  applicationId: string;
  applicationName: string;
}

export default function ApplicationStepper(props: ApplicationStepperProps) {
  const {
    ipType,
    currentStageDeadline,
    currentStatus,
    isAdmin = false,
    applicationId,
    applicationName,
  } = props;
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

  // Deadline calculation
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

  // Charter calculation
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

  const targetDate = currentStageDeadline
    ? currentStageDeadline
    : currentStatus.created_at;

  const isPingable = charterInfo?.isOverdue || deadlineInfo?.isOverdue;

  return (
    <div className="w-full space-y-4 p-2">
      <div
        className={clsx(
          "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors",
          inIpophilStages
            ? "w-[265px] border-purple-200 bg-purple-50 text-purple-700"
            : "w-48 border-teal-200 bg-teal-50 text-teal-700",
        )}
      >
        <div
          className={clsx(
            "h-1.5 w-1.5 rounded-full",
            inIpophilStages ? "bg-purple-500" : "bg-teal-500",
          )}
        />
        {inIpophilStages
          ? "Internal + External: IPOPHIL Phase"
          : "Internal: TTBDO Phase"}
      </div>

      <div className="mb-10 w-full overflow-x-auto">
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

      {/* Citizen's Charter Status */}
      {charterInfo && (
        <StatusCard
          title={`Citizen's Charter Status: ${CHARTER_DEADLINES[currentStep.charterStage!].label}`}
          timeString={charterInfo.timeString}
          target={charterInfo.formattedDate}
          isOverdue={charterInfo.isOverdue}
          overdueText="Charter Deadline Missed"
          onTimeText="Within Processing Time"
          isCharter={true}
        />
      )}

      {/* Application Deadline Status */}
      {deadlineInfo && (
        <StatusCard
          title={`Current Application Status: ${STATUS_LABELS[currentStatus.status_type as StatusType]}`}
          timeString={deadlineInfo.timeString}
          target={deadlineInfo.formattedDate}
          isOverdue={deadlineInfo.isOverdue}
          overdueText="Step Delayed"
          onTimeText="Within Processing Time"
        />
      )}

      {isPingable && (
        <Ping
          isAdmin={isAdmin}
          application_id={applicationId}
          application_name={applicationName}
          stage_delayed={currentStep.id as string}
          step_delayed={statusType as string}
          target_date={targetDate!}
        />
      )}
    </div>
  );
}

// Status Card Component
interface StatusCardProps {
  title: string;
  timeString: string;
  target: string;
  isOverdue: boolean;
  overdueText: string;
  onTimeText: string;
  isCharter?: boolean;
}

function StatusCard(props: StatusCardProps) {
  const {
    title,
    timeString,
    target,
    isOverdue,
    overdueText,
    onTimeText,
    isCharter = false,
  } = props;

  let stateClass = "border-sky-200 bg-sky-50 text-sky-700";

  if (isOverdue && isCharter) {
    stateClass = "border-rose-300 text-rose-800";
  } else if (isCharter) {
    stateClass = "border-sky-200 text-sky-700";
  } else {
    stateClass = "border-rose-300 bg-rose-50 text-rose-800";
  }

  return (
    <div
      className={clsx(
        "xsm:flex-row xsm:items-start xsm:justify-between flex flex-col justify-between rounded-lg border p-3 transition-all",
        stateClass,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "hidden h-3 w-3 rounded-full sm:inline-block",
            isOverdue ? "bg-rose-500" : "bg-sky-500",
          )}
        />
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
            {title}
          </p>
          <p className="text-sm font-semibold">
            {isOverdue
              ? `${overdueText} (${timeString} overdue)`
              : `${onTimeText} (${timeString} remaining)`}
          </p>
        </div>
      </div>
      <div className="xsm:text-right xsm:mt-0 mt-2 flex flex-col text-left">
        <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
          Target Completion
        </p>
        <p className="font-mono text-sm font-bold">{target}</p>
      </div>
    </div>
  );
}
