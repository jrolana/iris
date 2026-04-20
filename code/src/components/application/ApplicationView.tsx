"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetCurrStatus } from "@/hooks/applications/useGetCurrStatus";
import useEditApplicationDetailsModal from "@/hooks/useEditApplicationDetailsModal";

import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { ApplicationType } from "@/lib/types/application";
import { StatusType } from "@/lib/types/ip";
import { formatDateTime, formatDate } from "@/lib/helper/format-date";

import ApplicationStepper from "@/components/application/ApplicationStepper";
import StatusHistoryPanel from "@/components/application/StatusHistoryPanel";
import InformationPanel from "./InformationPanel";
import EditApplicationDetailsModal from "../modals/EditApplicationDetailsModal";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ApplicationViewMode = "applicant" | "admin";

interface ApplicationViewProps {
  mode: ApplicationViewMode;
  initialApplication: ApplicationType["Row"];
}

function ApplicationView(props: ApplicationViewProps) {
  const { mode, initialApplication: application } = props;

  const [ipTitle, setIpTitle] = useState(application.ip_title);
  const [ipNumber, setIpNumber] = useState(application.ip_number);
  const [filingDate, setFilingDate] = useState(application.filing_date);

  const { openModal } = useEditApplicationDetailsModal();

  const { status: currentStatus, isLoading: isLatestStatusLoading } =
    useGetCurrStatus({ statusId: application.curr_status });

  const router = useRouter();

  const statusLabel =
    STATUS_LABELS[currentStatus?.status_type as StatusType] ??
    currentStatus?.status_type;

  const isAdmin = mode === "admin";

  function handleBack() {
    router.back();
  }

  return (
    <>
      <div className="relative mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Return to homepage"
          className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none xl:absolute xl:-left-20 xl:mb-0"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>

        <header className="flex flex-col gap-4">
          {isAdmin && !application.is_withdrawn && !application.is_archived ? (
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={openModal}
                className="border-brand-700 bg-brand-600 hover:border-brand-600 hover:text-brand-600 rounded-full border px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-white"
              >
                Edit details
              </Button>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-2">
            <div className="space-y-2 lg:col-span-2">
              <h1 className="text-lg font-semibold text-gray-900 sm:text-2xl!">
                {ipTitle}
              </h1>

              {application.project_title && (
                <p className="mt-1 text-lg text-gray-600">
                  {application.project_title}
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-700">
                  {ipTypeToTitle(application.ip_type)}
                </span>

                {statusLabel && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
                    {statusLabel}
                  </span>
                )}

                {!!ipNumber && (
                  <p className="flex flex-row items-center gap-3 rounded-full bg-gray-600 px-3 py-1 text-white">
                    IP Number: {ipNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="text-md text-gray-600 lg:text-right">
              <p className="font-bold text-gray-900">
                {application.created_at
                  ? "Ongoing application"
                  : "Draft application"}
              </p>

              {application.created_at && (
                <p className="mt-1">
                  {`Application Start: ${formatDate(application.created_at)}`}
                </p>
              )}

              {filingDate && (
                <p className="mt-1">{`Filing Date: ${formatDate(filingDate)}`}</p>
              )}

              {application.registration_date && (
                <p className="mt-1">
                  {`Registration Date: ${formatDate(application.registration_date)}`}
                </p>
              )}

              {isAdmin && application.updated_at && (
                <p className="mt-1">
                  {`Last Updated: ${formatDateTime(application.updated_at)}`}
                </p>
              )}
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
          {currentStatus ? (
            <ApplicationStepper
              ipType={application.ip_type}
              currentStageDeadline={currentStatus?.deadline ?? undefined}
              currentStatus={currentStatus}
              isAdmin={isAdmin}
              applicationId={application.id}
              applicationName={application.project_title}
            />
          ) : (
            <StatusPlaceholder
              type={isLatestStatusLoading ? "loading" : "empty"}
            />
          )}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="min-w-0 space-y-4 lg:col-span-7">
            <InformationPanel
              applicationId={application.id}
              parentApplicationId={application.parent_application_id}
              mode={mode}
              isUneditable={
                application.is_archived ||
                application.is_withdrawn ||
                currentStatus?.status_type === "downgraded_to_um"
              }
            />
          </section>

          <section className="min-w-0 space-y-4 lg:col-span-5">
            <StatusHistoryPanel
              variant={isAdmin ? "ttbdo" : "techgen"}
              application={application}
            />

            {mode === "applicant" ? <ApplicantReminders /> : <AdminReminders />}
          </section>
        </section>
      </div>

      <EditApplicationDetailsModal
        application={application}
        ipTitle={ipTitle}
        ipNumber={ipNumber}
        filingDate={filingDate}
        setIpTitle={setIpTitle}
        setIpNumber={setIpNumber}
        setFilingDate={setFilingDate}
      />
    </>
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

type StatusPlaceholderProps = {
  type: "loading" | "empty";
};

export function StatusPlaceholder({ type }: StatusPlaceholderProps) {
  if (type === "loading") {
    return (
      <div className="w-full space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
        <div className="mx-auto h-4 w-48 animate-pulse rounded bg-slate-200" />

        <div className="mx-auto flex max-w-lg flex-col items-center justify-center space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
      <h2 className="font-semibold text-slate-800">No status available yet</h2>

      <p className="mx-auto text-xs leading-relaxed text-slate-500 sm:text-sm">
        We’re preparing your application. Once it enters processing, you’ll see
        real-time updates here.
      </p>
    </div>
  );
}
