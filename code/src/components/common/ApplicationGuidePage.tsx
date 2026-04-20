"use client";

import ApplicationFlowChart from "@/components/common/ApplicationFlowChart";
import CallToAction from "@/components/common/CallToAction";
import ApplicationGuide from "./ApplicationGuide";

interface ApplicationGuidePageProps {
  isApplicant?: boolean;
}

export default function ApplicationGuidePage(props: ApplicationGuidePageProps) {
  const { isApplicant = false } = props;

  return (
    <div className="space-y-6">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-blue-700">Getting started</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
          Application Guide
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Learn the basic steps, required documents, and process flow before
          applying for IP protection through IRIS.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ApplicationGuide />

        <aside className="space-y-4">
          <CallToAction
            title={isApplicant ? "Ready to begin?" : "Ready to apply?"}
            description={
              isApplicant
                ? "Start a new IP application once you’re ready."
                : "Sign in to IRIS when you’re ready to begin your application."
            }
            primaryLabel={
              isApplicant
                ? "Start a New IP Application"
                : "Apply for IP Protection"
            }
            primaryHref={isApplicant ? "/techgen/new-application" : "/signin"}
            showSecondaryButton={false}
          />
        </aside>
      </div>

      <ApplicationFlowChart />
    </div>
  );
}
