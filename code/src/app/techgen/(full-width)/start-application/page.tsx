"use client";

import { useState } from "react";
import { AttachmentType } from "@/lib/types/application";

import { ScrollArea } from "@/components/ui/scroll-area";
import FileUploader from "@/components/common/FileUploader";

export default function StartApplicationPage() {
  const [formItems, setFormItems] = useState<AttachmentType[]>([]);
  const [inventors, setInventors] = useState<string[]>([]);
  return (
    <div className="flex justify-center bg-red-50">
      <div className="relative mx-auto max-w-6xl space-y-6 px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">Start Application</h1>
        {inventors.length > 0 && <ScrollArea></ScrollArea>}
        <button
          type="button"
          onClick={() => {
            setInventors((prev) => [...prev, ""]);
          }}
          className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          List an inventor/collaborator
        </button>
        <div className="w-full sm:min-w-md md:w-2xl">
          <FileUploader items={formItems} setItems={setFormItems} />
        </div>
      </div>
    </div>
  );
}
