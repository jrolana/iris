import React from "react";
import PieChart from "@/components/charts/PieChart";
import CombinationChart from "@/components/charts/CombinationChart";
import DonutChart from "@/components/charts/DonutChart";
import Button from "@/components/ui/button/Button";
import { CiExport } from "react-icons/ci";

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-6 mt-3 mb-6 text-2xl font-bold text-gray-700">
        <h1>IP Portfolio at Glance</h1>
      </div>

      <div className="col-span-6 mt-3 mb-6 flex flex-1 justify-end">
        <Button startIcon={<CiExport size="18" />}>Export Reports</Button>
      </div>

      <div className="col-span-7 flex justify-between">
        <div className="w-[48%]">
          <PieChart
            title="Filed IPs"
            subtitle="Total filed IPs by type since 2013"
          />
        </div>
        <div className="w-[48%]">
          <PieChart
            title="Granted IPs"
            subtitle="Total granted IPs by type since 2013"
            colors={[
              "#FF9446",
              "#FF7F1F",
              "#FFAA66",
              "#FFB980",
              "#FF5F00",
              "#FFD099",
            ]}
          />
        </div>
      </div>

      <div className="col-span-5">
        <DonutChart title="Granted IP Rate" />
      </div>

      <div className="col-span-12 my-6 text-2xl font-bold text-gray-700">
        <h1>IP Journey: From Filing to Outcome</h1>
      </div>

      <div className="col-span-6">
        <CombinationChart title="Filed" />
      </div>

      <div className="col-span-6">
        <CombinationChart title="Pending" />
      </div>

      <div className="col-span-12">
        <CombinationChart title="Granted" />
      </div>

      <div className="col-span-12 my-6 flex items-center space-x-3">
        <span className="h-px flex-1 bg-gray-300"></span>
        <h2 className="text-xl font-semibold text-gray-700">
          Alternative Outcomes
        </h2>
        <span className="h-px flex-1 bg-gray-300"></span>
      </div>

      <div className="col-span-6">
        <CombinationChart title="Withdrawn" />
      </div>

      <div className="col-span-6">
        <CombinationChart title="Downgraded" />
      </div>
    </div>
  );
}
