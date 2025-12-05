"use client";

import React from "react";
import { Accordion } from "@/components/ui/Accordion";

export default function ApplicationFlowChart() {
  return (
    <div className="shadow-default space-y-4 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6">
      <div className="pt-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Full Application Flow Charts
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Process flow diagrams for each type of IP application.
        </p>
      </div>

      <div className="mt-3 space-y-3">
        <Accordion
          title="TM, UM/ID, Patent"
          imgPath="/images/process-flow/others.png"
          width={1000}
          height={1000}
        />
        <Accordion
          title="Copyright"
          imgPath="/images/process-flow/copyright.png"
          width={540}
          height={960}
        />
      </div>
    </div>
  );
}
