import React from "react";
import ApplicationsTable from "@/components/common/ApplicationsTable";

export default function ApplicationRegistry() {
  return (
    <div>
      <ApplicationsTable isOfficial={true} />
    </div>
  );
}
