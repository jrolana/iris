"use client";

import React, { useState, useEffect } from "react";
import { IpType, StatusType } from "@/lib/types/ip";
import { getSuggestedDeadline } from "@/lib/helper/get-status-deadline";
import { STATUS_LABELS } from "@/lib/helper/status-labels";

import { dummyApplication } from "@/lib/dummy-data/application";

import Modal from "./Modal";
import useStatusUpdateModal from "@/hooks/useStatusUpdateModal";

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
  const [deadline, setDeadline] = useState<string | null>(null);

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
      setDeadline(suggestion);
    } else {
      setDeadline(null);
    }
  }, [selectedStatus, isOpen]);

  if (!isOpen) return null;

  function onConfirm(payload: {
    newIpType: IpType;
    newStatusType: StatusType;
    note: string;
    deadline?: string | null;
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
      description=""
      isOpen={isOpen}
      onChange={handleChange}
    >
      <div className="w-full max-w-lg">
        <p className="mt-1 text-xs text-slate-600">
          Choose the IP type and status that best reflect the new stage of this
          application, then add a short note that will appear in the status
          history (and later in notifications for tech gens).
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="font-medium text-slate-800">IP type</span>
              <select
                value={selectedIpType}
                onChange={(e) => setSelectedIpType(e.target.value as IpType)}
                className="rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
              >
                {ipTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium text-slate-800">Status in flow</span>
              <select
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
              </select>
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
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
              placeholder="Briefly describe what changed, what TTBDO did, and what the tech gens should expect next."
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-slate-800">
              Deadline (optional)
            </span>
            <input
              type="date"
              value={deadline ?? ""}
              onChange={(e) =>
                setDeadline(e.target.value ? e.target.value : null)
              }
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
            />
          </label>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!note.trim()}
              className="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
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
