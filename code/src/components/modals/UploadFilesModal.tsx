"use client";
import { useEffect } from "react";
import Modal from "./Modal";
import useFilesUploadModal from "@/hooks/useFilesUploadModal";

function UploadFilesModal() {
  const { isOpen, closeModal } = useFilesUploadModal();

  // Reset form whenever modal opens or values change
  useEffect(() => {
    if (isOpen) {
      console.log("opened");
    }
  }, [isOpen]);

  function onConfirm() {
    console.log("confirmed");
    closeModal();
  }

  function handleChange() {
    closeModal();
  }

  return (
    <Modal
      title="Update status &amp; notify record"
      description=""
      isOpen={isOpen}
      onChange={handleChange}
    >
      <div className="w-full max-w-lg">
        <p>File upload modal content goes here.</p>
        <button onClick={onConfirm}>Submit</button>
      </div>
    </Modal>
  );
}

export default UploadFilesModal;
