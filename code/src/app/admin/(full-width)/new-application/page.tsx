"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { IpType } from "@/lib/types/ip";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";
import { WizardResult } from "@/lib/structs/classification";

import ClassificationWizard from "@/components/application/Wizard";
import { useGetUrlByStoragePath } from "@/hooks/attachments/useGenerateUrlByStoragePath";

type Mode = "undecided" | "wizard" | "direct";
type FileAction = "view" | "download";

type DisclosureFormOption = {
  id: string;
  ipType: IpType;
  label: string;
  shortDescription: string;
  detail: string;
};

type DownloadableForm = {
  id: string;
  label: string;
  description: string;
  fileName: string;
  storagePath: string;
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

/**
 * Replace these storagePath values with the real paths in your storage bucket.
 * Example only:
 * - "forms/patent/patent-disclosure-form.pdf"
 * - "forms/common/authorization-form.pdf"
 */
const DISCLOSURE_FORM_FILES: Record<IpType, DownloadableForm[]> = {
  patent: [
    {
      id: "patent-disclosure-form",
      label: "Patent Disclosure Form",
      description:
        "Primary disclosure form for inventions involving novel technical solutions.",
      fileName: "Patent Disclosure Form.pdf",
      storagePath: "forms/patent/patent-disclosure-form.pdf",
    },
    {
      id: "patent-checklist",
      label: "Patent Supporting Checklist",
      description:
        "Checklist for inventor details and required supporting information.",
      fileName: "Patent Supporting Checklist.pdf",
      storagePath: "forms/patent/patent-supporting-checklist.pdf",
    },
  ],
  utility_model: [
    {
      id: "utility-model-disclosure-form",
      label: "Utility Model Disclosure Form",
      description:
        "Primary disclosure form for utility model submissions.",
      fileName: "Utility Model Disclosure Form.pdf",
      storagePath: "forms/utility-model/utility-model-disclosure-form.pdf",
    },
  ],
  industrial_design: [
    {
      id: "industrial-design-disclosure-form",
      label: "Industrial Design Disclosure Form",
      description:
        "Disclosure form for the appearance and ornamental aspects of a product.",
      fileName: "Industrial Design Disclosure Form.pdf",
      storagePath:
        "forms/industrial-design/industrial-design-disclosure-form.pdf",
    },
  ],
  trademark: [
    {
      id: "trademark-disclosure-form",
      label: "Trademark Disclosure Form",
      description:
        "Disclosure form for names, logos, and other distinctive marks.",
      fileName: "Trademark Disclosure Form.pdf",
      storagePath: "forms/trademark/trademark-disclosure-form.pdf",
    },
  ],
  copyright: [
    {
      id: "copyright-disclosure-form",
      label: "Copyright Disclosure Form",
      description:
        "Disclosure form for creative, literary, artistic, and software works.",
      fileName: "Copyright Disclosure Form.pdf",
      storagePath: "forms/copyright/copyright-disclosure-form.pdf",
    },
  ],
};

function NewApplicationPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("undecided");
  const [wizardResult, setWizardResult] = useState<WizardResult | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  function handleWizardFinished(result: WizardResult) {
    setWizardResult(result);
    setSelectedFormId(null);
    setMode("wizard");
  }

  const selectedForm =
    mode === "direct" && selectedFormId
      ? (DISCLOSURE_FORMS.find((form) => form.id === selectedFormId) ?? null)
      : null;

  const finalIpType: IpType | null =
    wizardResult?.ipType ?? selectedForm?.ipType ?? null;

  const canProceed = finalIpType !== null;

  function handleProceed() {
    if (!finalIpType) return;
    router.push(`/admin/start-application?ipType=${finalIpType}`);
  }

  function handleBack() {
    router.back();
  }

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

  useEffect(() => {
    toast.info("How this works", {
      description:
        "IRIS will help you choose a starting disclosure form. You can either answer a few quick questions or directly pick the form agreed upon with TTBDO. You can still change things later during the review.",
      descriptionClassName: "!text-slate-500",
    });
  }, []);

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
            New IP Application
          </h1>
          <p className="mt-1 text-lg text-slate-500">
            Start a disclosure for your research output and track its progress
            with TTBDO.
          </p>
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
                "rounded-lg border px-3 py-3 text-left transition",
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
                "rounded-lg border px-3 py-3 text-left transition",
                mode === "direct"
                  ? "border-sky-500 bg-sky-50 text-sky-900"
                  : "border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50",
              )}
            >
              <span className="mt-1 block text-lg/tight font-semibold">
                No, I already know what to choose
              </span>
              <span className="mt-2 block text-lg/snug text-slate-600">
                Select the disclosure form directly, for example after
                consultation with TTBDO.
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
          const isSelected = selectedIpType === form.id;

          return (
            <button
              key={form.id}
              type="button"
              onClick={() => handleSelect(form.id)}
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

interface DisclosureFormActionsProps {
  title: string;
  nodeLabel: string | null;
  nodeBody: string;
  handleProceed: () => void;
  canProceed: boolean;
  finalIpType: IpType | null;
}

function DisclosureFormActions(props: DisclosureFormActionsProps) {
  const { title, nodeLabel, nodeBody, handleProceed, canProceed, finalIpType } =
    props;

  const { fetchUrl } = useGetUrlByStoragePath();
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  const forms = finalIpType ? DISCLOSURE_FORM_FILES[finalIpType] ?? [] : [];

  async function handleFileAction(
    form: DownloadableForm,
    action: FileAction,
  ) {
    const actionKey = `${form.id}-${action}`;
    setActiveActionKey(actionKey);

    try {
      const fileUrl = await fetchUrl({
        storagePath: form.storagePath,
        fileName: form.fileName,
        action,
      });

      if (!fileUrl) {
        toast.error("Unable to access file", {
          description:
            "The file URL could not be generated. Please check the configured storage path.",
        });
        return;
      }

      if (action === "view") {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const anchor = document.createElement("a");
      anchor.href = fileUrl;
      anchor.download = form.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      console.error(error);

      toast.error(
        action === "view" ? "Failed to open form" : "Failed to download form",
        {
          description:
            "Please check that the form exists in storage and that the file path is correct.",
        },
      );
    } finally {
      setActiveActionKey(null);
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>

        {nodeLabel ? (
          <p className="mt-2 text-lg/snug text-slate-700">{nodeBody}</p>
        ) : (
          <p className="mt-2 text-lg/snug text-slate-600">
            Select a disclosure form or complete the guide to see specific
            guidance, notes, and reminders here.
          </p>
        )}

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900">
            Forms to review
          </h4>

          {forms.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No forms are configured yet for this protection type.
            </p>
          ) : (
            <>
              <ul className="mt-3 divide-y divide-slate-100">
                {forms.map((form) => {
                  const isViewing = activeActionKey === `${form.id}-view`;
                  const isDownloading = activeActionKey === `${form.id}-download`;
                  const isBusy = isViewing || isDownloading || activeActionKey !== null;

                  return (
                    <li
                      key={form.id}
                      className="flex flex-col gap-3 py-3 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="rounded-lg bg-slate-100 p-2">
                          <FileText className="h-5 w-5 text-slate-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {form.label}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {form.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleFileAction(form, "view")}
                          disabled={isBusy}
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          {isViewing ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleFileAction(form, "download")}
                          disabled={isBusy}
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
                        >
                          {isDownloading ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Download size={16} />
                          )}
                          Download
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-3 text-xs/tight text-gray-500">
                Review the needed templates first, then proceed once you are
                ready to continue with the application.
              </p>
            </>
          )}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleProceed}
            disabled={!canProceed}
            className="w-full rounded-md bg-sky-600 px-4 py-2 text-center text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Proceed to application
          </button>
          <p className="mt-2 text-xs/tight text-gray-500">
            TTBDO can still adjust the classification and status after their
            review.
          </p>
        </div>
      </div>
    </section>
  );
}