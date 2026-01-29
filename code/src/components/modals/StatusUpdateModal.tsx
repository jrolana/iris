"use client";

import React, { useState, useEffect } from "react";
import { IpType, StatusType } from "@/lib/types/ip";
import { getSuggestedDeadline } from "@/lib/helper/get-status-deadline";
import useStatusUpdateModal from "@/hooks/useStatusUpdateModal";
import { useSearchParams } from "next/navigation";
import { useGetAppById } from "@/hooks/applications/useGetApplicationById";
import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { useAddStatus } from "@/hooks/status/useAddStatus";

import Modal from "./Modal";
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

import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { toSupabaseDate } from "@/lib/helper/to-supabase-date";
import { ApplicationType } from "@/lib/types/application";
import { IprStatusType } from "@/lib/types/status";
import { useUpdateStatus } from "@/hooks/status/useUpdateStatus";
import { useGetStatus } from "@/hooks/status/useGetStatus";
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

function StatusUpdateModal() {
  const { isOpen, closeModal } = useStatusUpdateModal();

  const ipTypeOptions = IP_TYPE_OPTIONS;
  const statusOptions = STATUS_OPTIONS;

  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationID") ?? "";

  const { application, isLoading: isGetAppLoading } = useGetAppById({
    appId: applicationId,
  });
  const { status: currentStatus, isLoading: isGetStatusLoading } =
    useGetStatus();

  const { updateApp, isLoading: isUpdateAppLoading } = useUpdateApplication();
  const { updateStatus, isLoading: isUpdateStatusLoading } = useUpdateStatus();
  const { addStatus, isLoading: isAddStatusLoading } = useAddStatus();

  if (isGetAppLoading || isGetStatusLoading || !application || !currentStatus) {
    return <div>Loading...</div>;
  }

  const ipType = application.ip_type;
  const statusType = currentStatus.status_type;
  const statusId = currentStatus.id;

  const [selectedIpType, setSelectedIpType] =
    useState<ApplicationType["Update"]["ip_type"]>(ipType);
  const [selectedStatus, setSelectedStatus] =
    useState<IprStatusType["Row"]["status_type"]>(statusType);
  const [note, setNote] = useState("");
  const [deadline, setDeadline] = useState<Date | null>();

  useEffect(() => {
    if (isOpen) {
      setSelectedIpType(ipType);
      setSelectedStatus(statusType);
      setNote("");
      setDeadline(null);
    }
  }, [isOpen, ipType, statusType]);

  useEffect(() => {
    if (!isOpen) return;

    if (!selectedStatus) {
      setDeadline(null);
      return;
    }

    const suggestion = getSuggestedDeadline(selectedStatus);
    // Only overwrite if a suggestion exists; otherwise, keep it null or let the user choose
    if (suggestion) {
      setDeadline(new Date(suggestion));
    } else {
      setDeadline(null);
    }
  }, [selectedStatus, isOpen]);

  // if (!isOpen) return null;

  async function onConfirm() {
    if (ipType != selectedIpType) {
      await updateApp({
        id: applicationId,
        applicationData: {
          ip_type: selectedIpType,
        },
      });
    }

    const updatedStatus: Partial<IprStatusType["Insert"]> = {};

    if (note != undefined) updatedStatus.note = note;
    if (deadline != undefined)
      updatedStatus.deadline = toSupabaseDate(deadline);

    if (selectedStatus != statusType) {
      updatedStatus.status_type = selectedStatus;

      await updateStatus({
        id: statusId,
        statusData: updatedStatus,
      });

      return;
    }

    updatedStatus.status_type = selectedStatus;
    updatedStatus.application_id = applicationId;

    await addStatus({
      statusData: updatedStatus,
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    onConfirm();
    closeModal();
  };

  function handleChange() {
    closeModal();
  }

  return (
    <Modal
      title="Update status and notify record"
      description={""}
      isOpen={isOpen}
      onChange={handleChange}
    >
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
                  onChange={(selectedOption) =>
                    setSelectedStatus(selectedOption?.value as StatusType)
                  }
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
              <span className="font-medium text-slate-800">
                Note <span className="text-red-500">*</span>
              </span>
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
              disabled={!note.trim()}
              className="w-full rounded-full bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 md:w-fit md:justify-self-end"
            >
              Save status
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default StatusUpdateModal;
