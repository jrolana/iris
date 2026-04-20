import React from "react";
import ApplicationsTable from "@/components/common/ApplicationsTable";

export default function TechgenApplicationRegistry() {
  return (
    <div>
      <ApplicationsTable isTechgen={true} />
    </div>
  );
}
