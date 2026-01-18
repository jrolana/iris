import React from "react";
import Button from "@/components/ui/button/Button";
import CallToAction from "@/components/common/CallToAction";
import { APPLICATION_SECTION_GUIDES } from "@/lib/dummy-data/application_guide";

interface propsInterface {
  isApplicant?: boolean;
}
export default function ApplicationDocuments(props: propsInterface)  {
  const { isApplicant = true } = props;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-8">
      <div className="lg:col-span-8">
        <h1 className="text-2xl font-semibold">Application Documents</h1>
        <p className="mt-2 text-gray-600">
          Prepare the required documents before submitting your Intellectual
          Property (IP) application through IRIS.
        </p>
        <div className="mt-4 flex flex-wrap justify-between gap-4">
          {APPLICATION_SECTION_GUIDES.map((section, idx) => (
            <div
              key={idx}
              className="shadow-default flex flex-1/2 flex-col rounded-2xl border border-gray-200 bg-white p-5"
            >
              <h2 className="mb-4 text-lg font-medium">{section.title}</h2>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50 flex-col sm:flex-row"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full sm:w-fit">
                      {item.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4">
        <CallToAction isApplicant={isApplicant} />
        <div className="p-5">
          <h2 className="text-xl font-semibold">Notes</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
            <li>
              Prepare all documents before submitting your application on the
              Application Page in IRIS.
            </li>
            <li>
              TTBDO will review your documents and provide guidance throughout
              the application process.
            </li>
            <li>
              Ensure that all documents are complete to avoid delays in
              processing.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

