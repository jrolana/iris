import React from "react";
import PieChart from "@/components/charts/PieChart";
import CombinationChart from "@/components/charts/CombinationChart";
import DonutChart from "@/components/charts/DonutChart";
import Button from "@/components/ui/button/Button";
import { CiExport } from "react-icons/ci";
import { PIE_SERIES_2 } from "@/lib/dummy-data/metrics";
import { ANALOGOUS_COLORS } from "@/lib/constants/ui";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
      <div className="mt-3 mb-6 text-2xl font-bold text-gray-700 lg:col-span-6">
        <h1>IP Portfolio at Glance</h1>
      </div>

      <div className="mt-3 mb-6 flex flex-1 justify-end lg:col-span-6">
        <Button startIcon={<CiExport size="18" />}>Export Reports</Button>
      </div>

      <div className="flex flex-col justify-between gap-4 lg:col-span-7 md:flex-row">
        <div className="md:w-[48%]">
          <PieChart
            title="Filed IPs"
            subtitle="Total filed IPs by type since 2013"
            colors={ANALOGOUS_COLORS}
          />
        </div>
        <div className="md:w-[48%]">
          <PieChart
            title="Granted IPs"
            subtitle="Total granted IPs by type since 2013"
            series={PIE_SERIES_2}
            colors={ANALOGOUS_COLORS}
          />
        </div>
      </div>

      <div className="lg:col-span-5">
        <DonutChart title="Granted IPs" />
      </div>

      <div className="my-6 text-2xl font-bold text-gray-700 lg:col-span-12">
        <h1>IP Journey: From Filing to Outcome</h1>
      </div>

      <div className="lg:col-span-6">
        <CombinationChart title="Filed" />
      </div>

      <div className="lg:col-span-6">
        <CombinationChart title="Pending" />
      </div>

      <div className="lg:col-span-12">
        <CombinationChart title="Granted" />
      </div>

      <div className="my-6 flex items-center space-x-3 lg:col-span-12">
        <span className="h-px flex-1 bg-gray-300"></span>
        <h2 className="text-xl font-semibold text-gray-700">
          Alternative Outcomes
        </h2>
        <span className="h-px flex-1 bg-gray-300"></span>
      </div>

      <div className="lg:col-span-6">
        <CombinationChart title="Withdrawn" />
      </div>

      <div className="lg:col-span-6">
        <CombinationChart title="Downgraded" />
      </div>
    </div>
  );
}
