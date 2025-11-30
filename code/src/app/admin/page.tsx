import React from "react";
import PieChart from "@/components/ecommerce/PieChart";
import CombinationChart from "@/components/ecommerce/CombinationChart";
import ThreeSummary from "@/components/common/ThreeSummary";

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 my-6 text-2xl font-bold text-gray-700">
        <h1>IP Portfolio at Glance</h1>
      </div>

      <div className="col-span-7 flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="w-[48%]">
            <PieChart title="Filed IPs" />
          </div>
          <div className="w-[48%]">
            <PieChart
              title="Granted IPs"
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
        <ThreeSummary />
      </div>

      {/* TODO: Wrong use of graph */}
      <div className="col-span-5 h-full">
        <PieChart
          title="Filed vs Granted IPs"
          colors={["#465FFF", "#FF5F00"]}
          series={[0.6, 0.4]}
          labels={["Filed", "Granted"]}
        />
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
