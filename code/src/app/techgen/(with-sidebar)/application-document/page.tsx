import React from "react";
import Button from "@/components/ui/button/Button";
import CallToAction from "@/components/common/CallToAction";

const TechGenApplicationDocs: React.FC = () => {
  const sections = [
    {
      title: "1. Required Forms",
      items: [
        {
          name: "Invention Disclosure Form (Form 1A)",
          desc: "Provides details of your invention or IP.",
          action: "Download Form",
        },
        {
          name: "Prior Art Search Report (Form 1B)",
          desc: "Summarizes prior similar works.",
          action: "Download Form",
        },
      ],
    },
    {
      title: "2. Commitment & Assignment Documents",
      items: [
        {
          name: "Commitment Letter",
          desc: "Confirms your intent to proceed with IP filing.",
          action: "Sample Letter",
        },
        {
          name: "Deed of Assignment for Invention",
          desc: "Transfers IP rights to the University.",
          action: "Template",
        },
        {
          name: "Deed of Assignment for Student Thesis",
          desc: "Transfers IP rights from a thesis project to the University.",
          action: "Template",
        },
        {
          name: "Deed of Assignment for Copyright",
          desc: "Transfers copyright ownership to the University.",
          action: "Template",
        },
      ],
    },
    {
      title: "3. IP-Specific Applications",
      items: [
        {
          name: "Trademark Application (IPOPHL Form 400)",
          desc: "For trademark registration.",
          action: "Download Form",
        },
        {
          name: "Copyright Registry Enrollment Form",
          desc: "For copyright registration.",
          action: "Download Form",
        },
        {
          name: "BCRR Supplemental Sheet for Copyright Application",
          desc: "Additional information for copyright registration.",
          action: "Download Form",
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-8">
      <div className="col-span-8">
        <h1 className="text-2xl font-semibold">Application Documents</h1>
        <p className="mt-2 text-gray-600">
          Prepare the required documents before submitting your Intellectual
          Property (IP) application through IRIS.
        </p>
        <div className="mt-4 flex flex-wrap justify-between gap-4">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="shadow-default flex flex-1/2 flex-col rounded-2xl border border-gray-200 bg-white p-5"
            >
              <h2 className="mb-4 text-lg font-medium">{section.title}</h2>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      {item.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-4">
        <CallToAction />
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

export default TechGenApplicationDocs;
