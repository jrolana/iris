import { useAcceptRequirement } from "@/hooks/requirements/useAcceptRequirement";
import { useConfirm } from "@/hooks/useConfirm";
import {
  RequirementStatusType,
  RequirementWithAttachment,
} from "@/lib/types/requirements";
import { Loader } from "lucide-react";
import UploadRequirementButton from "../common/UploadRequirementButton";
import { Button } from "../ui/button";
import RequirementFileItem from "./RequirementFileItem";

interface RequirementsPanelProps {
  isAdmin: boolean;
  requirements: RequirementWithAttachment[] | undefined;
  isFetchingRequirements: boolean;
}

const statusLabels: Record<RequirementStatusType, string> = {
  pending: "Pending",
  submitted: "Submitted",
  accepted: "Accepted",
};

const statusClasses: Record<RequirementStatusType, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  submitted: "bg-sky-50 text-sky-700 border-sky-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function RequirementsPanel(props: RequirementsPanelProps) {
  const { isAdmin, requirements, isFetchingRequirements } = props;
  const confirm = useConfirm();
  const { acceptRequirement, isLoading: isAccepting } = useAcceptRequirement();

  async function handleAcceptRequirement(
    requirementId: string,
    hasUpload: boolean,
  ) {
    const isConfirmed = await confirm({
      title: hasUpload ? "Accept Requirement" : "Check Off Requirement",
      message: hasUpload
        ? "Accept this submitted file and mark the requirement as completed?"
        : "Check off this requirement without an upload and mark it as accepted?",
    });
    if (!isConfirmed) return;

    await acceptRequirement({ requirementId });
  }

  if (isFetchingRequirements) {
    return (
      <div className="flex h-40 w-full items-center justify-center gap-2">
        Fetching requirements <Loader size={18} className="animate-spin" />
      </div>
    );
  }

  if (!requirements) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h2
        className={isAdmin ? "text-lg font-semibold" : "text-xl font-semibold"}
      >
        Requirements Checklist
      </h2>

      <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
        {requirements.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            {isAdmin
              ? "No requirements added yet."
              : "No requirements assigned yet."}
          </p>
        ) : (
          requirements.map((req) => {
            const status: RequirementStatusType = req.status;
            const hasUpload = Boolean(req.storage_id);
            const canAdminAct = isAdmin && status !== "accepted";
            const canUpload = !isAdmin && status === "pending" && !hasUpload;
            let adminActionLabel = "Check off";

            if (isAccepting) {
              adminActionLabel = "Saving";
            } else if (hasUpload) {
              adminActionLabel = "Accept";
            }

            return (
              <div
                key={req.id}
                className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="flex min-w-0 flex-row items-end justify-center gap-3">
                    <span className="text-sm font-medium text-slate-800">
                      {req.requirement}
                    </span>
                    <span
                      className={`mt-1 w-fit rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClasses[status]}`}
                    >
                      {statusLabels[status]}
                    </span>
                  </div>

                  {canAdminAct && (
                    <Button
                      onClick={() => handleAcceptRequirement(req.id, hasUpload)}
                      className="flex w-full items-center justify-center gap-1 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                      disabled={isAccepting}
                    >
                      {adminActionLabel}
                      {isAccepting && (
                        <Loader
                          size={14}
                          className="ml-2 animate-spin text-white"
                        />
                      )}
                    </Button>
                  )}

                  {canUpload && (
                    <UploadRequirementButton
                      applicationId={req.application_id}
                      className="bg-blue-600 text-white hover:bg-transparent hover:text-blue-600"
                      requirementId={req.id}
                      acceptedFileTypes={{
                        "application/pdf": [".pdf"],
                        "application/msword": [".doc"],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                          [".docx"],
                        "application/vnd.oasis.opendocument.text": [".odt"],
                        "application/vnd.apple.pages": [".pages"],
                      }}
                    />
                  )}
                </div>

                {hasUpload ? (
                  <RequirementFileItem requirement={req} />
                ) : (
                  <p className="text-xs font-medium text-slate-500">
                    No upload yet.
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
