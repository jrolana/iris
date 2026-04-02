"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { StatusType } from "@/lib/types/ip";
import { toSupabaseDate, fromSupabaseDate } from "@/lib/helper/format-date";
import { ApplicationType } from "@/lib/types/application";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { getSuggestedDeadline } from "@/lib/helper/get-status-deadline";
import { ipApplicationFlows } from "@/lib/structs/ip-flow";
import { IprStatusType } from "@/lib/types/status";

import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { useAddStatus } from "@/hooks/status/useAddStatus";
import { useUpdateStatus } from "@/hooks/status/useUpdateStatus";
import { useQueryClient } from "@tanstack/react-query";
import { useDowngradeToUM } from "@/hooks/applications/useDowngradeToUM";
import { useConfirm } from "@/hooks/useConfirm";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PropsInterface {
  application: ApplicationType["Row"];
  currentStatus: IprStatusType["Row"];
  closeModal: () => void;
}

function StatusUpdateForm(props: PropsInterface) {
  const { application, currentStatus, closeModal } = props;
  const applicationId = application.id;

  const { updateApp } = useUpdateApplication({ appId: applicationId });
  const { updateStatus } = useUpdateStatus({ applicationId });
  const { addStatus } = useAddStatus();
  const { downgradeApp } = useDowngradeToUM();
  const confirm = useConfirm();
  const [isDowngrading, setIsDowngrading] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const currentIpType = application.ip_type;
  const currentStatusType = currentStatus.status_type as StatusType;
  const currentStatusId = currentStatus.id;
  const publishedStageIndex = ipApplicationFlows[currentIpType].findIndex(
    (step) => step.statusTypes.includes("published"),
  );

  const currentDeadline = useMemo(
    () =>
      currentStatus.deadline ? fromSupabaseDate(currentStatus.deadline) : null,
    [currentStatus.deadline],
  );

  const currentNote = currentStatus.note ?? "";

  const currentFilingDate = useMemo(() => {
    return application.filing_date
      ? fromSupabaseDate(application.filing_date)
      : null;
  }, [application.filing_date]);

  const currentRegistrationDate = useMemo(() => {
    return application.registration_date
      ? fromSupabaseDate(application.registration_date)
      : null;
  }, [application.registration_date]);

  const [currentStage, setCurrentStage] = useState(() => {
    const stage = ipApplicationFlows[currentIpType].find((step) =>
      step.statusTypes.includes(currentStatusType),
    );
    return { id: stage?.id ?? "", label: stage?.label ?? "" };
  });

  const stages = ipApplicationFlows[currentIpType];
  const currentStageIndex = Math.max(
    0,
    stages.findIndex((step) => step.id === currentStage.id),
  );

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      const prevStage = stages[currentStageIndex - 1];
      setCurrentStage({ id: prevStage.id, label: prevStage.label });
      setNote(""); // Reset note on change
    }
  };

  const handleNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStage = stages[currentStageIndex + 1];
      setCurrentStage({ id: nextStage.id, label: nextStage.label });
      setNote(""); // Reset note on change
    }
  };

  // Filter status options based on selected stage
  const startStatusOptions = ipApplicationFlows[currentIpType]
    .find((step) => step.id === currentStage.id)
    ?.statusTypes.flatMap((status) => {
      const statusOption = STATUS_LABELS[status];
      return {
        value: status,
        label: statusOption,
      };
    });

  const [statusOptions, setStatusOptions] = useState(startStatusOptions);

  const [selectedStatus, setSelectedStatus] =
    useState<StatusType>(currentStatusType);

  const [note, setNote] = useState(currentNote);

  // start from DB deadline
  const [deadline, setDeadline] = useState<Date | null>(currentDeadline);

  // start from correct date depending on current status type
  const [date, setDate] = useState<Date>(() => {
    if (currentStatusType === "filed_with_ipophil") {
      return currentFilingDate ?? new Date();
    }
    if (currentStatusType === "registered") {
      return currentRegistrationDate ?? new Date();
    }
    return new Date();
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep deadline in sync when currentStatus changes (modal opened for another record)
  useEffect(() => {
    setDeadline(currentDeadline);
  }, [currentDeadline]);

  // Keep note in sync too (optional but prevents stale note if modal reused)
  useEffect(() => {
    setNote(currentNote);
  }, [currentNote]);

  useEffect(() => {
    if (!currentStage.id) {
      setSelectedStatus(currentStatusType);
      return;
    }

    const applicationStep = ipApplicationFlows[currentIpType].find(
      (step) => step.id === currentStage.id,
    );
    // Filter status options based on selected stage
    const newStatusOptions = applicationStep?.statusTypes.flatMap((status) => {
      const statusOption = STATUS_LABELS[status];
      return {
        value: status,
        label: statusOption,
      };
    });

    setStatusOptions(() => newStatusOptions);

    // If the current selected status is not in the new options, reset it to the first option
    if (
      newStatusOptions &&
      !newStatusOptions.some((opt) => opt.value === selectedStatus)
    ) {
      setSelectedStatus(() => newStatusOptions[0].value);
    }
  }, [currentStage.id, currentIpType, currentStatusType, selectedStatus]);

  /**
   * Runs only when selectedStatus actually changes (ref).
   *
   * - Does NOT wipe DB deadline.
   * - Only suggests deadline if deadline is empty.
   * - Prefills filing/registration date based on status change.
   * - Avoids infinite loops with isSameDay guard.
   */
  const lastStatusRef = useRef<StatusType>(currentStatusType);

  useEffect(() => {
    if (!selectedStatus) return;

    const statusChanged = lastStatusRef.current !== selectedStatus;
    if (!statusChanged) return;
    lastStatusRef.current = selectedStatus;

    // Deadline suggestion ONLY if empty
    setDeadline((prev) => {
      if (prev) return prev;

      const suggestion = getSuggestedDeadline(selectedStatus);
      if (!suggestion) return null;

      return typeof suggestion === "string"
        ? fromSupabaseDate(suggestion)
        : suggestion;
    });

    // Prefill filing/registration date when status changes
    setDate((prev) => {
      let next = prev;

      if (selectedStatus === "filed_with_ipophil") {
        next = currentFilingDate ?? new Date();
      } else if (selectedStatus === "registered") {
        next = currentRegistrationDate ?? new Date();
      } else {
        next = new Date();
      }

      return isSameDay(prev, next) ? prev : next;
    });
  }, [selectedStatus, currentFilingDate, currentRegistrationDate]);

  const isNoteChanged = currentNote !== note;

  const isDeadlineChanged =
    !!currentDeadline !== !!deadline ||
    (!!currentDeadline && !!deadline && !isSameDay(currentDeadline, deadline));

  const isStatusChanged = currentStatusType !== selectedStatus;

  const isDateChanged =
    (selectedStatus === "filed_with_ipophil" &&
      !!currentFilingDate &&
      !isSameDay(currentFilingDate, date)) ||
    (selectedStatus === "registered" &&
      !!currentRegistrationDate &&
      !isSameDay(currentRegistrationDate, date));

  const noChangesMade =
    !isNoteChanged && !isDeadlineChanged && !isStatusChanged && !isDateChanged;

  async function onConfirm() {
    const isConfirmed = await confirm({
      title: "Confirm Status Update",
      message:
        "Are you sure you want to update the status of this application? This action will notify the technology generators about the change.",
    });

    if (!isConfirmed) {
      return;
    }

    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      // No changes on status
      if (noChangesMade) {
        return;
      }

      // Changes on note or/and deadline
      const updatedStatus: Partial<IprStatusType["Insert"]> = {};

      if (isNoteChanged) updatedStatus.note = note;

      if (isDeadlineChanged) {
        updatedStatus.deadline = deadline ? toSupabaseDate(deadline) : null;
      }

      // If status_type isn't changing, just update existing status row
      if (!isStatusChanged && (isNoteChanged || isDeadlineChanged)) {
        await updateStatus(
          {
            id: currentStatusId,
            statusData: updatedStatus,
          },
          {
            onSuccess: () => toast.success("Successfully updated status."),
            onError: () =>
              toast.error("There was an error in updating status details."),
          },
        );
        return;
      }

      // Changing status_type => create new status row
      if (isStatusChanged) {
        const selectedStageIndex = ipApplicationFlows[currentIpType].findIndex(
          (step) => step.statusTypes.includes(selectedStatus),
        );

        // If moving to a stage beyond "published" stage, or changing status to "published" in the same stage, set is_public to true
        const isBeyondPublished =
          publishedStageIndex !== -1 &&
          selectedStageIndex !== -1 &&
          selectedStageIndex >= publishedStageIndex;

        if (isBeyondPublished) {
          updatedStatus.is_public = true;
        } else {
          updatedStatus.is_public = false;
        }

        updatedStatus.status_type = selectedStatus;
        updatedStatus.application_id = applicationId;
        updatedStatus.status_name =
          STATUS_LABELS[selectedStatus] ?? selectedStatus;

        await addStatus(
          { statusData: updatedStatus },
          {
            onSuccess: () => toast.success("Successfully changed status."),
            onError: () =>
              toast.error("There was an error in changing status."),
          },
        );
      }

      // downgrade patent to UM. create new application
      if (selectedStatus === "downgraded_to_um") {
        handleDowngradeToUM();
        return;
      }

      // Save filing/registration dates (DATE-only)
      const changedDate = toSupabaseDate(date);

      if (selectedStatus === "filed_with_ipophil") {
        await updateApp(
          {
            id: applicationId,
            applicationData: { filing_date: changedDate },
          },
          {
            onSuccess: () => toast.success("Successfully changed filing date."),
            onError: () =>
              toast.error("There was an error in changing filing date."),
          },
        );
      }

      if (selectedStatus === "registered") {
        await updateApp(
          {
            id: applicationId,
            applicationData: { registration_date: changedDate },
          },
          {
            onSuccess: () =>
              toast.success("Successfully changed registration date."),
            onError: () =>
              toast.error("There was an error in changing registration date."),
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["application", applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["multiple-status", applicationId],
      });
    } catch (e) {
      console.error(
        e instanceof Error
          ? e.message
          : "There was an error in changing status.",
      );
    } finally {
      handleClose();
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  const handleClose = () => {
    queryClient.invalidateQueries({
      queryKey: ["latest-status", applicationId],
    });
    queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
    setIsSubmitting(false);
    closeModal();
  };

  async function handleDowngradeToUM() {
    handleClose();
    setIsDowngrading(true);

    const downgradeStatus = "filed_with_ipophil" as StatusType;
    const downgradeNote = `This application has been downgraded to a Utility Model. The previous Patent application "${application.project_title}" will be archived.`;

    try {
      const applicationData: ApplicationType["Insert"] = {
        project_title: application.project_title,
        ip_type: "utility_model",
        funding_source: application.funding_source,
        created_by: application.created_by,
        id: application.id,
        ip_number: application.ip_number,
        ip_title: application.ip_title,
      };

      const { app } = await downgradeApp({
        applicationData,
        downgradeStatus,
        downgradeNote,
      });

      router.push(`/admin/view-application?applicationID=${app.id}`);
    } catch (e) {
      console.error(
        e instanceof Error
          ? e.message
          : "There was an error in downgrading application.",
      );
      toast.error("There was an error in downgrading application.");
    } finally {
      setIsDowngrading(false);
    }
  }

  if (isDowngrading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-lg font-medium text-slate-700">
          Downgrading to Utility Model...
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-lg min-w-[85vw] flex-col sm:w-[80vh] sm:min-w-[400px]">
      <p className="-mt-4 shrink-0 text-center text-sm leading-normal text-slate-600">
        Update the application status and add a note to notify technology
        generators.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex h-full flex-col text-sm"
      >
        <div className="min-h-0 flex-1 gap-4 overflow-y-auto px-1 pb-2">
          {/* stages carousel */}
          <div className="flex w-full shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Application Stage
            </span>

            <div className="flex w-full items-center justify-between px-2 sm:px-6">
              <button
                type="button"
                onClick={handlePrevStage}
                disabled={currentStageIndex === 0}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex flex-1 flex-col items-center gap-2 px-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky-600 bg-sky-50 text-lg font-bold text-sky-700">
                  {currentStageIndex + 1}
                </div>
                <span className="line-clamp-2 flex min-h-10 w-full items-center justify-center text-sm font-bold text-slate-800">
                  {currentStage.label}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextStage}
                disabled={currentStageIndex === stages.length - 1}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-1 gap-4 py-2 md:grid-cols-2">
            <label className="flex w-full flex-col gap-1">
              <span className="font-medium text-slate-800">
                Specific Status in flow <span className="text-red-500">*</span>
              </span>
              <Select
                value={
                  statusOptions!.find((opt) => opt.value === selectedStatus)
                    ?.value
                }
                onValueChange={(value) => {
                  setSelectedStatus(value as StatusType);
                  setNote("");
                }}
              >
                <SelectTrigger
                  className={`h-10 w-full bg-white ${selectedStatus === currentStage.label ? "text-slate-500" : "text-slate-900"} `}
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  side="bottom"
                  className="z-9999 max-h-60 overflow-y-auto"
                >
                  {statusOptions!.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <div className="flex w-full shrink-0 flex-col items-start gap-1">
              <span className="font-medium text-slate-800">
                Deadline (optional)
              </span>
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!deadline}
                      className="data-[empty=true]:text-muted-foreground flex-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? (
                        format(deadline, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-9999 w-auto p-0">
                    <Calendar
                      fixedWeeks
                      mode="single"
                      selected={deadline ?? undefined}
                      onSelect={(d) => setDeadline(d ?? null)}
                      classNames={{
                        day_selected:
                          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                        day_today: "bg-slate-100 text-slate-900",
                      }}
                      required
                    />
                  </PopoverContent>
                </Popover>

                {deadline && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-slate-500 hover:text-red-500"
                    onClick={() => setDeadline(null)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <label className="flex w-full shrink-0 flex-col gap-1">
            <span className="font-medium text-slate-800">Note</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
              placeholder="Briefly describe what changed, what TTBDO did, and what the tech gens should expect next."
            />
          </label>
        </div>

        <div className="mt-2 flex w-full shrink-0 items-center justify-end gap-3 pb-2">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || noChangesMade}
            className="rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StatusUpdateForm;
