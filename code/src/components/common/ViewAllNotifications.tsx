"use client";

import { useState } from "react";
import { useGetNotifications } from "@/hooks/notifications/useGetNotifications";
import { useMarkAsRead } from "@/hooks/notifications/useMarkAsRead";
import { formatDateTime, formatTime } from "@/lib/helper/format-date";
import { isToday } from "date-fns";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

type FilterType = "all" | "unread" | "read";

export default function ViewAllNotifications() {
  const { notifications, isLoading, isFetching } = useGetNotifications();
  const {
    markNotificationAsRead,
    markAllNotifcationsAsRead,
    isMarkingOne,
    isMarkingAll,
  } = useMarkAsRead();

  const [filter, setFilter] = useState<FilterType>("all");
  const router = useRouter();

  const unreadCount =
    notifications?.filter((n) => n.read_at === null).length ?? 0;

  async function markAsRead(notifId: string, readAt: null | string) {
    if (readAt) return;
    await markNotificationAsRead({ notifId });
  }

  async function markAllAsRead() {
    const unread = notifications?.filter((n) => n.read_at === null) ?? [];
    if (unread.length === 0) return;

    await markAllNotifcationsAsRead(unread);
  }

  const filtered = notifications?.filter((n) => {
    if (filter === "unread") return n.read_at === null;
    if (filter === "read") return n.read_at !== null;
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-white px-6 py-8 transition-colors sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="xsm:flex-row relative mb-6 flex flex-col items-start justify-between gap-2">
          <div className="xsm:gap-6 flex flex-row gap-4 sm:gap-10">
            <button
              onClick={() => router.back()}
              className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 lg:absolute lg:-left-20 lg:mb-0"
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
                Notifications
              </h1>

              <div className="mt-1 flex items-center gap-2">
                {unreadCount > 0 ? (
                  <p className="text-sm text-gray-500">{unreadCount} unread</p>
                ) : (
                  <p className="text-sm text-gray-500">All caught up</p>
                )}

                {!isLoading && isFetching && (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500" />
                    <span className="text-xs text-gray-400">Refreshing...</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {unreadCount > 0 ? (
            <Button
              size="sm"
              variant="primary"
              onClick={markAllAsRead}
              disabled={isMarkingAll || notifications?.length === 0}
            >
              {isMarkingAll ? "Marking all as read..." : "Mark all as read"}
            </Button>
          ) : (
            <div className="w-px" />
          )}
        </div>

        <div className="mb-4">
          <div className="inline-flex w-full rounded-xl border border-gray-200 bg-gray-50 p-1">
            {(["all", "unread", "read"] as FilterType[]).map((tab) => {
              const active = filter === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  disabled={isLoading}
                  className={[
                    "relative flex-1 overflow-visible rounded-lg px-3 py-2 text-sm font-semibold capitalize transition",
                    "focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 focus:outline-none",
                    active
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900",
                    isLoading ? "cursor-not-allowed opacity-60" : "",
                  ].join(" ")}
                >
                  {tab}

                  {tab === "unread" && unreadCount > 0 && (
                    <span className="absolute -top-1 right-1 flex h-5 min-w-[20px] animate-pulse items-center justify-center rounded-full bg-orange-500 px-1 text-xs leading-none font-semibold text-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

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
          ) : !filtered || filtered.length === 0 ? (
            <li className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-gray-700">
                {filter === "unread"
                  ? "No unread notifications"
                  : filter === "read"
                    ? "No read notifications"
                    : "No notifications yet"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {filter === "all"
                  ? "You're all caught up!"
                  : `Switch to "All" to see everything`}
              </p>
            </li>
          ) : (
            filtered.map((notif) => {
              const isUnread = notif.read_at === null;
              const isThisNotifLoading = isMarkingOne(notif.id);

              return (
                <li key={notif.id}>
                  <Button
                    onClick={() => markAsRead(notif.id, notif.read_at)}
                    size="md"
                    variant="outline"
                    disabled={isMarkingAll || isThisNotifLoading}
                    className={`group w-full justify-start gap-3 p-4 text-left transition-all duration-200 ${
                      isUnread
                        ? "bg-orange-50/40 hover:bg-orange-50/60 hover:shadow-sm hover:ring-1 hover:ring-orange-200/70"
                        : "bg-white hover:bg-gray-50 hover:shadow-sm hover:ring-1 hover:ring-gray-200/70"
                    } ${
                      isMarkingAll || isThisNotifLoading
                        ? "cursor-not-allowed opacity-80"
                        : ""
                    }`}
                  >
                    <div className="flex w-full items-start gap-3">
                      <span className="mt-1.5 flex h-5 w-5 items-center justify-center">
                        {isThisNotifLoading ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
                        ) : isUnread ? (
                          <span className="h-2 w-2 rounded-full bg-orange-500/75" />
                        ) : (
                          <span className="h-2 w-2 rounded-full border border-gray-300 bg-transparent transition-colors group-hover:border-gray-400" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold transition-colors ${
                            isUnread ? "text-gray-900" : "text-gray-800"
                          }`}
                        >
                          {notif.title}
                        </p>

                        <p className="mt-0.5 text-sm break-words text-gray-500">
                          {notif.content}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {notif.created_at &&
                            (isToday(new Date(notif.created_at))
                              ? `Today at ${formatTime(notif.created_at)}`
                              : formatDateTime(notif.created_at))}
                        </p>
                      </div>

                      {isUnread && (
                        <span className="mt-1 hidden shrink-0 text-xs font-semibold text-orange-500 transition-opacity duration-200 group-hover:block">
                          {isThisNotifLoading
                            ? "Marking as read..."
                            : "Mark read"}
                        </span>
                      )}
                    </div>
                  </Button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
