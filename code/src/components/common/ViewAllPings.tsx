"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatSmartDate, daysDelayed } from "@/lib/helper/format-date";
import { useGetAllPings } from "@/hooks/pings/useGetAllPings";
import { useUpdatePing } from "@/hooks/pings/useUpdatePing";
import { PingType } from "@/lib/types/ping";
import { toast } from "sonner";
import { toSupabaseTimestamp } from "@/lib/helper/format-date";

type FilterType = "all" | "pending" | "acknowledged";

export default function ViewAllPings() {
  const { pings, isLoading: isFetchingPings } = useGetAllPings();
  const { isLoading: isAcknowledging, updatePing } = useUpdatePing();
  const router = useRouter();

  const requests = pings ?? [];

  const [filter, setFilter] = useState<FilterType>("all");

  const pendingCount = useMemo(
    () => requests.filter((r) => r.acknowledged_at === null).length,
    [requests],
  );

  const filtered = useMemo(() => {
    if (filter === "pending") return requests.filter((r) => !r.acknowledged_at);
    if (filter === "acknowledged")
      return requests.filter((r) => Boolean(r.acknowledged_at));
    return requests;
  }, [requests, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aAck = a.acknowledged_at ? 1 : 0;
      const bAck = b.acknowledged_at ? 1 : 0;
      if (aAck !== bAck) return aAck - bAck;

      const delayDiff = daysDelayed(b.target_date) - daysDelayed(a.target_date);
      if (delayDiff !== 0) return delayDiff;

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [filtered]);

  async function acknowledgeOne(ping: PingType["Row"]) {
    await updatePing(
      {
        pingData: {
          acknowledged_at: toSupabaseTimestamp(new Date()),
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
        onError: () => {
          toast.error("Unable to acknowledge", {
            description:
              "Please try again. If it persists, refresh the page and retry.",
          });
        },
      },
    );
  }

  function openApplication(appId: string) {
    router.push(`/admin/view-application?applicationID=${appId}`);
  }

  const isLoading = false;

  return (
    <div className="min-h-screen w-full bg-white px-6 py-8 transition-colors sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="relative mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="absolute -left-20 flex inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
            aria-label="Back"
            title="Back"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Status Update Requests
            </h1>
            {pendingCount > 0 ? (
              <p className="text-sm text-gray-500">{pendingCount} pending</p>
            ) : (
              <p className="text-sm text-gray-500">All caught up</p>
            )}
          </div>

          <div className="w-[1px]" />
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="inline-flex w-full rounded-xl border border-gray-200 bg-gray-50 p-1">
            {(["all", "pending", "acknowledged"] as FilterType[]).map((tab) => {
              const active = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={[
                    "relative flex-1 rounded-lg px-3 py-2 text-sm font-semibold capitalize transition",
                    "focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 focus:outline-none",
                    active
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900",
                  ].join(" ")}
                >
                  {tab}

                  {tab === "pending" && pendingCount > 0 && (
                    <span className="absolute -top-1 -right-2 z-10 flex h-5 min-w-[20px] animate-pulse items-center justify-center rounded-full bg-rose-500 px-1 text-xs leading-none font-semibold text-white shadow-sm">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <ul className="flex flex-col gap-2">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <li
                key={i}
                className="flex animate-pulse gap-3 rounded-lg bg-gray-50 p-4 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                </div>
              </li>
            ))
          ) : sorted.length === 0 ? (
            <li className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-gray-700">
                {filter === "pending"
                  ? "No pending requests"
                  : filter === "acknowledged"
                    ? "No acknowledged requests"
                    : "No requests yet"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {filter === "all"
                  ? "You're all caught up!"
                  : `Switch to "All" to see everything`}
              </p>
            </li>
          ) : (
            sorted.map((req) => {
              const isAck = Boolean(req.acknowledged_at);
              const delayed = daysDelayed(req.target_date);

              return (
                <li key={req.id}>
                  <div
                    className={`group w-full justify-start gap-3 rounded-lg p-4 text-left ring-1 transition-all duration-200 ring-inset ${
                      !isAck
                        ? "bg-rose-50/40 ring-rose-200 hover:bg-rose-50/60 hover:shadow-sm hover:ring-1 hover:ring-rose-200/70"
                        : "bg-white ring-gray-200 hover:bg-gray-50 hover:shadow-sm hover:ring-1 hover:ring-gray-200/70"
                    }`}
                  >
                    <div className="flex w-full items-start gap-3">
                      {/* Pending indicator */}
                      <span className="mt-1.5 flex h-5 w-5 items-center justify-center">
                        {!isAck ? (
                          <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                        ) : (
                          <span className="h-2 w-2 rounded-full border border-gray-300 bg-transparent transition-colors group-hover:border-gray-400" />
                        )}
                      </span>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">
                            {req.stage_delayed}
                          </span>

                          {delayed > 0 ? (
                            <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                              {delayed}d delayed
                            </span>
                          ) : null}

                          {isAck ? (
                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                              Received
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                              For review
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                          {req.application_name}
                        </p>

                        <p className="mt-0.5 text-sm text-gray-500">
                          Target: {formatSmartDate(req.target_date)}
                          <span className="mx-2 text-gray-300">•</span>
                          {!isAck
                            ? `Requested ${formatSmartDate(req.created_at)}`
                            : `Acknowledged ${formatSmartDate(req.acknowledged_at!)}`}
                        </p>

                        <button
                          onClick={() => openApplication(req.application_id)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"
                        >
                          Open application
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="stroke-current transition-transform group-hover:translate-x-[1px]"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 17L17 7"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10 7H17V14"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {!isAck && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            acknowledgeOne(req);
                          }}
                          disabled={isAcknowledging}
                          className={[
                            "shrink-0 rounded-lg px-3.5 py-2",
                            "text-[11px] font-semibold tracking-wide uppercase",
                            "border border-emerald-700/20 bg-emerald-600 text-white shadow-sm",
                            "hover:bg-emerald-700 hover:shadow",
                            "active:translate-y-[0.5px] active:shadow-sm",
                            "focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1 focus:outline-none",
                            isAcknowledging ? "cursor-wait opacity-80" : "",
                          ].join(" ")}
                        >
                          {isAcknowledging ? "Saving…" : "Acknowledge"}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
