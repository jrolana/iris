"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IpType, StatusType } from "@/lib/types/ip";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import ApplicationStepper from "@/components/application/Stepper";
import StatusHistoryPanel from "@/components/application/StatusPanel";
import { STATUS_LABELS } from "@/lib/helper/status-labels";

import {
  ApplicationType,
  AttachmentType,
  InventorType,
} from "@/lib/types/application";
import { IprStatus } from "@/lib/types/status";
import InformationPanel from "./InformationPanel";

import StatusUpdateModal from "@/components/application/StatusUpdateModal";
import { SquarePen, ArrowLeft } from "lucide-react";

export type ApplicationViewMode = "applicant" | "admin";

interface ApplicationViewProps {
  mode: ApplicationViewMode;
  initialApplication: ApplicationType;
  initialAttachments: AttachmentType[];
  initialInventors: InventorType[];
  initialStatuses: IprStatus[];
}

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

function ApplicationView(props: ApplicationViewProps) {
  const {
    mode,
    initialApplication,
    initialAttachments,
    initialInventors,
    initialStatuses,
  } = props;
  const [application, setApplication] =
    useState<ApplicationType>(initialApplication);
  const [attachments, setAttachments] =
    useState<AttachmentType[]>(initialAttachments);
  const [inventors, setInventors] = useState<InventorType[]>(initialInventors);
  const [iprStatuses, setIprStatuses] = useState<IprStatus[]>(initialStatuses);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const statusLabel =
    STATUS_LABELS[application.currentStatus] ?? application.currentStatus;

  const router = useRouter();

  // handlers for admin, could be moved later on
  const isAdmin = mode === "admin";

  const handleAddAttachment = () => {
    if (!isAdmin) return;
    setHasUnsavedChanges(true);
    // actual add file/link flow will be wired later (modal, etc.)
  };

  const handleEditAttachment = (fileId: string) => {
    if (!isAdmin) return;
    console.log("edit attachment", fileId);
    setHasUnsavedChanges(true);
  };

  const handleDeleteAttachment = (fileId: string) => {
    if (!isAdmin) return;
    setAttachments((prev) => prev.filter((f) => f.fileId !== fileId));
    setHasUnsavedChanges(true);
  };

  // const handleAddInventor = () => {
  //   if (!isAdmin) return;
  //   setHasUnsavedChanges(true);
  // };

  const handleLinkInventor = (inventorId: string) => {
    // if (!isAdmin) return;
    console.log("link inventor", inventorId);
    setHasUnsavedChanges(true);
  };

  const handleAnnotateInventor = (inventorId: string) => {
    // if (!isAdmin) return;
    console.log("annotate inventor", inventorId);
    setHasUnsavedChanges(true);
  };

  // const handleRemoveInventor = (inventorId: string) => {
  //   if (!isAdmin) return;
  //   setInventors((prev) => prev.filter((i) => i.inventorId !== inventorId));
  //   setHasUnsavedChanges(true);
  // };

  const handleStartStatusUpdate = () => {
    if (!isAdmin) return;
    setHasUnsavedChanges(true);
  };

  const handleOpenStatusModal = () => {
    if (!isAdmin || !hasUnsavedChanges) return;
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusUpdate = (payload: {
    newIpType: IpType;
    newStatusType: StatusType;
    note: string;
    deadline?: string | null;
  }) => {
    //do the actual db changes here
    if (!isAdmin) return;

    const { newIpType, newStatusType, note, deadline } = payload;
    const nowIso = new Date().toISOString();

    setApplication((prev) => ({
      ...prev,
      ipType: newIpType,
      currentStatus: newStatusType,
      lastUpdated: nowIso,
    }));

    setIprStatuses((prev) => [
      ...prev,
      {
        statusId: `local-${prev.length + 1}`,
        status_type: newStatusType,
        note,
        deadline: deadline ?? null,
        created_at: nowIso,
      },
    ]);

    setHasUnsavedChanges(false);
    setIsStatusModalOpen(false);
  };

  const handleCancelStatusUpdate = () => {
    setIsStatusModalOpen(false);
  };

  function handleBack() {
    router.back();
  }

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 px-4 py-8">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Return to homepage"
        className="absolute -left-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none"
      >
        <ArrowLeft size={18} className="text-gray-700" />
      </button>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900 sm:text-2xl">
              {application.ipTitle}
            </h1>
            {isAdmin && (
              <button onClick={handleBack}>
                <SquarePen size={20} />
              </button>
            )}
          </div>
          {application.projectTitle && (
            <div className="flex flex-row items-center gap-3">
              <p className="mt-1 text-lg text-gray-600">
                {application.projectTitle}
              </p>
              {isAdmin && (
                <button onClick={() => {}}>
                  <SquarePen size={20} className="text-gray-600" />
                </button>
              )}
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-700">
              {ipTypeToTitle(application.ipType)}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
              {statusLabel}
            </span>
            {application.applicationNumber && (
              <span className="rounded-full bg-gray-600 px-3 py-1 text-white">
                App. No. {application.applicationNumber}
              </span>
            )}
          </div>
        </div>

        <div className="text-md text-gray-600 sm:text-right">
          <p className="font-bold text-gray-900">
            {application.filingDate
              ? "Ongoing application"
              : "Draft application"}
          </p>
          {application.filingDate && (
            <p className="mt-1">
              {`Date of filing: ${new Date(application.filingDate).toLocaleDateString()}`}
            </p>
          )}
          {isAdmin && application.lastUpdated && (
            <p className="mt-1">
              {`Last updated: ${new Date(application.lastUpdated).toLocaleString()}`}
            </p>
          )}
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
        <ApplicationStepper
          ipType={application.ipType}
          statusType={application.currentStatus}
        />
      </section>

      <main className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
        {/* left panel for the attachments and inventors */}
        <section className="space-y-4">
          <InformationPanel
            mode={mode}
            attachments={attachments}
            inventors={inventors}
            onAddAttachment={isAdmin ? handleAddAttachment : undefined}
            onEditAttachment={isAdmin ? handleEditAttachment : undefined}
            onDeleteAttachment={isAdmin ? handleDeleteAttachment : undefined}
            onLinkInventor={isAdmin ? undefined : handleLinkInventor}
            onAnnotateInventor={isAdmin ? handleAnnotateInventor : undefined}
          />
        </section>

        {/* right panels, status history and the reminders (could be change later on for something more useful)*/}
        <section className="space-y-4">
          <StatusHistoryPanel
            statuses={iprStatuses}
            currentStatusType={application.currentStatus}
            variant={isAdmin ? "ttbdo" : "techgen"}
            onStartStatusUpdate={isAdmin ? handleStartStatusUpdate : undefined}
          />

          {mode === "applicant" ? <ApplicantReminders /> : <AdminReminders />}
        </section>
      </main>

      {/* sticky button that shows when there are unsaved changes and ONLY shows in ADMIN mode */}
      {isAdmin && hasUnsavedChanges && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <div className="pointer-events-auto flex max-w-xl flex-1 items-center justify-between gap-3 rounded-full border border-sky-200 bg-white px-6 py-4 shadow-lg">
            <div className="text-md text-gray-700">
              <p className="font-semibold">Unsaved changes</p>
              <p className="text-sm">
                You&apos;ve made changes to this application. Save them and add
                a status note for the record.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenStatusModal}
              className="rounded-full bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Update status &amp; save
            </button>
          </div>
        </div>
      )}

      {/* status modal, change these later to the proper modal */}
      {isAdmin && (
        <StatusUpdateModal
          open={isStatusModalOpen}
          ipType={application.ipType}
          currentStatusType={application.currentStatus}
          ipTypeOptions={IP_TYPE_OPTIONS}
          statusOptions={STATUS_OPTIONS}
          onConfirm={handleConfirmStatusUpdate}
          onCancel={handleCancelStatusUpdate}
        />
      )}
    </div>
  );
}

export default ApplicationView;

//these are too small and trivial to be their own components
// Reminder cards, maybe waste of space but for add these for now
const ApplicantReminders = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5">
    <div className="rounded-lg bg-sky-50 p-3 text-xs text-sky-800">
      <p className="text-xl font-semibold">Reminders</p>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-[16px]">
        <li>Check your email and IRIS notifications for updates from TTBDO.</li>
        <li>
          Respond to questions and document requests before any indicated
          deadlines.
        </li>
        <li>
          Coordinate with TTBDO if there are changes in inventors, funding, or
          planned commercialization.
        </li>
      </ul>
    </div>
  </div>
);

const AdminReminders = () => (
  <div className="rounded-2xl border border-gray-200 bg-sky-50 p-5 text-xs text-sky-800">
    <p className="text-lg font-semibold">Internal reminders</p>
    <ul className="mt-2 list-disc space-y-1 pl-4 text-[16px]">
      <li>
        Coordinate with inventors for clarifications before updating formal
        status.
      </li>
      <li>
        Record major actions (e.g., filing, responses to reports) as a new
        status with a clear note.
      </li>
      <li>
        Ensure that changes in inventors, funding, or IP type are properly
        reflected in the records.
      </li>
    </ul>
  </div>
);
