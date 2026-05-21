import { useCheckOffRequirement } from "@/hooks/requirements/useCheckOffRequirement";
import { useConfirm } from "@/hooks/useConfirm";
import { RequirementsType } from "@/lib/types/application";
import { Loader } from "lucide-react";
import UploadRequirementButton from "../common/UploadRequirementButton";
import { Button } from "../ui/button";

interface RequirementsPanelProps {
  isAdmin: boolean;
  requirements: RequirementsType["Row"][] | undefined;
  isFetchingRequirements: boolean;
}

export default function RequirementsPanel(props: RequirementsPanelProps) {
  const { isAdmin, requirements, isFetchingRequirements } = props;
  const confirm = useConfirm();
  const { checkOffRequirement, isLoading: isCheckingOff } =
    useCheckOffRequirement();

  async function handleCheckRequirement(requirementId: string) {
    const isConfirmed = await confirm({
      title: "Confirm Requirement Check",
      message:
        "Are you sure you want to check this requirement? This action cannot be undone.",
    });
    if (!isConfirmed) return;

    await checkOffRequirement({ requirementId });
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

  if (isAdmin) {
    return (
      <div className="flex h-full w-full flex-col gap-4">
        <h2 className="text-lg font-semibold">Requirements Checklist</h2>

        <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
          {requirements.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No requirements added yet.
            </p>
          ) : (
            requirements.map((req) => (
              <div
                key={req.id}
                className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:gap-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">
                    {req.requirement}
                  </span>
                  {req.is_accomplished && (
                    <span className="mt-0.5 text-xs font-semibold text-emerald-600">
                      Accomplished
                    </span>
                  )}
                </div>
                {!req.is_accomplished && (
                  <Button
                    onClick={() => handleCheckRequirement(req.id)}
                    className="flex w-full items-center justify-center gap-1 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                    disabled={isCheckingOff}
                  >
                    {isCheckingOff ? "Marking" : "Mark done"}
                    {isCheckingOff && (
                      <Loader
                        size={14}
                        className="ml-2 animate-spin text-white"
                      />
                    )}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h2 className="text-xl font-semibold">Requirements Checklist</h2>

      <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
        {requirements.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No requirements assigned yet.
          </p>
        ) : (
          requirements.map((req) => (
            <div
              key={req.id}
              className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-0"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800">
                  {req.requirement}
                </span>
                {req.is_accomplished ? (
                  <span className="mt-0.5 text-xs font-semibold text-emerald-600">
                    Uploaded
                  </span>
                ) : (
                  <span className="mt-0.5 text-xs font-semibold text-amber-600">
                    Pending
                  </span>
                )}
              </div>
              {!req.is_accomplished && (
                <UploadRequirementButton
                  applicationId={req.application_id}
                  className="bg-blue-600 text-white hover:bg-transparent hover:text-blue-600"
                  requirementId={req.id}
                  acceptedFileTypes={{
                    "application/pdf": [".pdf"],
                    "application/msword": [".doc"],

                    // Microsoft Office (Works on all OS if exported to these formats)
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      [".docx"],

                    // OpenDocument Formats (Native to Linux/LibreOffice/OpenOffice)
                    "application/vnd.oasis.opendocument.text": [".odt"],

                    // Apple iWork Formats (Native to Mac/iOS)
                    "application/vnd.apple.pages": [".pages"],
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
