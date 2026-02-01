"use client";

import { Metrics } from "@/components/techgen/Metrics";
import React, { useMemo } from "react";
import ApplicationsTable from "@/components/common/ApplicationsTable";
import StatusUpdatesPanel from "@/components/techgen/StatusUpdatesPanel";
import { useGetUserApplicationIds } from "@/hooks/applications/useGetUserApplications";

export default function TechgenDashboard() {
  const { userApplicationIds } = useGetUserApplicationIds();

  // children gets stable reference
  const applicationIds = useMemo(() => {
    return userApplicationIds
      ?.map((app) => app.application_id)
      .filter((id): id is string => id != null && id.trim() !== "");
  }, [userApplicationIds]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-7">
        <Metrics />
      </div>

      <div className="col-span-12 xl:col-span-5">
        {applicationIds && applicationIds.length > 0 ? (
          <StatusUpdatesPanel applicationIds={applicationIds} />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Status history
              </h2>
            </div>
            No status history available.
          </div>
        )}
      </div>

      <div className="col-span-12">
        <ApplicationsTable isTechgen={true} />
      </div>
    </div>
  );
}
