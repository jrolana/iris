"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AttachmentType, InventorType } from "@/lib/types/application";
import { IpType } from "@/lib/types/ip";
import useAddInventorsModal from "@/hooks/useAddInventorModal";
import { useCreateApplication } from "@/hooks/applications/useCreateApplication";
import { useUploadFile } from "@/hooks/attachments/useUploadFile";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileUploader from "@/components/common/FileUploader";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hint from "@/components/common/Tooltip";

type extendedAttachmentType = AttachmentType["Insert"] & {
  fileObject?: File;
};
export default function StartApplicationPage() {
  const router = useRouter();
  const {
    inventorDetails,
    openModal: addInventorModal,
    isOpen,
  } = useAddInventorsModal();
  const searchParams = useSearchParams();
  const ipTypeParam = searchParams.get("ipType");
  const { isLoading: isCreatingApp, createApp } = useCreateApplication();
  const { isLoading: isUploadingFiles, uploadFile } = useUploadFile();
  const [fileItems, setFileItems] = useState<extendedAttachmentType[]>([]);
  const [inventors, setInventors] = useState<InventorType["Insert"][]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [fundingSource, setFundingSource] = useState("");

  function handleBack() {
    router.back();
  }

  function removeInventor(index: number) {
    setInventors((prev) => prev.filter((_, i) => i !== index));
  }

  function addInventor() {
    addInventorModal();
  }

  async function handleSubmit() {
    if (projectTitle.trim() === "") return;

    const appId = await createApp(
      {
        applicationData: {
          project_title: projectTitle,
          ip_type: ipTypeParam as IpType,
          funding_source: fundingSource,
        },
        inventorsData: inventors,
      },
      {
        onSuccess: () => {
          console.log("Application created successfully.");
        },
        onError: (error) => {
          console.error("Error creating application:", error);
        },
        onSettled: () => {
          console.log("Create application mutation settled.");
        },
      },
    );
    await handleUpload(appId, fileItems);
    router.push(`/admin/view-application?applicationID=${appId}`);
  }

  async function handleUpload(
    appId: string,
    fileItems: extendedAttachmentType[],
  ) {
    for (const item of fileItems) {
      await uploadFile(
        { file: item, appId },
        {
          onSuccess: () => handleSuccess(item),
          onError: (error: unknown) => handleError(item, error),
          onSettled: handleSettled,
        },
      );
    }
  }

  function handleSuccess(item: extendedAttachmentType) {
    console.log(`Uploaded: ${item.file_name}`);
  }

  function handleError(item: extendedAttachmentType, error: unknown) {
    console.log(
      "Something went wrong with",
      item,
      "error: ",
      (error as Error).message,
    );
  }

  function handleSettled() {
    setFileItems((prev) => {
      const remainingItems = prev.filter((file, index) => index !== 0);
      return remainingItems;
    });
  }

  useEffect(() => {
    if (inventorDetails === null) return;
    setInventors((prev) => [...prev, inventorDetails]);
  }, [inventorDetails, isOpen]);

  // TODO: Add proper loading state
  if (isCreatingApp) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-lg font-medium">Creating application...</span>
      </div>
    );
  }

  if (isUploadingFiles) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-lg font-medium">Uploading files...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
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
        <header>
          <h1 className="mb-4 px-12 text-3xl font-semibold">
            Fill-up application details
          </h1>
        </header>
        <div>
          <h2 className="text-2xl font-medium">A. Information Details</h2>
          <p className="mt-1 text-lg text-slate-500">
            Provide the title of the IP application (i.e., the invention,
            research title, or copyright) and the research/project title, if
            applicable. If there is a funding source for this IP, please
            indicate it as well.
          </p>
        </div>
        <span className="text-lg font-medium">Research/Project title</span>
        <Input
          placeholder="e.g., A study on the effectiveness of IRIS in managing intellectual property"
          className="mt-1 h-12 text-lg!"
          value={projectTitle}
          onChange={(e) => {
            setProjectTitle(e.target.value);
          }}
        />
        <span className="text-lg font-medium">Funding source (Optional)</span>
        <Input
          placeholder="e.g., Department of Science and Technology (DOST)"
          className="mt-1 h-12 text-lg!"
          value={fundingSource}
          onChange={(e) => {
            setFundingSource(e.target.value);
          }}
        />
        <div>
          <h2 className="text-2xl font-medium">B. Collaborators</h2>
          <p className="mt-1 text-lg text-slate-500">
            List all the collaborators for this application. Remember that you
            can no longer add or remove these names after submission.
          </p>
        </div>
        <ScrollArea className="h-[300px] rounded-md border p-2 pr-4">
          {inventors.length === 0 && (
            <div className="text-muted-foreground mt-28 flex h-full w-full items-center justify-center text-center text-lg">
              No inventors or collaborators added yet.
            </div>
          )}
          {inventors.map((inventor, index) => (
            <div
              key={index + inventor.full_name}
              className="bg-card text-card-foreground mb-2 flex flex-col gap-2 rounded-lg border p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col items-start gap-1 overflow-hidden">
                  <span className="block truncate text-lg font-medium">
                    {inventor.full_name}
                  </span>
                  <div className="text-muted-foreground text-md block max-w-48 truncate">
                    {inventor.email}
                  </div>
                  <Hint
                    label={
                      inventor.college === "Other"
                        ? inventor.external_institution!
                        : inventor.college
                    }
                  >
                    <span className="block max-w-32 truncate rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700 uppercase">
                      {inventor.college === "Other"
                        ? inventor.external_institution
                        : inventor.college}
                    </span>
                  </Hint>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                  onClick={() => removeInventor(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
        <button
          type="button"
          onClick={addInventor}
          className="h-10 w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          List an inventor or collaborator
        </button>

        <div>
          <h2 className="text-2xl font-medium">C. Relevant attachments</h2>
          <p className="mt-1 text-lg text-slate-500">
            <span className="block">
              Please attach only <b>one (1) PDF file</b> containing the
              following information:
            </span>
            <span className="mt-2 block">
              (1) The appropriate disclosure form
              <br />
              (2) Any relevant supporting documents (e.g., research paper,
              prototype design, copyright material, images, figures, etc.)
            </span>
            <span className="mt-2 block">
              Compile or merge into <b>one (1) PDF file</b> and upload here.
            </span>
          </p>
        </div>
        <div className="flex w-full justify-center p-4">
          <FileUploader
            items={fileItems}
            setItems={setFileItems}
            maxFileCount={1}
            acceptedFileTypes={{
              "application/pdf": [".pdf"],
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={projectTitle.trim() === ""}
          className="h-10 w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
