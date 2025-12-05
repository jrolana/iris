import { Metrics } from "@/components/techgen/Metrics";
import React from "react";
import ApplicationsTable from "@/components/common/ApplicationsTable";
import StatusHistoryPanel from "@/components/techgen/StatusPanel";
import {
  dummyApplication,
  dummyIprStatuses,
} from "@/lib/dummy-data/application";

export default function TechgenDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-7">
        <Metrics />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <StatusHistoryPanel
          statuses={dummyIprStatuses}
          currentStatusType={dummyApplication.currentStatus}
        />
      </div>

      <div className="col-span-12">
        <ApplicationsTable isTechgen={true}/>
      </div>
    </div>
  );
}
