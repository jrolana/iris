import { useEffect, useState } from "react";
import useInventorCommentModal from "@/hooks/useInventorCommentModal";

import Modal from "./Modal";
import Button from "../ui/button/Button";
import { useUpdateInventor } from "@/hooks/inventors/useUpdateInventor";

export default function InventorCommentModal() {
  const { isOpen, closeModal, inventorComment, isAdmin, inventorId } =
    useInventorCommentModal();
  const [typedComment, setTypedComment] = useState(inventorComment ?? "");
  const { isLoading, updateInventor } = useUpdateInventor();

  useEffect(() => {
    if (isOpen) {
      setTypedComment(inventorComment ?? "");
    }
  }, [isOpen, inventorComment]);

  async function handleUpdateComment() {
    if (!inventorId) return;
    await updateInventor({
      id: inventorId,
      inventorData: {
        comments: typedComment.trim() === "" ? null : typedComment.trim(),
      },
    });
    closeModal();
  }

  return (
    <Modal
      title={isAdmin ? "Annotate Inventor Comment" : "View Inventor Comment"}
      description={
        isAdmin
          ? "Add or modify comments regarding this inventor. This comment will be visible only to other collaborators of this application and not to the inventor themselves."
          : "View comments regarding this inventor. These comments are visible only to other collaborators of this application and not to the inventor themselves."
      }
      isOpen={isOpen}
      onChange={closeModal}
    >
      <div className="w-2xl justify-center px-10">
        <textarea
          disabled={!isAdmin}
          value={typedComment}
          onChange={(e) => setTypedComment(e.target.value)}
          rows={4}
          className="placeholder:text-muted-foreground w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
          placeholder="There is no comment for this inventor yet."
        />
        {isAdmin && (
          <Button
            disabled={
              typedComment.trim() === (inventorComment ?? "").trim() ||
              isLoading
            }
            className="h-10 w-full"
            onClick={handleUpdateComment}
          >
            Save
          </Button>
        )}
      </div>
    </Modal>
  );
}
