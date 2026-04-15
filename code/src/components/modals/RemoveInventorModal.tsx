import { useEffect, useState } from "react";
import useRemoveInventorModal from "@/hooks/useRemoveInventorModal";
import useInventorViewReportsModal from "@/hooks/useInventorViewReportsModal";
import { useDeleteInventor } from "@/hooks/inventors/useDeleteInventorById";
import { useSendNotifications } from "@/hooks/notifications/useSendNotifications";

import Modal from "./Modal";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function RemoveInventorModal() {
  const [comment, setComment] = useState("");
  const { isOpen, closeModal } = useRemoveInventorModal();
  const { closeModal: closeReportsModal } = useInventorViewReportsModal();
  const { reports } = useInventorViewReportsModal();
  const { deleteInventor, isLoading: isDeleting } = useDeleteInventor();
  const { sendNotifications } = useSendNotifications();

  const subjectName =
    reports && reports.length > 0 ? reports[0].subject_name : null;
  const subjectId =
    reports && reports.length > 0 ? reports[0].subject_id : null;
  const isLoading = false;

  async function onRemoveInventor() {
    toast.promise(deleteInventor({ id: subjectId as string }), {
      loading: `Removing ${subjectName} from the application...`,
      success: `${subjectName} has been removed from the application.`,
      error: `Failed to remove ${subjectName} from the application. Please try again.`,
      finally: () => {
        closeModal();
        notifyCollaborators();
      },
    });
    notifyCollaborators();
    closeModal();
    closeReportsModal();
  }

  async function notifyCollaborators() {
    const appId =
      reports && reports.length > 0 ? reports[0].application_id : null;
    const receiverIds = reports
      ? Array.from(
          new Set(
            reports.map((report) => report.reporter?.techgen_id as string),
          ),
        )
      : [];
    if (receiverIds.length === 0 || !appId) return;

    const appName =
      reports && reports.length > 0
        ? reports[0].app.project_title
        : "the application";

    const content = `${subjectName} has been removed from ${appName}. Reason: ${comment}`;
    const title = `${subjectName} removed from ${appName}`;

    toast.promise(
      sendNotifications({
        receiverIds: receiverIds ?? [],
        applicationId: appId,
        content,
        title,
      }),
      {
        loading: "Notifying collaborators...",
        success: "Collaborators have been notified of the removal.",
        error: "Failed to notify collaborators.",
      },
    );
  }

  useEffect(() => {
    if (!isOpen) {
      setComment("");
    }
  }, [isOpen]);

  return (
    <Modal
      title="Remove Technology Generator"
      description={`Are you sure you want to remove ${subjectName} from the application? This action cannot be undone. 
      Please provide a reason for removing this inventor. All collaborators, including the one to be removed, will be notified of the removal along with the provided reason.`}
      isOpen={isOpen}
      onChange={closeModal}
    >
      <div className="w-full max-w-lg min-w-[85vw] justify-center px-0 sm:max-h-[90vh] sm:w-[80vh] sm:min-w-[400px] sm:px-10">
        <textarea
          disabled={isLoading || isDeleting}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="placeholder:text-muted-foreground w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
          placeholder="I would like to report that this inventor has been engaging in suspicious activities such as..."
        />
        <Button
          disabled={!comment.trim() || isLoading || isDeleting}
          className="h-10 w-full border bg-rose-500 font-medium text-white transition-colors hover:border-rose-500 hover:bg-white hover:text-rose-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-400"
          onClick={onRemoveInventor}
        >
          Remove
        </Button>
      </div>
    </Modal>
  );
}
