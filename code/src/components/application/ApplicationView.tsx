"use client";

import { useRouter } from "next/navigation";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import ApplicationStepper from "@/components/application/Stepper";
import StatusHistoryPanel from "@/components/application/StatusPanel";
import { STATUS_LABELS } from "@/lib/helper/status-labels";

import { ApplicationType } from "@/lib/types/application";
import InformationPanel from "./InformationPanel";
import { SquarePen, ArrowLeft } from "lucide-react";
import { StatusType } from "@/lib/types/ip";

export type ApplicationViewMode = "applicant" | "admin";

interface ApplicationViewProps {
  mode: ApplicationViewMode;
  initialApplication: ApplicationType["Row"];
}

function ApplicationView(props: ApplicationViewProps) {
  const { mode, initialApplication: application } = props;

  const statusLabel =
    STATUS_LABELS[application.current_status as StatusType] ??
    application.current_status;

  console.log(application);

  const router = useRouter();

  // handlers for admin, could be moved later on
  const isAdmin = mode === "admin";

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
              {application.ip_title}
            </h1>
            {isAdmin && (
              <button onClick={handleBack}>
                <SquarePen size={20} />
              </button>
            )}
          </div>
          {application.project_title && (
            <div className="flex flex-row items-center gap-3">
              <p className="mt-1 text-lg text-gray-600">
                {application.project_title}
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
              {ipTypeToTitle(application.ip_type)}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
              {statusLabel}
            </span>
            {application.id && (
              <span className="rounded-full bg-gray-600 px-3 py-1 text-white">
                Application I.D. {application.id}
              </span>
            )}
          </div>
        </div>

        <div className="text-md text-gray-600 sm:text-right">
          <p className="font-bold text-gray-900">
            {application.created_at
              ? "Ongoing application"
              : "Draft application"}
          </p>
          {application.created_at && (
            <p className="mt-1">
              {`Date of filing: ${new Date(application.created_at).toLocaleDateString()}`}
            </p>
          )}
          {isAdmin && application.updated_at && (
            <p className="mt-1">
              {`Last updated: ${new Date(application.updated_at).toLocaleString()}`}
            </p>
          )}
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
        <ApplicationStepper
          ipType={application.ip_type}
          statusType={application.current_status}
          currentStageDeadline={application.current_stage_deadline}
        />
      </section>

      <main className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
        {/* left panel for the attachments and inventors */}
        <section className="space-y-4">
          <InformationPanel applicationId={application.id} mode={mode} />
        </section>

        {/* right panels, status history and the reminders (could be change later on for something more useful)*/}
        <section className="space-y-4">
          <StatusHistoryPanel
            applicationId={application.id}
            currentStatusType={application.current_status}
            variant={isAdmin ? "ttbdo" : "techgen"}
          />

          {mode === "applicant" ? <ApplicantReminders /> : <AdminReminders />}
        </section>
      </main>
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
