import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import ApplicationsTable from "@/components/techgen/ApplicationsTable";

export default function Homepage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-7">
        <EcommerceMetrics />
      </div>

      {/* Should be status history instead */}
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <ApplicationsTable />
      </div>
    </div>
  );
}
