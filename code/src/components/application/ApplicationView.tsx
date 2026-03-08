"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUpdateApplication } from "@/hooks/applications/useUpdateApplication";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCurrStatus } from "@/hooks/applications/useGetCurrStatus";

import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { ApplicationType } from "@/lib/types/application";
import { StatusType } from "@/lib/types/ip";
import { formatDateTime, formatDate } from "@/lib/helper/format-date";

import { InlineEdit } from "../form/input/InlineEdit";
import ApplicationStepper from "@/components/application/ApplicationStepper";
import StatusHistoryPanel from "@/components/application/StatusHistoryPanel";
import InformationPanel from "./InformationPanel";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export type ApplicationViewMode = "applicant" | "admin";

interface ApplicationViewProps {
  mode: ApplicationViewMode;
  initialApplication: ApplicationType["Row"];
}

function ApplicationView(props: ApplicationViewProps) {
  const { mode, initialApplication: application } = props;

  const [ipTitle, setIpTitle] = useState(application.ip_title);
  const [ipNumber, setIpNumber] = useState(application.ip_number);

  const { updateApp } = useUpdateApplication({
    appId: application.id,
  });

  const queryClient = useQueryClient();

  const { status: currentStatus, isLoading: isLatestStatusLoading } =
    useGetCurrStatus({ statusId: application.curr_status });

  const router = useRouter();

  const statusLabel =
    STATUS_LABELS[currentStatus?.status_type as StatusType] ??
    currentStatus?.status_type;

  // handlers for admin, could be moved later on
  const isAdmin = mode === "admin";
  if (!isAdmin) {
    console.log("not admin", application.ip_number);
  } else {
    console.log("admin", application.ip_number);
  }

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
            {isAdmin && !application.is_withdrawn ? (
              <InlineEdit
                value={ipTitle ?? ""}
                onSave={async (newValue) => {
                  if (newValue == ipTitle || !newValue) return;

                  try {
                    await updateApp(
                      {
                        id: application.id,
                        applicationData: { ip_title: newValue },
                      },
                      {
                        onSuccess: () => {
                          setIpTitle(newValue);
                          queryClient.invalidateQueries({
                            queryKey: ["application", application.id],
                          });
                          toast.success("Successfully changed IP title.");
                        },
                        onError: () => {
                          toast.error(
                            "There was a problem changing the IP title.",
                          );
                        },
                      },
                    );
                  } catch (e) {
                    console.error(
                      e instanceof Error
                        ? e.message
                        : "There was a problem changing the IP title.",
                    );
                  }
                }}
                className="text-lg font-semibold text-gray-900 sm:text-2xl!"
              />
            ) : (
              <h1 className="text-lg font-semibold text-gray-900 sm:text-2xl!">
                {ipTitle}
              </h1>
            )}
          </div>
          {application.project_title && (
            <p className="mt-1 text-lg text-gray-600">
              {application.project_title}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-700">
              {ipTypeToTitle(application.ip_type)}
            </span>
            {statusLabel && (
              <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
                {statusLabel}
              </span>
            )}
            {isAdmin && !application.is_withdrawn ? (
              <div className="flex flex-row items-center gap-3 rounded-full bg-gray-600 px-3 py-1 text-white">
                IP Number:{" "}
                <InlineEdit
                  value={ipNumber ?? ""}
                  onSave={async (newValue) => {
                    if (newValue == ipNumber || !newValue) return;

                    try {
                      await updateApp(
                        {
                          id: application.id,
                          applicationData: { ip_number: newValue },
                        },
                        {
                          onSuccess: () => {
                            setIpNumber(newValue);
                            queryClient.invalidateQueries({
                              queryKey: ["application", application.id],
                            });
                            toast.success("Successfully changed IP number.");
                          },
                          onError: () => {
                            toast.error(
                              "There was a problem changing the IP number.",
                            );
                          },
                        },
                      );
                    } catch (e) {
                      console.error(
                        e instanceof Error
                          ? e.message
                          : "There was a problem changing the IP number.",
                      );
                    }
                  }}
                  className="h-full text-sm"
                />
              </div>
            ) : (
              !!ipNumber && (
                <p className="flex flex-row items-center gap-3 rounded-full bg-gray-600 px-3 py-1 text-white">
                  IP Number: {ipNumber}
                </p>
              )
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
              {`Application Start: ${formatDate(application.created_at)}`}
            </p>
          )}
          {application.filing_date && (
            <p className="mt-1">
              {`Filing Date: ${formatDate(application.filing_date)}`}
            </p>
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

      <main className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* left panel for the attachments and inventors */}
        <section className="min-w-0 space-y-4 lg:col-span-7">
          <InformationPanel
            applicationId={application.id}
            parentApplicationId={application.parent_application_id}
            mode={mode}
            isUneditable={application.is_archived || application.is_withdrawn}
          />
        </section>

        {/* right panels, status history and the reminders (could be change later on for something more useful)*/}
        <section className="min-w-0 space-y-4 lg:col-span-5">
          <StatusHistoryPanel
            variant={isAdmin ? "ttbdo" : "techgen"}
            application={application}
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
