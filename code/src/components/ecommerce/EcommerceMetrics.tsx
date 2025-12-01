"use client";
import React from "react";
import { BoxIconLine, GroupIcon } from "@/icons";
import { MetricItem } from "../common/MetricItem";

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="col-span-2">
        <MetricItem
          metricIcon={GroupIcon}
          name="Granted"
          metric="3,782"
          difference="11.01%"
          increased={true}
        />
      </div>

      <MetricItem
        metricIcon={GroupIcon}
        name="Filed"
        metric="3,782"
        difference="11.01%"
        increased={true}
      />

      <MetricItem
        metricIcon={BoxIconLine}
        name="Pending"
        metric="5,359"
        difference="9.05%"
        increased={false}
      />

      <MetricItem
        metricIcon={GroupIcon}
        name="Withdrawn"
        metric="3,782"
        difference="11.01%"
        increased={false}
      />

      <MetricItem
        metricIcon={BoxIconLine}
        name="Downgrade"
        metric="5,359"
        difference="9.05%"
        increased={true}
      />
    </div>
  );
};
