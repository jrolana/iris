"use client";

import React, { useState, ReactNode } from "react";
import clsx from "clsx";
import { formatDateTime, toSupabaseDateTime } from "@/lib/helper/format-date";
import { useAddPing } from "@/hooks/pings/useAddPing";
import { toast } from "sonner";
import { useUpdatePing } from "@/hooks/pings/useUpdatePing";
import { useGetPing } from "@/hooks/pings/useGetPing";
import { useQueryClient } from "@tanstack/react-query";

interface PingProps {
  isAdmin?: boolean;
  application_id: string;
  application_name: string;
  step_delayed: string;
  stage_delayed: string;
}

export default function Ping(props: PingProps) {
  const {
    isAdmin = false,
    application_id,
    application_name,
    step_delayed,
    stage_delayed,
  } = props;
  const [isSending, setIsSending] = useState(false);

  const { isLoading: isPinging, addPing } = useAddPing();
  const { isLoading: isAcknowledging, updatePing } = useUpdatePing();
  const { ping, isLoading: isFetchingPing } = useGetPing({
    applicationId: application_id,
  });
  const queryClient = useQueryClient();

  const handlePing = async () => {
    if (isSending) return;

    try {
      setIsSending(true);

      await addPing(
        {
          pingData: {
            application_id,
            application_name,
            stage_delayed,
            step_delayed,
          },
        },
        {
          onSuccess: () => {
            toast.success("Nasend na masaya ka na ba");
            queryClient.invalidateQueries({
              queryKey: ["get-ping", application_id],
            });
          },
          onError: (error) => {
            console.log(error);
            toast.error("Sensya lods di na send, better luck next time");
          },
        },
      );
    } catch {
    } finally {
      setIsSending(false);
    }
  };

  const handleAcknowledge = async () => {
    if (!ping || isSending) return;

    try {
      setIsSending(true);

      await updatePing(
        {
          pingData: {
            acknowledged_at: toSupabaseDateTime(new Date()),
          },
          pingId: ping.id,
        },
        {
          onSuccess: () => {
            toast.success("Acknowledged na");
            queryClient.invalidateQueries({
              queryKey: ["get-ping", application_id],
            });
          },
          onError: (error) => {
            console.log(error);
            toast.error(
              "Sensya lods di na acknowledged, better luck next time",
            );
          },
        },
      );
    } catch {
    } finally {
      setIsSending(false);
    }
  };

  function PingCard({ children }: { children: ReactNode }) {
    return (
      <div className="xsm:flex-row xsm:items-center xsm:justify-between flex flex-col items-start justify-between gap-2 p-3">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-rose-700 uppercase opacity-80">
            Processing Delay Detected
          </p>
          <p className="text-sm text-slate-700">
            {isAdmin
              ? "This application has exceeded the expected processing time. Please review the case and provide a status update to applicants."
              : "This application has exceeded its expected processing time. You may request a status update from TTBDO."}
          </p>
        </div>

        {children}
      </div>
    );
  }

  if (!ping && isAdmin) {
    return null;
  }

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
          {isSending ? "Requesting..." : "Request Status Update"}
        </button>
      </PingCard>
    );
  }

  return (
    <PingCard>
      {ping?.acknowledged_at ? (
        <>
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
              {isAdmin ? "" : "TTBDO "}Acknowledged the Request ✓
            </p>
            <p className="mt-1 text-xs text-emerald-800">
              Acknowledged on {formatDateTime(ping.acknowledged_at)}
            </p>
          </div>
        </>
      ) : (
        <>
          {isAdmin ? (
            <button
              onClick={handleAcknowledge}
              disabled={isSending}
              className={clsx(
                "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors",
                "focus:ring-2 focus:ring-amber-300 focus:ring-offset-1 focus:outline-none",
                "border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700",
                isSending && "cursor-wait opacity-70",
              )}
            >
              {isSending
                ? "Acknowledging Status Update..."
                : "Status Update Requested · Awaiting Response"}
            </button>
          ) : (
            <div className="inline-flex items-center rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold tracking-wide text-amber-700 uppercase">
              Status Update Requested · Awaiting Response
            </div>
          )}
        </>
      )}
    </PingCard>
  );
}
