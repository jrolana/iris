"use client";
import { useEffect, useState } from "react";
import { useConfirm } from "@/hooks/useConfirm";
import useAddRequirementsModal from "@/hooks/useAddRequirementsModal";

import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog"; // could be removed
import { requirements } from "@/lib/constants/requirements";
import RequirementsChecklist from "../admin/RequirementsChecklist";
import { useAddRequirements } from "@/hooks/requirements/useAddRequirements";
import { toast } from "sonner";

function AddRequirementsModal() {
  const {
    isOpen,
    closeModal,
    applicationId,
    accomplishedRequirements,
    ipType,
  } = useAddRequirementsModal();

  const addRequirements = useAddRequirements();

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

    toast.promise(
      addRequirements.addRequirements({
        applicationId: applicationId!,
        requirements: selectedRequirements,
      }),
      {
        loading: "Adding requirements...",
        success: "Requirements added successfully!",
        error: "Failed to add requirements.",
      },
    );

    closeModal();
  }

  useEffect(() => {
    if (!isOpen) {
      setSelectedRequirements([]);
    }
  }, [isOpen]);

  return (
    <Modal
      title="Application Requirements"
      description="Select the requirements you want to add to this application."
      isOpen={isOpen}
      onChange={handleChange}
    >
      <div className="flex max-h-[70vh] w-full max-w-lg min-w-[85vw] flex-col sm:w-[80vh] sm:min-w-100">
        <div className="flex-1 overflow-y-auto pr-2">
          <RequirementsChecklist
            requirements={ipRequirements}
            accomplishedRequirements={accomplishedRequirements}
            selectedRequirements={selectedRequirements}
            setRequirements={setSelectedRequirements}
          />
        </div>
        <DialogFooter className="mt-6 shrink-0">
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
