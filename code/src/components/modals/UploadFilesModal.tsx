"use client";
import { useState } from "react";
import useFilesUploadModal from "@/hooks/useFilesUploadModal";
import { toast } from "sonner";
import { AttachmentType } from "@/lib/types/application";
import { useSearchParams } from "next/navigation";
import { useUploadFile } from "@/hooks/attachments/useUploadFile";

import Modal from "./Modal";
import FileUploader from "../common/FileUploader";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog"; // could be removed

type extendedAttachmentType = AttachmentType["Insert"] & {
  fileObject?: File;
};
function UploadFilesModal() {
  const { isOpen, closeModal } = useFilesUploadModal();
  const [fileItems, setFileItems] = useState<extendedAttachmentType[]>([]);
  const searchParams = useSearchParams();
  const appId = searchParams.get("applicationID") || "";

  const { isLoading, uploadFile } = useUploadFile();

  function handleChange() {
    closeModal();
  }

  async function handleUpload(fileItems: extendedAttachmentType[]) {
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
    closeModal();
  }

  function handleSuccess(item: extendedAttachmentType) {
    toast.success(`Uploaded: ${item.file_name}`, { duration: 5000 });
  }

  function handleError(item: extendedAttachmentType, error: unknown) {
    toast.error(
      `Error uploading ${item.file_name}: ${(error as Error).message}`,
      {
        duration: 8000,
      },
    );
  }

  function handleSettled() {
    setFileItems((prev) => {
      const remainingItems = prev.filter((file, index) => index !== 0);
      return remainingItems;
    });
  }

  return (
    <Modal
      title="Update status &amp; notify record"
      description=""
      isOpen={isOpen}
      onChange={handleChange}
    >
      <div className="w-full sm:min-w-md md:w-2xl">
        <FileUploader
          items={fileItems}
          setItems={setFileItems}
          isLoading={isLoading}
        />
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={() => handleUpload(fileItems)}
            disabled={fileItems.length === 0 || isLoading}
            className="disabled:text-muted-foreground bg-sky-600 hover:bg-sky-600/50 disabled:bg-slate-200"
          >
            Upload {fileItems.length} Item{fileItems.length !== 1 && "s"}
          </Button>
        </DialogFooter>
      </div>
    </Modal>
  );
}

export default UploadFilesModal;
