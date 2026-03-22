"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { IpType } from "@/lib/types/ip";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { WizardResult } from "@/lib/structs/classification";
import ClassificationWizard from "@/components/application/Wizard";
import DisclosureFormActions from "./DisclosureFormActions";
import { DISCLOSURE_FORMS } from "@/lib/constants/disclosure-forms";
import { NewApplicationFlowType } from "@/lib/constants/new-application";

type Mode = "undecided" | "wizard" | "direct";

interface NewApplicationFlowProps {
  startApplicationPath: string;
  copy: NewApplicationFlowType;
}

export default function NewApplicationFlow(props: NewApplicationFlowProps) {
  const { startApplicationPath, copy } = props;
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("undecided");
  const [wizardResult, setWizardResult] = useState<WizardResult | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  function handleWizardFinished(result: WizardResult) {
    setWizardResult(result);
    setSelectedFormId(null);
    setMode("wizard");
  }

  function goToWizardMode() {
    setMode("wizard");
    setWizardResult(null);
    setSelectedFormId(null);
  }

  function goToDirectMode() {
    setMode("direct");
    setWizardResult(null);
    setSelectedFormId(null);
  }

  function handleBack() {
    router.back();
  }

  const selectedForm = useMemo(() => {
    if (mode !== "direct" || !selectedFormId) return null;

    return DISCLOSURE_FORMS.find((form) => form.id === selectedFormId) ?? null;
  }, [mode, selectedFormId]);

  const finalIpType: IpType | null =
    wizardResult?.ipType ?? selectedForm?.ipType ?? null;

  const canProceed = finalIpType !== null;

  const details = useMemo(() => {
    if (mode === "wizard" && wizardResult) {
      return {
        title: wizardResult.formName,
        description: wizardResult.summary,
      };
    }

    if (mode === "direct" && selectedForm) {
      return {
        title: selectedForm.label,
        description: selectedForm.detail,
      };
    }

    return {
      title: copy.defaultDetailsTitle,
      description: copy.defaultDetailsDescription,
    };
  }, [
    copy.defaultDetailsDescription,
    copy.defaultDetailsTitle,
    mode,
    selectedForm,
    wizardResult,
  ]);

  function handleProceed() {
    if (!finalIpType) return;
    router.push(`${startApplicationPath}?ipType=${finalIpType}`);
  }

  useEffect(() => {
    toast.info(copy.toastTitle, {
      description: copy.toastDescription,
      descriptionClassName: "!text-slate-500",
    });
  }, [copy.toastDescription, copy.toastTitle]);

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 px-4 py-8">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Return to previous page"
        className="absolute top-8 left-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none"
      >
        <ArrowLeft size={18} className="text-slate-700" />
      </button>

      <header className="flex flex-col items-start justify-between gap-4 pl-12 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {copy.pageTitle}
          </h1>
          <p className="mt-1 text-lg text-slate-500">{copy.pageSubtitle}</p>
        </div>

        {finalIpType && (
          <span className="text-md rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-700">
            Selected protection:{" "}
            <span className="font-bold capitalize">
              {ipTypeToTitle(finalIpType)}
            </span>
          </span>
        )}
      </header>

      <main className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mt-2">
            <p className="text-xl font-medium text-slate-900">
              {copy.startPromptTitle}
            </p>
            <p className="text-lg text-slate-500">
              {copy.startPromptDescription}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={goToWizardMode}
              className={clsx(
                "rounded-lg border px-3 py-3 text-left transition",
                mode === "wizard"
                  ? "border-sky-500 bg-sky-50 text-sky-900"
                  : "border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50",
              )}
            >
              <span className="mt-1 block text-xl font-semibold">
                {copy.wizardCardTitle}
              </span>
              <span className="mt-2 block text-lg/snug text-slate-600">
                {copy.wizardCardDescription}
              </span>
            </button>

            <button
              type="button"
              onClick={goToDirectMode}
              className={clsx(
                "rounded-lg border px-3 py-3 text-left transition",
                mode === "direct"
                  ? "border-sky-500 bg-sky-50 text-sky-900"
                  : "border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50",
              )}
            >
              <span className="mt-1 block text-lg/tight font-semibold">
                {copy.directCardTitle}
              </span>
              <span className="mt-2 block text-lg/snug text-slate-600">
                {copy.directCardDescription}
              </span>
            </button>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-2">
            {mode === "wizard" && !finalIpType && (
              <ClassificationWizard
                onFinished={handleWizardFinished}
                resetResult={setWizardResult}
              />
            )}

            {mode === "direct" && !finalIpType && (
              <DirectMenu
                setSelectedFormId={setSelectedFormId}
                title={copy.directMenuTitle}
                description={copy.directMenuDescription}
              />
            )}

            {mode === "undecided" && (
              <p className="text-md text-slate-400">
                Choose one of the options above to continue.
              </p>
            )}
          </div>
        </section>

        {finalIpType && (
          <DisclosureFormActions
            title={details.title}
            description={details.description}
            finalIpType={finalIpType}
            canProceed={canProceed}
            onProceed={handleProceed}
            proceedLabel={copy.proceedLabel}
            proceedHint={copy.proceedHint}
          />
        )}
      </main>
    </div>
  );
}

interface DirectMenuProps {
  setSelectedFormId: (formId: string) => void;
  title: string;
  description: string;
}

function DirectMenu(props: DirectMenuProps) {
  const { setSelectedFormId, title, description } = props;
  const [selectedForm, setSelectedForm] = useState<string>("");

  return (
    <div className="p-2">
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      <p className="text-md text-slate-500">{description}</p>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {DISCLOSURE_FORMS.map((form) => {
          const isSelected = selectedForm === form.id;

          return (
            <button
              key={form.id}
              type="button"
              onClick={() => setSelectedForm(form.id)}
              className={clsx(
                "h-full rounded-lg border px-3 py-3 text-left transition",
                isSelected
                  ? "border-sky-500 bg-sky-50 text-sky-900"
                  : "border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50",
              )}
            >
              <span className="block font-bold">{form.label}</span>
              <span className="block text-base/snug text-slate-600">
                {form.shortDescription}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setSelectedFormId(selectedForm)}
          disabled={!selectedForm}
          className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
