"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AttachmentType, InventorType } from "@/lib/types/application";
import { IpType } from "@/lib/types/ip";
import { FUNDING_SOURCE_OPTIONS } from "@/lib/constants/funding-sources";
import useAddVerifiedInventorsModal from "@/hooks/useAddVerifiedInventorModal";
import { useCreateApplication } from "@/hooks/applications/useCreateApplication";
import { useUploadFile } from "@/hooks/attachments/useUploadFile";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atom-states/user";
import { useConfirm } from "@/hooks/useConfirm";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUploader from "@/components/common/FileUploader";
import { ArrowLeft, X, VerifiedIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hint from "@/components/common/Tooltip";
import { toast } from "sonner";

type ExtendedAttachmentType = AttachmentType["Insert"] & {
  fileObject?: File;
};

interface StartApplicationPageClientProps {
  ipType: IpType;
}

export default function StartApplicationPageClient({
  ipType,
}: StartApplicationPageClientProps) {
  const router = useRouter();
  const confirm = useConfirm();
  const { isLoading: isCreatingApp, createApp } = useCreateApplication();
  const { isLoading: isUploadingFiles, uploadFile } = useUploadFile();
  const {
    isOpen: isAddVerifiedInventorModalOpen,
    inventor,
    openModal: openAddVerifiedInventorModal,
    setExcludedUIDs,
  } = useAddVerifiedInventorsModal();
  const user = useAtomValue(userAtom);
  const [fileItems, setFileItems] = useState<ExtendedAttachmentType[]>([]);
  const [inventors, setInventors] = useState<InventorType["Insert"][]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [fundingSource, setFundingSource] = useState("");
  const [otherFundingSource, setOtherFundingSource] = useState("");
  const isOtherFundingSource = fundingSource === "Others";
  const resolvedFundingSource = isOtherFundingSource
    ? otherFundingSource.trim()
    : fundingSource.trim();

  function handleBack() {
    router.back();
  }

  function removeInventor(index: number, techgenId: string | undefined | null) {
    if (techgenId === user?.id) return;
    setInventors((prev) => prev.filter((_, i) => i !== index));
    if (techgenId) {
      setExcludedUIDs((prev) => prev.filter((id) => id !== techgenId));
    }
  }

  function addInventor() {
    openAddVerifiedInventorModal();
  }

  async function handleSubmit() {
    const isConfirmed = await confirm({
      title: "Confirm Submission",
      message:
        "Are you sure you want to submit this application? Please ensure that all details are correct before confirming.",
    });

    if (!isConfirmed) return;
    if (projectTitle.trim() === "" || resolvedFundingSource === "") return;

    toast.promise(createAndUpload(), {
      error: (e: Error) => {
        if (e.message.includes("inventors_application_id_email_key")) {
          return "Error: Duplicate email address. Please remove the duplicate collaborator and try again.";
        }
        return "Failed to create application. Please check the instructions and try again.";
      },
    });
  }

  async function createAndUpload() {
    const collaboratorInventors = inventors.filter(
      (inventorItem) => inventorItem.techgen_id !== user.id,
    );

    const appId = await createApp({
      applicationData: {
        project_title: projectTitle,
        ip_type: ipType,
        funding_source: resolvedFundingSource,
      },
      inventorsData: collaboratorInventors,
    });

    await handleUpload(appId, fileItems);
    router.push(`/techgen/view-application?applicationID=${appId}`);
  }

  async function handleUpload(
    appId: string,
    fileItems: ExtendedAttachmentType[],
  ) {
    for (const item of fileItems) {
      await uploadFile(
        { file: item, appId },
        {
          onSettled: handleSettled,
        },
      );
    }
  }

  function handleSettled() {
    setFileItems((prev) => {
      const remainingItems = prev.filter((_, index) => index !== 0);
      return remainingItems;
    });
  }

  useEffect(() => {
    if (inventor === null) return;

    setInventors((prev) => [...prev, inventor]);

    if (inventor.techgen_id !== undefined && inventor.techgen_id !== null) {
      setExcludedUIDs((prev) => [...prev, inventor.techgen_id as string]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventor, isAddVerifiedInventorModalOpen]);

  useEffect(() => {
    if (user === null || user === undefined) return;
    setInventors((prev) => {
      const hasCurrentUser = prev.some(
        (inventorItem) => inventorItem.techgen_id === user.id,
      );

      if (hasCurrentUser) return prev;

      return [
        {
          application_id: "",
          techgen_id: user.id,
          full_name: user.full_name,
          email: user.email,
          college_code: user.college_code,
          other_college_name: user.other_college_name,
          external_institution: user.external_institution,
          status: "member",
        },
        ...prev,
      ];
    });
    setExcludedUIDs((prev) =>
      prev.includes(user.id) ? prev : [...prev, user.id],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (user === null || user === undefined) {
    return (
      <div className="flex w-full flex-1 flex-row items-center justify-center gap-2">
        <span className="text-lg font-medium">Loading user information...</span>
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isCreatingApp) {
    return (
      <div className="flex w-full flex-1 flex-row items-center justify-center gap-2">
        <span className="text-lg font-medium">Creating application...</span>
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isUploadingFiles) {
    return (
      <div className="flex w-full flex-1 flex-row items-center justify-center gap-2">
        <span className="text-lg font-medium">Uploading files...</span>
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="relative mx-auto max-w-6xl space-y-6 px-4 py-8">
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
            Provide the title of your research or project. If there is a funding
            source for this IP, please indicate it here.
          </p>
        </div>

        <span className="text-lg font-medium">
          Research/Project title <span className="text-red-500">*</span>
        </span>
        <Input
          placeholder="e.g., A study on the effectiveness of IRIS in managing intellectual property"
          className="mt-1 h-12 text-lg!"
          value={projectTitle}
          onChange={(e) => {
            setProjectTitle(e.target.value);
          }}
        />

        <label className="flex w-full flex-col gap-1">
          <span className="text-lg font-medium">
            Funding source <span className="text-red-500">*</span>
          </span>
          <Select
            value={fundingSource}
            onValueChange={(value) => {
              setFundingSource(value);
              if (value !== "Others") {
                setOtherFundingSource("");
              }
            }}
          >
            <SelectTrigger className="mt-1 h-12 w-full text-left text-base sm:text-lg">
              <SelectValue placeholder="Select funding source" />
            </SelectTrigger>

            <SelectContent
              position="popper"
              side="bottom"
              className="z-9999 max-h-60 overflow-y-auto"
            >
              {FUNDING_SOURCE_OPTIONS.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="cursor-pointer"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {isOtherFundingSource && (
          <label className="flex w-full flex-col gap-1">
            <span className="text-lg font-medium">
              Other funding source <span className="text-red-500">*</span>
            </span>
            <Input
              placeholder="Type the funding source"
              className="mt-1 h-12 text-lg!"
              value={otherFundingSource}
              onChange={(e) => {
                setOtherFundingSource(e.target.value);
              }}
            />
          </label>
        )}

        <div>
          <h2 className="text-2xl font-medium">B. Collaborators</h2>
          <p className="mt-1 text-lg text-slate-500">
            List all the collaborators for this application.{" "}
            <b>You are automatically listed</b> as a technology generator so
            exclude yourself from this list. Remember that you can no longer add
            or remove these names after submission.
          </p>
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-2 pr-4">
          {inventors.length === 0 && (
            <div className="text-muted-foreground mt-28 flex h-full w-full items-center justify-center text-center text-lg">
              No technology generator collaborators added yet.
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

                  <div className="text-muted-foreground text-md">
                    {inventor.email}
                  </div>

                  <div className="flex flex-row items-center gap-2 align-middle text-sky-700">
                    <Hint
                      label={
                        inventor.external_institution ??
                        inventor.college_code ??
                        inventor.other_college_name ??
                        ""
                      }
                    >
                      <span className="block max-w-32 truncate rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700 uppercase">
                        {inventor.external_institution ??
                          inventor.college_code ??
                          inventor.other_college_name}
                      </span>
                    </Hint>

                    {inventor.techgen_id !== undefined &&
                      inventor.techgen_id !== null && (
                        <div className="flex flex-row items-center gap-2 px-2 align-middle text-sm font-medium text-sky-700">
                          {inventor.techgen_id === user.id ? "You" : "Verified"}
                          <VerifiedIcon size={20} />
                        </div>
                      )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                  onClick={() => removeInventor(index, inventor.techgen_id)}
                  disabled={inventor.techgen_id === user.id}
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
          List technology generator collaborators
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
          disabled={
            projectTitle.trim() === "" ||
            resolvedFundingSource === "" ||
            fileItems.length === 0
          }
          className="h-10 w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
