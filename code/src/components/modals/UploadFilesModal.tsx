"use client";
import { useEffect, useState } from "react";
import { FileType } from "@/lib/types/file";
import useFilesUploadModal from "@/hooks/useFilesUploadModal";

import Modal from "./Modal";
import FileUploader from "../common/FileUploader";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog"; // could be removed

function UploadFilesModal() {
  const { isOpen, closeModal } = useFilesUploadModal();
  const [fileItems, setFileItems] = useState<FileType[]>([]);

  // Reset form whenever modal opens or values change
  useEffect(() => {
    if (isOpen) {
      console.log("opened");
    }
  }, [isOpen]);

  function handleChange() {
    closeModal();
  }

  async function handleUpload(fileItems: FileType[]) {
    console.log(fileItems);

    // Separate files and links

    // const filesToUpload = items.filter((i) => i.type === "file");
    // const linksToSave = items.filter((i) => i.type === "link");

    //  Upload files to Supabase Storage

    // for (const item of filesToUpload) {
    //   const { data, error } = await supabase.storage
    //     .from("attachments")
    //     .upload(`public/${item.name}`, item.fileObject);

    //   Save metadata (url, description, file_type) to your database table

    //   if (data) {
    //     await supabase.from("application_attachments").insert({
    //       file_url: data.path,
    //       file_type: item.fileType,
    //       description: item.description,
    //       is_link: false,
    //     });
    //   }
    // }

    // Save links directly to database

    // for (const link of linksToSave) {
    //   await supabase.from("application_attachments").insert({
    //     file_url: link.url,
    //     file_type: "Link",
    //     description: link.description,
    //     is_link: true,
    //   });
    //     }
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
            disabled={fileItems.length === 0}
          >
            Upload {fileItems.length} Item{fileItems.length !== 1 && "s"}
          </Button>
        </DialogFooter>
      </div>
    </Modal>
  );
}

export default UploadFilesModal;
