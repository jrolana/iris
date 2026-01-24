"use client";
import { useState } from "react";
import useFilesUploadModal from "@/hooks/useFilesUploadModal";

import Modal from "./Modal";
import FileUploader from "../common/FileUploader";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog"; // could be removed
import { AttachmentType } from "@/lib/types/application";
import { useSearchParams } from "next/navigation";
import { useUploadFile } from "@/hooks/attachments/useUploadFile";

type extendedAttachmentType = AttachmentType["Insert"] & {
  fileObject?: File;
};
function UploadFilesModal() {
  const { isOpen, closeModal } = useFilesUploadModal();
  const [fileItems, setFileItems] = useState<extendedAttachmentType[]>([]);
  const searchParams = useSearchParams();
  const appId = searchParams.get("applicationID") || "";

  const { isLoading, uploadFile } = useUploadFile();

  // Reset form whenever modal opens or values change
  // useEffect(() => {
  //   if (isOpen) {
  //     console.log("opened");
  //   }
  // }, [isOpen]);

  function handleChange() {
    closeModal();
  }

  async function handleUpload(fileItems: extendedAttachmentType[]) {
    console.log(fileItems);
    for (const item of fileItems) {
      await uploadFile({ file: item, appId });
    }
    closeModal();
  }

  return (
    <Modal
      title="Update status &amp; notify record"
      description=""
      isOpen={isOpen}
      onChange={handleChange}
    >
      <div className="w-full sm:min-w-md md:w-2xl">
        <FileUploader items={fileItems} setItems={setFileItems} />
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={() => handleUpload(fileItems)}
            disabled={fileItems.length === 0 || isLoading}
          >
            Upload {fileItems.length} Item{fileItems.length !== 1 && "s"}
          </Button>
        </DialogFooter>
      </div>
    </Modal>
  );
}

export default UploadFilesModal;
