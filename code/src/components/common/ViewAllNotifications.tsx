"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useGetNotifications } from "@/hooks/notifications/useGetNotifications";
import { useMarkAsRead } from "@/hooks/notifications/useMarkAsRead";
import { useQueryClient } from "@tanstack/react-query";
import { formatDateTime, formatTime } from "@/lib/helper/format-date";
import { isToday } from "date-fns";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

type FilterType = "all" | "unread" | "read";

export default function ViewAllNotifications() {
  const queryClient = useQueryClient();
  const { notifications, isLoading } = useGetNotifications();
  const { markNotificationAsRead } = useMarkAsRead();
  const [filter, setFilter] = useState<FilterType>("all");
  const router = useRouter();

  const unreadCount =
    notifications?.filter((n) => n.read_at === null).length ?? 0;

  async function markAsRead(notifId: string, readAt: null | string) {
    if (readAt) return;
    await markNotificationAsRead(
      { notifId },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["notifications"] }),
      },
    );
  }

  async function markAllAsRead() {
    const unread = notifications?.filter((n) => n.read_at === null) ?? [];
    await Promise.all(
      unread.map((n) =>
        markNotificationAsRead(
          { notifId: n.id },
          {
            onSuccess: () =>
              queryClient.invalidateQueries({ queryKey: ["notifications"] }),
          },
        ),
      ),
    );
  }

  const filtered = notifications?.filter((n) => {
    if (filter === "unread") return n.read_at === null;
    if (filter === "read") return n.read_at !== null;
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-white px-6 py-8 transition-colors sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="relative mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="absolute -left-20 flex inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
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
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <Button size="sm" variant="primary" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-4 flex gap-2">
          {(["all", "unread", "read"] as FilterType[]).map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={filter === tab ? "primary" : "outline"}
              onClick={() => setFilter(tab)}
              className="relative flex-1 capitalize transition-colors"
            >
              {tab}
              {tab === "unread" && unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
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
            filtered.map((notif) => (
              <li key={notif.id}>
                <Button
                  onClick={() => markAsRead(notif.id, notif.read_at)}
                  size="md"
                  variant="outline"
                  className={`w-full justify-start gap-3 p-4 text-left transition-colors duration-200 ${
                    notif.read_at === null
                      ? "bg-orange-50 hover:bg-orange-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex w-full items-start gap-3">
                    {/* Unread indicator */}
                    <span className="mt-1.5 flex h-5 w-5 items-center justify-center">
                      {notif.read_at === null ? (
                        <span className="h-2 w-2 rounded-full bg-orange-500/75" />
                      ) : (
                        <span className="h-2 w-2 rounded-full border border-gray-300 bg-transparent" />
                      )}
                    </span>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium transition-colors ${
                          notif.read_at === null
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {notif.content}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {notif.created_at &&
                          (isToday(new Date(notif.created_at))
                            ? `Today at ${formatTime(notif.created_at)}`
                            : formatDateTime(notif.created_at))}
                      </p>
                    </div>

                    {/* Mark read hint */}
                    {notif.read_at === null && (
                      <span className="mt-1 shrink-0 text-xs text-orange-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Mark read
                      </span>
                    )}
                  </div>
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
