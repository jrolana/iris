import { useState } from "react";
import { useGetInventorsByAppId } from "@/hooks/inventors/useGetInventorsByAppId";
import { useGetFilesByAppId } from "@/hooks/attachments/useGetFilesByAppId";
import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";

import ViewAttachments from "./ViewAttachments";
import ViewInventors from "./ViewInventors";

type ApplicationViewMode = "applicant" | "admin";

interface DetailsPanelProps {
  mode: ApplicationViewMode;
  applicationId: string;
  parentApplicationId: string | null;
}

function InformationPanel(props: DetailsPanelProps) {
  const { mode, applicationId, parentApplicationId } = props;
  const [activeTab, setActiveTab] = useState<"attachments" | "inventors">(
    "attachments",
  );

  const { user, loading: isFetchingUser } = useGetCurrentUser();

  const { inventors, isLoading: isFetchingInventors } = useGetInventorsByAppId({
    id: applicationId,
    parentId: parentApplicationId,
  });

  const { files: groupedFiles, isLoading: isFetchingFiles } =
    useGetFilesByAppId({
      id: applicationId,
    });

  const isAdmin = mode === "admin";
  const tabIndex = +(activeTab === "inventors");
  const itemCount = [groupedFiles ?? [], inventors ?? []][tabIndex].length;
  const countLabel = `${itemCount} ${["attachment", "tech gen"][tabIndex]}${" s"[+(itemCount > 0)]}`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-md inline-flex rounded-full bg-gray-100 p-1 font-medium text-gray-600">
          <button
            type="button"
            onClick={() => setActiveTab("attachments")}
            className={`md:text-md rounded-full px-3 py-1 text-sm ${activeTab === "attachments" ? "bg-white text-gray-900" : "text-gray-600"}`}
          >
            Attachments
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inventors")}
            className={`sm:text-md rounded-full px-3 py-1 text-sm ${
              activeTab === "inventors"
                ? "bg-white text-gray-900"
                : "text-gray-600"
            }`}
          >
            Tech Gens
          </button>
        </div>
        <span className="text-center text-sm text-gray-500">{countLabel}</span>
      </div>

      {activeTab === "attachments" ? (
        <ViewAttachments
          groupedFiles={groupedFiles ?? []}
          user={user}
          isFetchingUser={isFetchingUser}
          isLoading={isFetchingFiles}
        />
      ) : (
        <ViewInventors
          inventors={inventors ?? []}
          isAdmin={isAdmin}
          isLoading={isFetchingInventors}
        />
      )}
    </div>
  );
}

export default InformationPanel;
