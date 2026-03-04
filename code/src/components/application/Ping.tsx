"use client";

import React, { ReactNode } from "react";
import clsx from "clsx";
import { formatDateTime, toSupabaseDateTime } from "@/lib/helper/format-date";
import { useAddPing } from "@/hooks/pings/useAddPing";
import { toast } from "sonner";
import { useUpdatePing } from "@/hooks/pings/useUpdatePing";
import { useGetPing } from "@/hooks/pings/useGetPing";

interface PingProps {
  isAdmin?: boolean;
  application_id: string;
  application_name: string;
  step_delayed: string;
  stage_delayed: string;
  target_date: string | Date;
}

export default function Ping(props: PingProps) {
  const {
    isAdmin = false,
    application_id,
    application_name,
    step_delayed,
    stage_delayed,
    target_date,
  } = props;

  const { isLoading: isPinging, addPing } = useAddPing();
  const { isLoading: isAcknowledging, updatePing } = useUpdatePing({
    applicationId: application_id,
  });
  const { ping, isLoading: isFetchingPing } = useGetPing({
    applicationId: application_id,
    stageDelayed: stage_delayed,
    stepDelayed: step_delayed,
  });

  const isSending = isPinging || isAcknowledging || isFetchingPing;

  const handlePing = async () => {
    if (isSending) return;

    await addPing(
      {
        pingData: {
          application_id,
          application_name,
          stage_delayed,
          step_delayed,
          target_date:
            target_date instanceof Date
              ? toSupabaseDateTime(target_date)
              : target_date,
        },
      },
      {
        onSuccess: () => {
          toast.success("Request submitted", {
            description:
              "Your request has been received. The office will provide an update as soon as possible.",
          });
        },
        onError: (error) => {
          console.log(error);
          toast.error("Request not submitted", {
            description:
              "Please try again. If the issue persists, refresh the page and retry.",
          });
        },
      },
    );
  };

  const handleAcknowledge = async () => {
    if (!ping || isSending) return;

    await updatePing(
      {
        pingData: {
          acknowledged_at: toSupabaseDateTime(new Date()),
        },
        pingId: ping.id,
      },
      {
        onSuccess: () => {
          toast.success("Request acknowledged", {
            description:
              "This confirms the office has received the request for review.",
          });
        },
        onError: (error) => {
          console.log(error);
          toast.error("Unable to acknowledge", {
            description:
              "Please try again. If it persists, refresh the page and retry.",
          });
        },
      },
    );
  };

  function PingCard({ children }: { children: ReactNode }) {
    return (
      <div className="xsm:flex-row xsm:items-center xsm:justify-between flex flex-col items-start justify-between gap-2 p-3">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-rose-700 uppercase opacity-80">
            Processing Update
          </p>

          <p className="text-sm text-slate-700">
            {isAdmin
              ? "This application is taking longer than expected. Please review the case and provide a status update for the applicant."
              : "Your application is taking longer than expected. You may request a status update from the office."}
          </p>
        </div>

        {children}
      </div>
    );
  }

  // Admin shouldn't see the card unless a request exists
  if (!ping && isAdmin) return null;

  // No request yet
  if (!ping) {
    return (
      <PingCard>
        <button
          onClick={handlePing}
          disabled={isSending}
          className={clsx(
            "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors",
            "focus:ring-2 focus:ring-rose-300 focus:ring-offset-1 focus:outline-none",
            "border-rose-500 text-rose-600 hover:bg-rose-50 hover:text-rose-700",
            isSending && "cursor-wait opacity-70",
          )}
        >
          {isFetchingPing
            ? "Fetching request..."
            : isSending
              ? "Submitting request…"
              : "Request a status update"}
        </button>
      </PingCard>
    );
  }

  // Request exists
  return (
    <PingCard>
      {ping?.acknowledged_at ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
            Request received by the office ✓
          </p>
          <p className="mt-1 text-xs text-emerald-800">
            Acknowledged on {formatDateTime(ping.acknowledged_at)}
          </p>
        </div>
      ) : isAdmin ? (
        <div className="xsm:items-end flex flex-col gap-2">
          <div className="inline-flex items-center rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold tracking-wide text-amber-700 uppercase">
            Status update requested · For review
          </div>

          <button
            onClick={handleAcknowledge}
            disabled={isSending}
            className={clsx(
              "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors",
              "focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1 focus:outline-none",
              "border-emerald-500 text-emerald-700 hover:bg-emerald-50",
              isSending && "cursor-wait opacity-70",
            )}
          >
            {isSending ? "Saving…" : "Acknowledge request"}
          </button>
        </div>
      ) : (
        <div className="inline-flex items-center rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold tracking-wide text-amber-700 uppercase">
          Status update requested · Pending office response
        </div>
      )}
    </PingCard>
  );
}
