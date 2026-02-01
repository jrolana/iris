import { Metrics } from "@/components/techgen/Metrics";
import React from "react";
import ApplicationsTable from "@/components/common/ApplicationsTable";
import StatusUpdatesPanel from "@/components/techgen/StatusUpdatesPanel";

export default function TechgenDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-7">
        <Metrics />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <StatusUpdatesPanel />
      </div>

      <div className="col-span-12">
        <ApplicationsTable isTechgen={true} />
      </div>
    </div>
  );
}
