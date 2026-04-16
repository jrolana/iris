"use client";

import { useState } from "react";
import clsx from "clsx";
import { CircleHelp, ShieldCheck } from "lucide-react";

import CallToAction from "@/components/common/CallToAction";
import DisclosureFormActions from "@/components/application/DisclosureFormActions";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { IpType, IP_TYPES } from "@/lib/types/ip";
import { cn } from "@/lib/utils";
import Button from "../ui/button/Button";

interface PropsInterface {
  isApplicant?: boolean;
}

export default function ApplicationDocuments(props: PropsInterface) {
  const { isApplicant = true } = props;
  const [activeIpType, setActiveIpType] = useState<IpType>("patent");

  return (
    <div className="space-y-6">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-blue-700">Document hub</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
          Application Documents
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Browse forms and reference files by IP type before starting your
          application in IRIS.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="rounded-2xl bg-slate-100 p-1.5">
            <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {IP_TYPES.map((ipType) => {
                const isActive = ipType === activeIpType;

                return (
                  <button
                    key={ipType}
                    type="button"
                    onClick={() => setActiveIpType(ipType)}
                    className={clsx(
                      "shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition",
                      isActive
                        ? "bg-white text-blue-700 ring-1 ring-blue-100 ring-inset"
                        : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                    )}
                  >
                    {ipTypeToTitle(ipType)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <DisclosureFormActions
              title={ipTypeToTitle(activeIpType)}
              description=""
              finalIpType={activeIpType}
              showHeader={false}
              showProceed={false}
              showFooterNote={false}
              filesTitle={null}
            />
          </div>
        </section>

        <aside
          className={`space-y-4 ${isApplicant ? "" : "flex flex-col-reverse justify-end gap-2"}`}
        >
          {isApplicant && (
            <CallToAction
              title="Ready to begin?"
              description="Start a new IP application once you’re ready."
              primaryLabel="Start a New IP Application"
              primaryHref="/techgen/new-application"
              showSecondaryButton={false}
            />
          )}

          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-slate-100 p-2">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Reminders
              </h2>
            </div>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Use files that match your selected IP type.</li>
              <li>Check the forms before filling them out.</li>
              <li>Prepare complete supporting requirements early.</li>
            </ul>
          </section>

          <section
            className={cn(
              "bg-white p-5 transition-all duration-300",
              isApplicant
                ? // Applying our new custom class from globals.css
                  "rounded-3xl border border-slate-200"
                : "animate-sky-pulse rounded-3xl border-2",
            )}
          >
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-slate-100 p-2">
                <CircleHelp className="h-5 w-5 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Need help?
              </h2>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              {isApplicant
                ? "You can review the files here first, then use the application wizard when you are ready to begin."
                : "You can review the files here to get familiar with the application process. You can also check out the application wizard to find out which IP type is right for you."}
            </p>
            {!isApplicant && (
              <Button
                size="md"
                variant="primary"
                onClick={() => {
                  globalThis.location.href = "/wizard";
                }}
                className="mt-4 w-full flex-1"
              >
                Use Application Wizard
              </Button>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
