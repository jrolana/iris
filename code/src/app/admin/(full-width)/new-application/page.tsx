"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IpType } from "@/lib/types/ip";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { WizardResult } from "@/lib/structs/classification";
import clsx from "clsx";

import ClassificationWizard from "@/components/application/Wizard";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import useFilesUploadModal from "@/hooks/useFilesUploadModal";

type Mode = "undecided" | "wizard" | "direct";

type DisclosureFormOption = {
  id: string;
  ipType: IpType;
  label: string;
  shortDescription: string;
  detail: string;
};

const DISCLOSURE_FORMS: DisclosureFormOption[] = [
  {
    id: "patent",
    ipType: "patent",
    label: "Patent",
    shortDescription: "New and inventive technical solutions to a problem.",
    detail:
      "Patents generally cover novel and inventive products, compositions, or processes that solve a technical problem. Protection is strong but requires rigorous examination and prior art search.",
  },
  {
    id: "utility_model",
    ipType: "utility_model",
    label: "Utility Model",
    shortDescription: "Improvements or new forms of existing technology.",
    detail:
      "Utility Models are often used for incremental technical improvements or new forms of known devices or products. Examination is lighter compared to patents but still requires registrability.",
  },
  {
    id: "industrial_design",
    ipType: "industrial_design",
    label: "Industrial Design",
    shortDescription: "Appearance, shape, or ornamental design of a product.",
    detail:
      "Industrial Design protects the visual or aesthetic features of a product—its shape, configuration, pattern, or ornamentation—rather than its technical function.",
  },
  {
    id: "trademark",
    ipType: "trademark",
    label: "Trademark",
    shortDescription: "Logos, names, or symbols identifying a brand.",
    detail:
      "Trademarks protect words, names, logos, or symbols that distinguish goods or services. They are especially important when branding technologies, spin-offs, or extension programs.",
  },
  {
    id: "copyright",
    ipType: "copyright",
    label: "Copyright",
    shortDescription: "Written, visual, audio, or software works.",
    detail:
      "Copyright covers literary, artistic, and scholarly works, including modules, manuals, videos, software code, and other creative outputs. It focuses on expression, not ideas.",
  },
];

function NewApplicationPage() {
  const router = useRouter();

  const { openModal } = useFilesUploadModal();
  const [mode, setMode] = useState<Mode>("undecided");
  const [wizardResult, setWizardResult] = useState<WizardResult | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  // When wizard finishes, we treat its recommendation as the selected form
  const handleWizardFinished = (result: WizardResult) => {
    setWizardResult(result);
    setSelectedFormId(null); // clear manual pick if any
    setMode("wizard");
  };

  const selectedForm =
    mode === "direct" && selectedFormId
      ? (DISCLOSURE_FORMS.find((f) => f.id === selectedFormId) ?? null)
      : null;

  const finalIpType: IpType | null =
    wizardResult?.ipType ?? selectedForm?.ipType ?? null;

  const canProceed = finalIpType !== null;

  function handleProceed() {
    if (!finalIpType) return;
    router.push(`/admin/start-application?ipType=${finalIpType}`);
  }

  function handleSubmissionModal() {
    // Open a submission modal here for the disclosure form
    setWizardResult(null); //added this just to remove the squiggly hehe, should remove when logic is implemented
    openModal();
  }

  // Side details, now used for the stacked info card
  let sideDetailsTitle = "Form details";
  let sideDetailsBody =
    "Select an option or complete the guide to see more details about the recommended disclosure form.";
  let sideDetailsSelectedLabel: string | null = null;

  if (mode === "wizard" && wizardResult) {
    sideDetailsTitle = wizardResult.formName;
    sideDetailsSelectedLabel = wizardResult.formName;
    sideDetailsBody = wizardResult.summary;
  } else if (mode === "direct" && selectedForm) {
    sideDetailsTitle = selectedForm.label;
    sideDetailsSelectedLabel = selectedForm.label;
    sideDetailsBody = selectedForm.detail;
  }

  function handleBack() {
    router.back();
  }

  useEffect(() => {
    toast.info("How this works", {
      description:
        "IRIS will help you choose a starting disclosure form. " +
        "You can either answer a few quick questions or directly pick the form agreed upon with TTBDO. " +
        "You can still change things later during the review.",
      descriptionClassName: "!text-slate-500",
    });
  }, []);

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 px-4 py-8">
      {/* Back button positioned near the header without shifting it */}
      <button
        type="button"
        onClick={handleBack}
        aria-label="Return to previous page"
        className="absolute top-8 left-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none"
      >
        <ArrowLeft size={18} className="text-slate-700" />
      </button>

      {/* Page header */}
      <header className="flex flex-col items-start justify-between gap-4 pl-12 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-semibold">New IP Application</h1>
          <p className="mt-1 text-lg text-slate-500">
            Start a disclosure for your research output and track its progress
            with TTBDO.
          </p>
        </div>
        {finalIpType && (
          <span className="text-md rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-700">
            {"Selected protection: "}
            <span className="font-bold capitalize">
              {ipTypeToTitle(finalIpType)}
            </span>
          </span>
        )}
      </header>

      <main className="space-y-4">
        {/* Wizard section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          {/* Initial choice: guided vs direct */}
          <div className="mt-2">
            <p className="text-xl font-medium text-slate-900">
              How would you like to start?
            </p>
            <p className="text-lg text-slate-500">
              You can let IRIS recommend a form or choose it yourself if you
              already know the protection you want.
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setMode("wizard");
                setWizardResult(null);
              }}
              className={clsx(
                "rounded-lg border px-3 py-3 text-left text-sm transition",
                mode === "wizard"
                  ? "border-sky-500 bg-sky-50 text-sky-900"
                  : "border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50",
              )}
            >
              <span className="mt-1 block text-xl font-semibold">
                Yes, guide me through it
              </span>
              <span className="mt-2 block text-lg/snug text-slate-600">
                IRIS will ask a few short questions and suggest the most
                suitable disclosure form for your work.
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("direct");
                setWizardResult(null);
              }}
              className={clsx(
                "rounded-lg border px-3 py-3 text-left text-sm transition",
                mode === "direct"
                  ? "border-sky-500 bg-sky-50 text-sky-900"
                  : "border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50",
              )}
            >
              <span className="mt-1 block text-lg/tight font-semibold">
                No, I already know what to choose
              </span>
              <span className="mt-2 block text-lg/snug text-slate-600">
                Select the disclosure form directly (for example, after a
                consultation with TTBDO).
              </span>
            </button>
          </div>

          {/* Wizard / direct selection area */}

          <div className="mt-4 border-t border-slate-100 pt-2">
            {mode === "wizard" && !finalIpType && (
              <ClassificationWizard
                onFinished={handleWizardFinished}
                resetResult={setWizardResult}
              />
            )}

            {mode === "direct" && !finalIpType && (
              <DirectMenu setSelectedFormId={setSelectedFormId} />
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
            title={sideDetailsTitle}
            nodeLabel={sideDetailsSelectedLabel}
            nodeBody={sideDetailsBody}
            handleSubmissionModal={handleSubmissionModal}
            handleProceed={handleProceed}
            canProceed={canProceed}
            finalIpType={finalIpType}
          />
        )}
      </main>
    </div>
  );
}

export default NewApplicationPage;

interface DisclosureFormActionsProps {
  title: string;
  nodeLabel: string | null;
  nodeBody: string;
  handleSubmissionModal: () => void;
  handleProceed: () => void;
  canProceed: boolean;
  finalIpType: IpType | null;
}

interface DirectMenuProps {
  setSelectedFormId: (formId: string) => void;
}

function DirectMenu(props: DirectMenuProps) {
  const { setSelectedFormId } = props;
  const [selectedIpType, setSelectedIpType] = useState<string>("");

  function handleSelect(ipType: string) {
    setSelectedIpType(ipType);
  }
  return (
    <div className="p-2">
      <h3 className="text-lg font-medium text-slate-900">
        Choose the disclosure form to use
      </h3>
      <p className="text-md text-slate-500">
        These are the standard forms used by TTBDO for different types of
        protection.
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {DISCLOSURE_FORMS.map((form) => {
          const isSelected = selectedIpType == form.id;
          return (
            <button
              key={form.id}
              type="button"
              onClick={() => handleSelect(form.id)}
              className={clsx(
                "text-md h-full rounded-lg border px-3 py-3 text-left transition",
                isSelected
                  ? "border-sky-500 bg-sky-50 text-sky-900"
                  : "border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50",
              )}
            >
              <span className="block font-bold">{form.label}</span>
              <span className="text-md/snug block text-slate-600">
                {form.shortDescription}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setSelectedFormId(selectedIpType)}
          className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-200"
          disabled={!selectedIpType}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function DisclosureFormActions(props: DisclosureFormActionsProps) {
  const {
    title,
    nodeLabel,
    nodeBody,
    handleSubmissionModal,
    handleProceed,
    canProceed,
    finalIpType,
  } = props;
  return (
    <>
      {/* Stacked info / actions section (formerly side panels) */}
      <section className="space-y-4">
        {/* Form deets and actions */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          {nodeLabel ? (
            <p className="mt-2 text-lg/snug text-slate-700">{nodeBody}</p>
          ) : (
            <p className="mt-2 text-lg/snug text-slate-600">
              Select a disclosure form (or complete the guide) to see specific
              guidance, notes, and reminders here.
            </p>
          )}

          <div className="mt-4 flex-row items-center justify-between">
            <button
              type="button"
              // open submission bin here
              onClick={handleSubmissionModal}
              disabled={!canProceed}
              className="text-md w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {finalIpType
                ? `Download ${ipTypeToTitle(finalIpType)} Disclosure Form`
                : "Download Disclosure Form"}
            </button>
            <p className="mt-2 text-xs/tight text-gray-500">
              Download the recommended disclosure form and fill up the necessary
              details. Please do not forget to include your e-signatures.
            </p>
          </div>

          <div className="mt-4 flex-row items-center justify-between">
            <button
              type="button"
              onClick={handleProceed}
              disabled={!canProceed}
              className="text-md w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Proceed to application
            </button>
            <p className="mt-2 text-xs/tight text-gray-500">
              When you&apos;re ready, proceed to create the application. TTBDO
              can still adjust the classification and status after their review.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
