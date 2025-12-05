"use client";

import React from "react";

export default function ApplicationGuide() {
  return (
    <div className="shadow-default space-y-4 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Apply for Intellectual Property Rights Online
          </h3>
          <p className="text-theme-sm mt-1 font-normal text-gray-500">
            Submit, track, and manage IP applications through{" "}
            <span className="text-brand-500 font-bold">IRIS</span>—the official
            UPV IP Management System.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <h4 className="text-base font-semibold text-gray-800">
          Steps to Apply
        </h4>
        <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm text-gray-700">
          <li>Log in to IRIS using your UPV credentials.</li>
          <li>
            Complete and upload the required forms:
            <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
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

      <div className="space-y-1 pt-2 text-sm text-gray-700 dark:text-gray-300">
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
  );
}
