import React from "react";
import ApplicationsTable from "@/components/common/ApplicationsTable";

export default function AdminApplicationRegistry() {
  return (
    <div>
      <ApplicationsTable isAdmin={true} />
    </div>
  );
}
