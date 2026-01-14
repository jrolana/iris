"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AttachmentType, InventorType } from "@/lib/types/application";
// import qs from "query-string"

import { ScrollArea } from "@/components/ui/scroll-area";
import FileUploader from "@/components/common/FileUploader";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAddInventorsModal from "@/hooks/useAddInventorModal";
import { Input } from "@/components/ui/input";

export default function StartApplicationPage() {
  const router = useRouter();
  const { inventorDetails, openModal, isOpen } = useAddInventorsModal();
  const [formItems, setFormItems] = useState<AttachmentType[]>([]);
  const [inventors, setInventors] = useState<InventorType[]>([]);
  const [appTitle, setAppTitle] = useState("");
  const [projectTitle, setProjectTitle] = useState("");

  function handleBack() {
    router.back();
  }

  function removeInventor(index: number) {
    setInventors((prev) => prev.filter((_, i) => i !== index));
  }

  function addInventor() {
    openModal();
  }

  function handleSubmit() {
    if (appTitle.trim() === "") return;
    // TODO:
    // Implement submission logic here
    // DB saving, form validation, etc.
    console.log("submit application");
    router.push("/techgen/view-application?applicationID=12345");
  }

  useEffect(() => {
    if (inventorDetails === null) return;
    setInventors((prev) => [...prev, inventorDetails]);
  }, [inventorDetails, isOpen]);

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
          <h2 className="text-2xl font-medium">A. Titles</h2>
          <p className="mt-1 max-w-2xl text-lg text-slate-500">
            Provide the title of the subject of the application (i.e., the
            invention, research title, or copyright) and the project title as
            well, if applicable.
          </p>
        </div>
        <span className="text-lg font-medium">Application title</span>
        <Input
          placeholder="e.g., IRIS: A Management Information System for Intellectual Property"
          className="mt-1 h-12 text-lg!"
          value={appTitle}
          onChange={(e) => {
            setAppTitle(e.target.value);
          }}
          required
        />
        <span className="text-lg font-medium">Project title</span>
        <Input
          placeholder="(Optional)"
          className="mt-1 h-12 text-lg!"
          value={projectTitle}
          onChange={(e) => {
            setProjectTitle(e.target.value);
          }}
        />
        <div>
          <h2 className="text-2xl font-medium">B. Collaborators</h2>
          <p className="mt-1 max-w-2xl text-lg text-slate-500">
            List all the collaborators for this application. You are
            automatically listed as an inventor so exclude yourself from this
            list. Remember that you can no longer add or remove these names
            after submission.
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
                  <div className="text-muted-foreground text-md">
                    {inventor.email}
                  </div>
                  <span className="text-muted-foreground mt-1 flex items-center gap-1 text-sm font-medium">
                    <span className="rounded-md bg-slate-200 p-1 px-1.5 uppercase">
                      {inventor.college}
                    </span>
                  </span>
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
          <p className="mt-1 max-w-2xl text-lg text-slate-500">
            Upload necessary files or provide links that support your
            application.
          </p>
        </div>
        <div className="flex w-full justify-center p-4">
          <FileUploader items={formItems} setItems={setFormItems} />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={appTitle.trim() === ""}
          className="h-10 w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
