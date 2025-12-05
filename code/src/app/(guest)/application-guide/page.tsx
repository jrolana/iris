"use client";

import ApplicationFlowChart from "@/components/common/ApplicationFlowChart";
import ApplicationGuide from "@/components/common/ApplicationGuide";
import CallToAction from "@/components/common/CallToAction";
import React from "react";

export default function GuestApplicationGuide() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-8">
        <ApplicationGuide />
      </div>

      <div className="col-span-4">
        <CallToAction isApplicant={false} />
      </div>

      <div className="col-span-12">
        <ApplicationFlowChart />
      </div>
    </div>
  );
}
