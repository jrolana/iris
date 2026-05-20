import { useState } from "react";
import { useGetInventorsByAppId } from "@/hooks/inventors/useGetInventorsByAppId";
import { useGetFilesByAppId } from "@/hooks/attachments/useGetFilesByAppId";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atom-states/user";

import ViewAttachments from "./ViewAttachments";
import ViewInventorsAdmin from "./ViewInventorsAdmin";
import ViewInventorsTechGen from "./ViewInventorsTechGen";
import { ApplicationType, RequirementsType } from "@/lib/types/application";

type ApplicationViewMode = "applicant" | "admin";

interface DetailsPanelProps {
  mode: ApplicationViewMode;
  application: ApplicationType["Row"];
  isUneditable: boolean | null;
  requirements: RequirementsType["Row"][];
}

function InformationPanel(props: DetailsPanelProps) {
  const { mode, application, isUneditable, requirements } = props;
  const applicationId = application.id;
  const parentApplicationId = application.parent_application_id;
  const [activeTab, setActiveTab] = useState<"attachments" | "inventors">(
    "attachments",
  );

  const user = useAtomValue(userAtom);
  const isFetchingUser = user === undefined;

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
  const countUnit = ["attachment", "tech gen"][tabIndex];
  const countLabel = `${itemCount} ${countUnit}${itemCount === 1 ? "" : "s"}`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="md:text-md xsm:text-sm inline-flex rounded-full bg-gray-100 p-1 text-xs font-medium text-gray-600">
          <button
            type="button"
            onClick={() => setActiveTab("attachments")}
            className={`xsm:px-3 rounded-full px-2 py-1 ${activeTab === "attachments" ? "bg-white text-gray-900" : "text-gray-600"}`}
          >
            Attachments
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inventors")}
            className={`xsm:px-3 rounded-full px-2 py-1 ${
              activeTab === "inventors"
                ? "bg-white text-gray-900"
                : "text-gray-600"
            }`}
          >
            Tech Gens
          </button>
        </div>
        <span className="max-w-24 text-right text-sm leading-snug text-wrap text-gray-500 sm:max-w-none">
          {countLabel}
        </span>
      </div>

      {activeTab === "attachments" ? (
        <ViewAttachments
          groupedFiles={groupedFiles ?? []}
          requirements={isAdmin ? requirements : []}
          user={user!}
          isFetchingUser={isFetchingUser}
          isLoading={isFetchingFiles}
          isUneditable={isUneditable ?? false}
          applicationId={applicationId}
          ipType={application.ip_type}
        />
      ) : isAdmin ? (
        <ViewInventorsAdmin
          inventors={inventors ?? []}
          isAdmin={isAdmin}
          isLoading={isFetchingInventors || isFetchingUser}
          user={user!}
          appId={applicationId}
          parentId={parentApplicationId}
          isUneditable={isUneditable ?? false}
        />
      ) : (
        <ViewInventorsTechGen
          inventors={inventors ?? []}
          isAdmin={isAdmin}
          isLoading={isFetchingInventors || isFetchingUser}
          user={user!}
          appId={applicationId}
          parentId={parentApplicationId}
          isUneditable={isUneditable ?? false}
        />
      )}
    </div>
  );
}

export default InformationPanel;
