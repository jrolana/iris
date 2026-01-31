import { Metrics } from "@/components/techgen/Metrics";
import React from "react";
import ApplicationsTable from "@/components/common/ApplicationsTable";
import StatusHistoryPanel from "@/components/application/StatusPanel";
import { useGetApplicationStatuses } from "@/hooks/status/useGetStatuses";
import { useSearchParams } from "next/navigation";

export default function TechgenDashboard() {
  const searchParams = useSearchParams();

  const applicationId = searchParams.get("applicationID") ?? "";
  const { statuses, isLoading } = useGetApplicationStatuses({
    applicationId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-7">
        <Metrics />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <StatusHistoryPanel applicationId={applicationId} />
      </div>

      <div className="col-span-12">
        <ApplicationsTable isTechgen={true} />
      </div>
    </div>
  );
}
