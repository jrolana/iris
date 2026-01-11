"use client";
import { useEffect } from "react";
import useFilesUploadModal from "@/hooks/useFilesUploadModal";

import Modal from "./Modal";
import SmartFileUploader from "./SmartFileUploader";

function UploadFilesModal() {
  const { isOpen, closeModal } = useFilesUploadModal();

  // Reset form whenever modal opens or values change
  useEffect(() => {
    if (isOpen) {
      console.log("opened");
    }
  }, [isOpen]);

  function handleChange() {
    closeModal();
  }

  // Inside your page component
  async function handleUpload(fileItems: any[]) {
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
        <SmartFileUploader onClose={closeModal} onUpload={handleUpload} />
      </div>
    </Modal>
  );
}

export default UploadFilesModal;
