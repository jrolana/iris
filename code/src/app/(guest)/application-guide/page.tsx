"use client";

import React, { useState } from "react";

export default function IPApplicationCard() {
  const [showFlow, setShowFlow] = useState(false);

  return (
    <div className="shadow-default space-y-4 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Apply for Intellectual Property Rights Online
          </h3>
          <p className="text-theme-sm mt-1 font-normal text-gray-500 dark:text-gray-400">
            Submit, track, and manage IP applications through IRIS, the official
            UPV IP Management System.
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowFlow(!showFlow)}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        {showFlow ? "Hide Process Flow" : "View Full Process Flow"}
      </button>

      {/* TODO: Add accordion for each IP type */}
      {showFlow && (
        <div className="mt-3 w-full rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
            Process Flow Image Placeholder
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Overview of the Intellectual Property Application process.
          </p>
        </div>
      )}

      <div className="space-y-4 pt-2">
        <div>
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Steps to Apply
          </h4>
          <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm text-gray-700 dark:text-gray-300">
            <li>Log in to the IRIS using your UPV credentials.</li>
            <li>
              Complete and upload the required forms:
              <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
                <li>Commitment Letter</li>
                <li>Invention Disclosure Form</li>
                <li>Prior Art Search Report</li>
                <li>Deed of Assignment (if applicable)</li>
                <li>Trademark Application Form</li>
                <li>Copyright Registry Form</li>
                <li>BCRR Supplemental Sheet</li>
              </ul>
            </li>
            <li>Upload supporting documents in the portal.</li>
            <li>Review drafted application documents from TTBDO.</li>
            <li>Submit final application and track status online.</li>
          </ol>
        </div>

        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-semibold">Processing Time:</span> Usually 2–3
            weeks.
          </p>
          <p>
            <span className="font-semibold">Fees:</span> Processed separately;
            instructions provided during submission.
          </p>
          <p>
            <span className="font-semibold">Support:</span> Contact TTBDO via
            email.
          </p>
        </div>
      </div>

      {/* TODO: Make it nicer, can be added to the side */}
      <div className="pt-4">
        <button className="bg-brand-500 w-full rounded-lg py-3 text-center text-sm font-semibold text-white hover:bg-blue-700">
          Start Your Application Now
        </button>
      </div>
    </div>
  );
}
