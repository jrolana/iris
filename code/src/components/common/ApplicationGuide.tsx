"use client";

import { ListChecks } from "lucide-react";

const STEPS = [
  "Log in to IRIS using your UPV credentials.",
  "Prepare the forms required for your application.",
  "Upload your documents and supporting files through the portal.",
  "Review the drafted application documents prepared by TTBDO.",
  "Submit your final application and monitor updates through IRIS.",
];

export default function ApplicationGuide() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <div className="rounded-xl bg-white p-2">
          <ListChecks className="h-5 w-5 text-slate-700" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          Steps to apply
        </h3>
      </div>

      <ol className="mt-4 space-y-3 text-sm text-slate-600">
        {STEPS.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
