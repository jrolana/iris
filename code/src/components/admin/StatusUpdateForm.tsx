"use client";

import React, { useState, useEffect } from "react";
import { IpType, StatusType } from "@/lib/types/ip";
import { toSupabaseDate } from "@/lib/helper/format-date";
import { ApplicationType } from "@/lib/types/application";

import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { useAddStatus } from "@/hooks/status/useAddStatus";
import { IprStatusType } from "@/lib/types/status";
import { useUpdateStatus } from "@/hooks/status/useUpdateStatus";

import Select from "react-select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";

import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { getSuggestedDeadline } from "@/lib/helper/get-status-deadline";

// Options for TTBDO modal only
const STATUS_OPTIONS: { value: StatusType; label: string }[] = Object.entries(
  STATUS_LABELS as Record<string, string>,
).map(([value, label]) => ({
  value: value as StatusType,
  label,
}));

const IP_TYPE_OPTIONS: { value: IpType; label: string }[] = [
  { value: "patent", label: "Patent" },
  { value: "utility_model", label: "Utility Model" },
  { value: "industrial_design", label: "Industrial Design" },
  { value: "trademark", label: "Trademark" },
  { value: "copyright", label: "Copyright" },
];

interface PropsInterface {
  application: ApplicationType["Row"];
  currentStatus: IprStatusType["Row"];
  closeModal: () => void;
}

function StatusUpdateForm(props: PropsInterface) {
  const { application, currentStatus, closeModal } = props;

  const ipTypeOptions = IP_TYPE_OPTIONS;
  const statusOptions = STATUS_OPTIONS;

  const { updateApp } = useUpdateApplication();
  const { updateStatus } = useUpdateStatus();
  const { addStatus } = useAddStatus();

  const ipType = application.ip_type;
  const currentStatusType = currentStatus.status_type;
  const currentStatusId = currentStatus.id;
  const currentDeadline = currentStatus.deadline;
  const currentNote = currentStatus.note;

  const [selectedIpType, setSelectedIpType] =
    useState<ApplicationType["Update"]["ip_type"]>(ipType);
  const [selectedStatus, setSelectedStatus] =
    useState<IprStatusType["Row"]["status_type"]>(currentStatusType);
  const [note, setNote] = useState(currentNote ?? "");
  const [deadline, setDeadline] = useState<Date | null>(
    currentDeadline ? new Date(currentDeadline) : null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedStatus) {
      setDeadline(null);
      return;
    }

    const suggestion = getSuggestedDeadline(selectedStatus);
    if (suggestion) {
      setDeadline(new Date(suggestion));
    }
  }, [selectedStatus]);

  async function onConfirm() {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      if (ipType != selectedIpType) {
        await updateApp(
          {
            id: application.id,
            applicationData: {
              ip_type: selectedIpType,
            },
          },
          {
            onSuccess: () => {
              toast.success("Successfully changed IP type.");
            },
            onError: () => {
              toast.error("There was an error in changing IP type.");
            },
          },
        );
      }

      const updatedStatus: Partial<IprStatusType["Insert"]> = {};

      if (currentNote != note) {
        updatedStatus.note = note;
      }
      if (currentDeadline != deadline) {
        updatedStatus.deadline = deadline ? toSupabaseDate(deadline) : null;
      }

      if (currentStatusType == selectedStatus) {
        await updateStatus(
          {
            id: currentStatusId,
            statusData: updatedStatus,
          },
          {
            onSuccess: () => {
              toast.success("Successfully updated status.");
            },
            onError: () => {
              toast.error("There was an error in updating status details.");
            },
          },
        );
        return;
      }

      updatedStatus.status_type = selectedStatus;
      updatedStatus.application_id = application.id;

      await addStatus(
        {
          statusData: updatedStatus,
        },
        {
          onSuccess: () => {
            toast.success("Successfully changed status.");
          },
          onError: () => {
            toast.error("There was an error in changing status.");
          },
        },
      );
    } catch (e) {
      console.error(e instanceof Error ? e.message : "An error occurred");
    } finally {
      handleClose();
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  const handleClose = () => {
    setIsSubmitting(false);
    closeModal();
  };

  return (
    <div className="w-full max-w-lg">
      <p className="-mt-4 text-center text-sm leading-normal text-slate-600">
        Update the application status and add a note to notify technology
        generators.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-1 flex-col gap-1">
              <span className="font-medium text-slate-800">
                Status in flow <span className="text-red-500">*</span>
              </span>
              <Select
                unstyled
                value={STATUS_OPTIONS.find(
                  (opt) => opt.value === selectedStatus,
                )}
                options={statusOptions}
                className="h-10"
                classNames={{
                  placeholder: () => "text-lg!",
                  control: ({ isFocused }) =>
                    `overflow-hidden border rounded-lg px-3 transition-all focus-ring ${isFocused ? "border-gray-400 ring-3 ring-gray-300" : "border-gray-300"}`,
                  menu: () =>
                    "bg-white border border-gray-200 mt-2 rounded-lg  space-y-2 overflow-hidden",
                  input: () => "text-sm",
                  option: ({ isFocused }) =>
                    `px-3 py-2 cursor-pointer ${isFocused ? "bg-blue-100" : "bg-transparent"}`,
                }}
                onChange={(selectedOption) => {
                  setSelectedStatus(selectedOption?.value as StatusType);
                  setNote("");
                }}
              />
            </label>
            <div className="flex flex-col items-start gap-1">
              <span className="font-medium text-slate-800">
                Deadline (optional)
              </span>
              <div className="flex w-full flex-row items-start justify-between gap-2 align-middle">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!deadline}
                      className={`data-[empty=true]:text-muted-foreground justify-start text-left font-normal ${deadline ? "w-[85%]" : "w-full"}`}
                    >
                      <CalendarIcon />
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
                      onSelect={setDeadline}
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
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => setDeadline(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <label className="flex flex-col gap-1">
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

        <div>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-slate-800">
              IP type (optional)
            </span>
            <Select
              unstyled
              value={IP_TYPE_OPTIONS.find(
                (opt) => opt.value === selectedIpType,
              )}
              options={ipTypeOptions}
              className="h-10"
              classNames={{
                placeholder: () => "text-lg! text-muted-foreground",
                control: ({ isFocused }) =>
                  `overflow-hidden border rounded-lg px-3 transition-all focus-ring ${isFocused ? "border-gray-400 ring-3 ring-gray-300" : "border-gray-300"}`,
                menu: () =>
                  "bg-white border border-gray-200 mt-2 rounded-lg  space-y-2 overflow-hidden",
                input: () => "text-sm",
                option: ({ isFocused }) =>
                  `px-3 py-2 cursor-pointer ${isFocused ? "bg-blue-100" : "bg-transparent"}`,
              }}
              onChange={(selectedOption) =>
                setSelectedIpType(selectedOption?.value as IpType)
              }
            />
            <p className="text-xs text-slate-500">
              Only change this if the application type has fundamentally
              changed.
            </p>
          </label>
        </div>

        <div className="mt-6 grid items-center gap-2 md:w-1/2 md:grid-cols-2 md:gap-1 md:justify-self-end">
          <button
            type="button"
            onClick={closeModal}
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 md:w-fit md:justify-self-end"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 md:w-fit md:justify-self-end"
          >
            {isSubmitting ? "Saving changes..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StatusUpdateForm;
