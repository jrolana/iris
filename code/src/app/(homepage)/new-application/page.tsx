'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IpType } from '@/lib/types/ip';
import { ipTypeToTitle } from '@/lib/helper/get-ip-title';
import { WizardResult } from '@/lib/structs/classification';
import clsx from 'clsx';

import ClassificationWizard  from '@/components/application/Wizard';

type Mode = 'undecided' | 'wizard' | 'direct';

type DisclosureFormOption = {
  id: string;
  ipType: IpType;
  label: string;
  shortDescription: string;
  detail: string;
};

const DISCLOSURE_FORMS: DisclosureFormOption[] = [
  {
    id: 'patent',
    ipType: 'patent',
    label: 'Patent',
    shortDescription: 'New and inventive technical solutions to a problem.',
    detail:
      'Patents generally cover novel and inventive products, compositions, or processes that solve a technical problem. Protection is strong but requires rigorous examination and prior art search.',
  },
  {
    id: 'utility_model',
    ipType: 'utility_model',
    label: 'Utility Model',
    shortDescription: 'Improvements or new forms of existing technology.',
    detail:
      'Utility Models are often used for incremental technical improvements or new forms of known devices or products. Examination is lighter compared to patents but still requires registrability.',
  },
  {
    id: 'industrial_design',
    ipType: 'industrial_design',
    label: 'Industrial Design',
    shortDescription: 'Appearance, shape, or ornamental design of a product.',
    detail:
      'Industrial Design protects the visual or aesthetic features of a product—its shape, configuration, pattern, or ornamentation—rather than its technical function.',
  },
  {
    id: 'trademark',
    ipType: 'trademark',
    label: 'Trademark',
    shortDescription: 'Logos, names, or symbols identifying a brand.',
    detail:
      'Trademarks protect words, names, logos, or symbols that distinguish goods or services. They are especially important when branding technologies, spin-offs, or extension programs.',
  },
  {
    id: 'copyright',
    ipType: 'copyright',
    label: 'Copyright',
    shortDescription: 'Written, visual, audio, or software works.',
    detail:
      'Copyright covers literary, artistic, and scholarly works, including modules, manuals, videos, software code, and other creative outputs. It focuses on expression, not ideas.',
  },
];

function NewApplicationPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('undecided');
  const [wizardResult, setWizardResult] = useState<WizardResult | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [idfFile, setidfFile] = useState<string>()

  // When wizard finishes, we treat its recommendation as the selected form
  const handleWizardFinished = (result: WizardResult) => {
    setWizardResult(result);
    setSelectedFormId(null); // clear manual pick if any
    setMode('wizard');
  };


  const selectedForm =
    mode === 'direct' && selectedFormId
      ? DISCLOSURE_FORMS.find((f) => f.id === selectedFormId) ?? null
      : null;

  const finalIpType: IpType | null =
    wizardResult?.ipType ?? selectedForm?.ipType ?? null;

  const canProceed = finalIpType !== null;

  function handleProceed(){
    if (!finalIpType) return;
    // TODO
    // Open modal for submission of file
    //
    setidfFile("should set to file to be uploaded to supabase")
    console.log(idfFile);
    
    // Supabase insert into ipr_applications with:
    // * type_of_ip = finalIpType
    // * current_status_type = 'draft_idf'
    // * original_type_of_ip = finalIpType
    // should return the uuid of the new row

    // Supabase insert into ipr_files with:
    // * ipr_id = application uuid
    // 

    // Then redirect with the new application_id (return from db)

    // For now we just navigate to the view page placeholder
    // add url params of application_id (from there, derive IpType and StatusType) 
    router.push('/view-application');
  };

  function handleSubmissionModal(){
    // Open a submission modal here for the disclosure form
    setWizardResult(null); //added this just to remove the squiggly hehe, should remove when logic is implemented
    console.log("open the modal here");
    
  }

  // Side panel deets, changeable based on selected options
  let sideDetailsTitle = 'Form details';
  let sideDetailsBody =
    'Select an option or complete the guide to see more details about the recommended disclosure form.';
  let sideDetailsSelectedLabel: string | null = null;

  if (mode === 'wizard' && wizardResult) {
    sideDetailsTitle = wizardResult.formName;
    sideDetailsSelectedLabel = wizardResult.formName;
    sideDetailsBody = wizardResult.summary;
  } else if (mode === 'direct' && selectedForm) {
    sideDetailsTitle = selectedForm.label;
    sideDetailsSelectedLabel = selectedForm.label;
    sideDetailsBody = selectedForm.detail;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">
            New IP Application
          </h1>
          <p className="mt-1 text-lg text-slate-500">
            Start a disclosure for your research output and track its progress
            with TTBDO.
          </p>
        </div>
        {finalIpType && (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-md font-medium text-sky-700">
            {"Selected protection: "}
            <span className="capitalize font-bold">
              {ipTypeToTitle(finalIpType)}
            </span>
          </span>
        )}
      </header>

      <main className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        {/* Wizard section*/}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Initial question */}
          <div className="mt-6">
            <p className="text-xl font-medium text-slate-900">
              Would you like help choosing the proper disclosure form?
            </p>
            <p className="text-lg text-slate-500">
              You can either follow a short guide or pick the form agreed upon
              with TTBDO.
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode('wizard')}
              className={
                clsx(
                    'rounded-lg border px-3 py-3 text-left text-sm transition',
                    mode === 'wizard' ? 'border-sky-500 bg-sky-50 text-sky-900': 'border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50',
                )
              }
            >
              <span className="mt-1 block font-semibold text-xl">
                Yes, guide me through it
              </span>
              <span className="mt-2 block text-lg/snug text-slate-600 ">
                IRIS will ask a few questions and suggest the most suitable
                disclosure form.
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('direct');
                setWizardResult(null);
              }}
              className={
                clsx(
                'rounded-lg border px-3 py-3 text-left text-sm transition',
                mode === 'direct' ? 'border-sky-500 bg-sky-50 text-sky-900' : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50',
                )}
            >
              <span className="mt-1 block font-semibold text-lg/tight">
                No, I already know what to choose
              </span>
              <span className="mt-2 block text-lg/snug text-slate-600">
                Select the disclosure form directly (for example, after a
                consultation with TTBDO).
              </span>
            </button>
          </div>

          {/* Wizard options */}
          <div className="mt-4 border-t border-slate-100 pt-2">
            {mode === 'wizard' && (
              <ClassificationWizard onFinished={handleWizardFinished} resetResult={setWizardResult}/>
            )}

            {mode === 'direct' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Choose the disclosure form to use
                </h3>
                <p className="text-md text-slate-500">
                  These are the standard forms used by TTBDO for different
                  types of protection.
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {DISCLOSURE_FORMS.map((form) => {
                    const isSelected = selectedFormId === form.id;
                    return (
                      <button
                        key={form.id}
                        type="button"
                        onClick={() => setSelectedFormId(form.id)}
                        className={clsx(
                          'h-full rounded-lg border px-3 py-3 text-left text-lg transition',
                          isSelected ? 'border-sky-500 bg-sky-50 text-sky-900' : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50',
                        )}
                      >
                        <span className="block font-semibold">
                          {form.label}
                        </span>
                        <span className="block text-md/snug text-slate-600">
                          {form.shortDescription}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === 'undecided' && (
              <p className="text-md text-slate-400">
                Choose one of the options above to continue.
              </p>
            )}
          </div>
        </section>

        {/* Information side section, similar to Trance*/}
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              What happens after this?
            </h2>
            {finalIpType ? (
              <p className="mt-2 text-xl text-slate-600">
                After you proceed, IRIS will start a new application using this
                form. TTBDO will review your submission, may refine the
                classification, and then guide you through prior art search,
                drafting, and filing with IPOPHL as appropriate for this
                protection type.
              </p>
            ) : (
              <p className="mt-2 text-lg/snug text-slate-600">
                Once you confirm a disclosure form, IRIS will create a new
                application record. You&apos;ll then be able to upload
                attachments, see TTBDO feedback, and track progress through each
                stage of the review and filing process.
              </p>
            )}
          </div>

          {/* More details about the options selected */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <h3 className="text-xl font-semibold text-slate-900">
              {sideDetailsTitle}
            </h3>
            {sideDetailsSelectedLabel ? (
              <p className="mt-2 text-lg/snug text-slate-700">{sideDetailsBody}</p>
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
                className="w-full text-center items-center rounded-md bg-sky-600 px-4 py-2 text-md font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                 {`Download ${ipTypeToTitle(finalIpType)} Disclosure Form`}
              </button>
              <p className="text-xs/tight text-gray-500 mt-2">
                Download the recommended disclosure form and fill up the necessary details. Please do not forget to include your e-signatures.
              </p>
            </div>

            <div className="mt-4 flex-row items-center justify-between">
              <button
                type="button"
                onClick={handleProceed}
                disabled={!canProceed}
                className="w-full text-center items-center rounded-md bg-sky-600 px-4 py-2 text-md font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Proceed to application
              </button>
              <p className="text-xs/tight text-gray-500 mt-2">
                When you&apos;re ready, proceed to create the application. TTBDO
                can still adjust the classification and status after their
                review.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NewApplicationPage;
