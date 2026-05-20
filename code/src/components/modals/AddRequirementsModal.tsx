"use client";
import { useState } from "react";
import { useConfirm } from "@/hooks/useConfirm";
import useAddRequirementsModal from "@/hooks/useAddRequirementsModal";

import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog"; // could be removed
import { requirements } from "@/lib/constants/requirements";
import RequirementsChecklist from "../admin/RequirementsChecklist";

function AddRequirementsModal() {
  const {
    isOpen,
    closeModal,
    applicationId,
    accomplishedRequirements,
    ipType,
  } = useAddRequirementsModal();

  const ipRequirements =
    requirements[ipType as keyof typeof requirements] || [];
  const confirm = useConfirm();

  const [selectedRequirements, setSelectedRequirements] = useState<string[]>(
    [],
  );

  function handleChange() {
    closeModal();
  }

  async function handleAddRequirements() {
    const isConfirmed = await confirm({
      title: "Add Requirements",
      message: "Are you sure you want to add these requirements?",
    });

    if (!isConfirmed) {
      return;
    }

    console.log(
      "Adding requirements:",
      selectedRequirements,
      "to application ID:",
      applicationId,
    );
  }

  return (
    <Modal
      title="Add Requirements"
      description="Select the requirements you want to add to this application."
      isOpen={isOpen}
      onChange={handleChange}
    >
      <div className="flex w-full max-w-lg min-w-[85vw] flex-col sm:w-[80vh] sm:min-w-100">
        <RequirementsChecklist
          requirements={ipRequirements}
          setRequirements={setSelectedRequirements}
        />
        <DialogFooter className="mt-6">
          <Button
            onClick={() => handleAddRequirements()}
            disabled={
              selectedRequirements.length === 0 ||
              accomplishedRequirements.length === ipRequirements.length
            }
            className="disabled:text-muted-foreground bg-sky-600 hover:bg-sky-600/50 disabled:bg-slate-200"
          >
            Add Requirements
          </Button>
        </DialogFooter>
      </div>
    </Modal>
  );
}

export default AddRequirementsModal;
