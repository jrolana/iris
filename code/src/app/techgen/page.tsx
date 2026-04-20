"use client";

import { MetricsTechgen } from "@/components/techgen/MetricsTechgen";
import React, { useMemo } from "react";
import StatusUpdatesPanel from "@/components/techgen/StatusUpdatesPanel";
import { useGetUserApplicationIds } from "@/hooks/applications/useGetUserApplications";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default function TechgenDashboard() {
  const { userApplicationIds } = useGetUserApplicationIds();

  // children gets stable reference
  const applicationIds = useMemo(() => {
    return userApplicationIds
      ?.map((app) => app.application_id)
      .filter((id): id is string => id != null && id.trim() !== "");
  }, [userApplicationIds]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your applications and recent status updates.
          </p>
        </div>

        <Link
          href="/techgen/new-application"
          className="bg-brand-500 hover:bg-brand-600 inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-white"
        >
          <PlusIcon size={18} />
          Add New Application
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-8">
        <div className="col-span-12 xl:col-span-8">
          <MetricsTechgen />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <StatusUpdatesPanel applicationIds={applicationIds ?? []} />
        </div>
      </div>
    </div>
  );
}
