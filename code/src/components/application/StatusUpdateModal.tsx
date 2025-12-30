"use client";

import React, { useState, useEffect } from "react";
import { IpType, StatusType } from "@/lib/types/ip";
import { getSuggestedDeadline } from "@/lib/helper/get-status-deadline";

type Option<T> = {
  value: T;
  label: string;
};

interface StatusUpdateModalProps {
  open: boolean;
  ipType: IpType;
  currentStatusType: StatusType;
  ipTypeOptions: Option<IpType>[];
  statusOptions: Option<StatusType>[];
  onConfirm: (payload: {
    newIpType: IpType;
    newStatusType: StatusType;
    note: string;
    deadline?: string | null;
  }) => void;
  onCancel: () => void;
}

export default function StatusUpdateModal(props: StatusUpdateModalProps) {
  const {
    open,
    ipType,
    currentStatusType,
    ipTypeOptions,
    statusOptions,
    onConfirm,
    onCancel,
  } = props;
  const [selectedIpType, setSelectedIpType] = useState<IpType>(ipType);
  const [selectedStatus, setSelectedStatus] =
    useState<StatusType>(currentStatusType);
  const [note, setNote] = useState("");
  const [deadline, setDeadline] = useState<string | null>(null);

  // Reset form whenever modal opens or values change
  useEffect(() => {
    if (open) {
      setSelectedIpType(ipType);
      setSelectedStatus(currentStatusType);
      setNote("");
      setDeadline(null);
    }
  }, [open, ipType, currentStatusType]);

  useEffect(() => {
    if (!open) return;

    const suggestion = getSuggestedDeadline(selectedStatus);
    // Only overwrite if a suggestion exists; otherwise, keep it null or let the user choose
    if (suggestion) {
      setDeadline(suggestion);
    } else {
      setDeadline(null);
    }
  }, [selectedStatus, open]);

  if (!open) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-sm font-semibold text-slate-900">
          Update status &amp; notify record
        </h2>
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
              onClick={onCancel}
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
    </div>
  );
}
