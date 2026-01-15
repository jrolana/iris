"use client";

import React, { useState, useEffect } from "react";
import { IpType, StatusType } from "@/lib/types/ip";
import { getSuggestedDeadline } from "@/lib/helper/get-status-deadline";
import useStatusUpdateModal from "@/hooks/useStatusUpdateModal";

import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { dummyApplication } from "@/lib/dummy-data/application";

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

  const ipType = dummyApplication.ipType;
  const currentStatus = dummyApplication.currentStatus;
  const ipTypeOptions = IP_TYPE_OPTIONS;
  const statusOptions = STATUS_OPTIONS;

  const [selectedIpType, setSelectedIpType] = useState<IpType>(ipType);
  // implement this hook to get the current application
  // const {application} = useGetApplication();

  const [selectedStatus, setSelectedStatus] =
    useState<StatusType>(currentStatus);
  const [note, setNote] = useState("");
  const [deadline, setDeadline] = useState<Date | null>();

  // Reset form whenever modal opens or values change
  useEffect(() => {
    if (isOpen) {
      setSelectedIpType(ipType);
      setSelectedStatus(currentStatus);
      setNote("");
      setDeadline(null);
    }
  }, [isOpen, ipType, currentStatus]);

  useEffect(() => {
    if (!isOpen) return;

    const suggestion = getSuggestedDeadline(selectedStatus);
    // Only overwrite if a suggestion exists; otherwise, keep it null or let the user choose
    if (suggestion) {
      setDeadline(new Date(suggestion));
    } else {
      setDeadline(null);
    }
  }, [selectedStatus, isOpen]);

  if (!isOpen) return null;

  function onConfirm(payload: {
    newIpType: IpType;
    newStatusType: StatusType;
    note: string;
    deadline?: Date | null;
  }) {
    // do the actual db changes here

    // also do some admin check here
    // if (!isAdmin) return;

    console.log(payload);

    closeModal();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    onConfirm({
      newIpType: selectedIpType,
      newStatusType: selectedStatus,
      note: note.trim(),
      deadline,
    });
  };

  function handleChange() {
    closeModal();
  }

  return (
    <Modal
      title="Update status &amp; notify record"
      description={""}
      isOpen={isOpen}
      onChange={handleChange}
    >
      <div className="w-full max-w-lg">
        <p className="-mt-4 text-center text-sm leading-normal text-slate-600">
          Choose the IP type and status that best reflect the new stage of this
          application, then add a short note that will appear in the status
          history (and later in notifications for tech gens).
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="font-medium text-slate-800">IP type</span>
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
              {/* <select
                value={selectedIpType}
                onChange={(e) => setSelectedIpType(e.target.value as IpType)}
                className="rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
              >
                {ipTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select> */}
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium text-slate-800">Status in flow</span>
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
              {/* <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as StatusType)
                }
                className="rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select> */}
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-slate-800">
              Note / message <span className="text-red-500">*</span>
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
              placeholder="Briefly describe what changed, what TTBDO did, and what the tech gens should expect next."
            />
          </label>

          <div className="flex flex-col items-start gap-2">
            <span className="font-medium text-slate-800">
              Deadline (optional)
            </span>
            <div className="flex flex-row items-start justify-center gap-2 align-middle">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!deadline}
                    className="data-[empty=true]:text-muted-foreground w-[350px] justify-start text-left font-normal"
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

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!note.trim()}
              className="rounded-full bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
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
