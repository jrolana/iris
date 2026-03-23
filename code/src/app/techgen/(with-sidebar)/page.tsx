"use client";

import { MetricsTechgen } from "@/components/techgen/MetricsTechgen";
import React, { useMemo } from "react";
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
    <div className="grid grid-cols-12 gap-4 md:gap-8">
      <div className="col-span-12 xl:col-span-8">
        <MetricsTechgen />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <StatusUpdatesPanel applicationIds={applicationIds ?? []} />
      </div>
    </div>
  );
}
