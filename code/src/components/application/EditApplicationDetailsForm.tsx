"use client";

import React, { useEffect, useMemo, useState } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApplicationType } from "@/lib/types/application";
import useEditApplicationDetailsModal from "@/hooks/useEditApplicationDetailsModal";
import { fromSupabaseDate, toSupabaseDate } from "@/lib/helper/format-date";
import { useConfirm } from "@/hooks/useConfirm";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import {
  getApplicationEditLockReason,
  isApplicationEditLocked,
} from "@/lib/helper/is-application-edit-locked";

interface EditApplicationDetailsFormProps {
  application: ApplicationType["Row"];
  currentStatusType: string | null;
  ipTitle: string | null;
  ipNumber: string | null;
  filingDate: string | null;
  setIpTitle: React.Dispatch<React.SetStateAction<string | null>>;
  setIpNumber: React.Dispatch<React.SetStateAction<string | null>>;
  setFilingDate: React.Dispatch<React.SetStateAction<string | null>>;
}

function EditApplicationDetailsForm(props: EditApplicationDetailsFormProps) {
  const {
    application,
    currentStatusType,
    ipTitle,
    ipNumber,
    filingDate,
    setIpTitle,
    setIpNumber,
    setFilingDate,
  } = props;

  const { closeModal, isOpen } = useEditApplicationDetailsModal();
  const confirm = useConfirm();

  const ipNumberParts = ipNumber ? ipNumber.split("/") : ["", "", ""];
  const [editIpNumberA, setEditIpNumberA] = useState(ipNumberParts[0] ?? "");
  const [editIpNumberB, setEditIpNumberB] = useState(ipNumberParts[1] ?? "");
  const [editIpNumberC, setEditIpNumberC] = useState(ipNumberParts[2] ?? "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editIpTitle, setEditIpTitle] = useState(ipTitle ?? "");
  const [editFilingDate, setEditFilingDate] = useState<Date | null>(
    filingDate ? fromSupabaseDate(filingDate) : null,
  );

  const queryClient = useQueryClient();

  const { updateApp } = useUpdateApplication({
    appId: application.id,
  });
  const isEditingLocked = isApplicationEditLocked({
    isWithdrawn: application.is_withdrawn,
    currentStatusType,
  });
  const editLockReason = getApplicationEditLockReason({
    isWithdrawn: application.is_withdrawn,
    currentStatusType,
  });

  useEffect(() => {
    if (!isOpen) return;

    setEditIpTitle(ipTitle ?? "");
    setEditIpNumberA(ipNumberParts[0] ?? "");
    setEditIpNumberB(ipNumberParts[1] ?? "");
    setEditIpNumberC(ipNumberParts[2] ?? "");
    setEditFilingDate(filingDate ? fromSupabaseDate(filingDate) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, ipTitle, ipNumber, filingDate]);

  const trimmedTitle = editIpTitle.trim();
  const trimmedNumber =
    editIpNumberA.trim() +
    "/" +
    editIpNumberB.trim() +
    "/" +
    editIpNumberC.trim();

  const noChangesMade = useMemo(() => {
    const isTitleSame = trimmedTitle === (ipTitle ?? "");
    const isNumberSame = trimmedNumber === (ipNumber ?? "");

    const currentFilingDate = filingDate ? fromSupabaseDate(filingDate) : null;

    const isFilingDateSame =
      (!currentFilingDate && !editFilingDate) ||
      (!!currentFilingDate &&
        !!editFilingDate &&
        isSameDay(currentFilingDate, editFilingDate));

    return isTitleSame && isNumberSame && isFilingDateSame;
  }, [
    trimmedTitle,
    ipTitle,
    trimmedNumber,
    ipNumber,
    filingDate,
    editFilingDate,
  ]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isEditingLocked) {
      toast.error(editLockReason ?? "This application can no longer be edited.");
      return;
    }

    const isConfirmed = await confirm({
      title: "Confirm changes",
      message: "Are you sure you want to update the application details?",
    });

    if (!isConfirmed) return;

    if (!trimmedTitle) {
      toast.error("IP title is required.");
      return;
    }

    const lenNumberBlank = trimmedNumber
      .split("/")
      .filter((part) => part === "").length;

    if (lenNumberBlank > 0 && lenNumberBlank < 3) {
      toast.error(
        "Please fill out all parts of the IP number or leave it blank.",
      );
      return;
    }

    if (noChangesMade) {
      closeModal();
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedFilingDate = editFilingDate
        ? toSupabaseDate(editFilingDate)
        : null;

      await updateApp({
        id: application.id,
        applicationData: {
          ip_title: trimmedTitle,
          ip_number:
            trimmedNumber && lenNumberBlank === 0 ? trimmedNumber : null,
          filing_date: normalizedFilingDate,
        },
      });

      setIpTitle(trimmedTitle);
      setIpNumber(trimmedNumber && lenNumberBlank === 0 ? trimmedNumber : null);
      setFilingDate(normalizedFilingDate);

      await queryClient.invalidateQueries({
        queryKey: ["application", application.id],
      });

      toast.success("Application details updated successfully.");
      closeModal();
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "There was a problem updating the application details.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full max-w-lg min-w-[85vw] flex-col sm:w-[80vh] sm:min-w-[400px]">
      {isEditingLocked ? (
        <div className="flex flex-col gap-4">
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {editLockReason}
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <>
      <p className="-mt-4 shrink-0 text-center text-sm leading-normal text-slate-600">
        Update the application details and filing date for this record.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex h-full flex-col text-sm"
      >
        <div className="min-h-0 flex-1 gap-4 overflow-y-auto px-1 pb-2">
          <div className="grid shrink-0 grid-cols-1 gap-4 py-2 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <Label>IP Title</Label>
              <textarea
                value={editIpTitle}
                placeholder="Enter IP title"
                onChange={(e) => setEditIpTitle(e.target.value)}
                rows={4}
                className="focus:border-brand-500 focus:ring-brand-500 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:outline-none"
              />
            </div>
            {/* IP number */}
            <div className="col-span-1">
              <Label>IP Number</Label>
              <div className="flex flex-row items-center gap-1">
                <Input
                  type="text"
                  value={editIpNumberA}
                  defaultValue={editIpNumberA}
                  placeholder="mm"
                  onChange={(e) => setEditIpNumberA(e.target.value)}
                  className="h-11 w-15! text-center"
                />
                <p>/</p>
                <Input
                  type="text"
                  value={editIpNumberB}
                  defaultValue={editIpNumberB}
                  placeholder="yyyy"
                  onChange={(e) => setEditIpNumberB(e.target.value)}
                  className="h-11 w-18! text-center"
                />
                <p>/</p>
                <Input
                  type="text"
                  value={editIpNumberC}
                  defaultValue={editIpNumberC}
                  placeholder="xxxxxx"
                  onChange={(e) => setEditIpNumberC(e.target.value)}
                  className="h-11 text-center"
                />
              </div>
            </div>
            {/* Filing date */}
            <div className="col-span-1 flex w-full shrink-0 flex-col items-start gap-1">
              <span className="font-medium text-slate-800">Filing Date</span>

              <div className="flex w-full flex-row items-center justify-between gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!editFilingDate}
                      className="data-[empty=true]:text-muted-foreground h-11 flex-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editFilingDate ? (
                        format(editFilingDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="z-9999 w-auto p-0">
                    <Calendar
                      fixedWeeks
                      mode="single"
                      selected={editFilingDate ?? undefined}
                      onSelect={(d) => setEditFilingDate(d ?? null)}
                      classNames={{
                        day_selected:
                          "bg-brand-600 text-white hover:bg-brand-600 hover:text-white focus:bg-brand-600 focus:text-white",
                        day_today: "bg-slate-100 text-slate-900",
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {editFilingDate && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-slate-500 hover:text-red-500"
                    onClick={() => setEditFilingDate(null)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Leave blank if the filing date is not yet available.
              </p>
            </div>
          </div>
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
            className="bg-brand-600 hover:bg-brand-700 rounded-full px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
        </>
      )}
    </div>
  );
}

export default EditApplicationDetailsForm;
