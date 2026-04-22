import { useEffect, useMemo } from "react";
import { useGetReportsByAppId } from "@/hooks/reports/useGetReportsByAppId";
import { useAddNewInventor } from "@/hooks/inventors/useAddNewInventor";
import useAddNewVerifiedInventorModal from "@/hooks/useAddNewVerifiedInventorModal";

import InventorItems from "../common/InventorItems";
import { InventorType } from "@/lib/types/application";
import { ReportWithRelations } from "@/lib/types/reports";
import { UserType } from "@/lib/types/users";
import { Loader } from "lucide-react";

interface ViewInventorsProps {
  inventors: InventorType["Row"][];
  isAdmin: boolean;
  isLoading: boolean;
  user: UserType["Row"] | null;
  appId: string;
  parentId: string | null;
  isUneditable: boolean;
}

function ViewInventors(props: ViewInventorsProps) {
  const { inventors, isAdmin, isLoading, user, appId, parentId, isUneditable } =
    props;

  const inventorUser = inventors.find((inv) => inv.techgen_id === user?.id);
  const { reports, isLoading: isReportsLoading } = useGetReportsByAppId({
    id: appId,
    parentId,
  });

  const reportsByInventorId = reports?.reduce(
    (acc, report) => {
      const inventorId = report.subject_id;
      if (!acc[inventorId]) {
        acc[inventorId] = [];
      }
      acc[inventorId].push(report);
      return acc;
    },
    {} as Record<string, ReportWithRelations[]>,
  );

  const existingUserIds = useMemo(
    () =>
      inventors.map((inv) => inv.techgen_id).filter((id) => id !== null) || [],
    [inventors],
  );
  const { isLoading: isAddingInventor } = useAddNewInventor();

  const {
    openModal: openAddVerifiedInventorModal,
    setExcludedUIDs,
    setIsAdminAdding,
    setApplicationId,
  } = useAddNewVerifiedInventorModal();

  useEffect(() => {
    if (!existingUserIds || existingUserIds.length === 0) return;
    setExcludedUIDs(existingUserIds);
  }, [existingUserIds, setExcludedUIDs]);

  useEffect(() => {
    if (!appId) return;
    setApplicationId(appId);
  }, [appId, setApplicationId]);

  if (isLoading) {
    return (
      <div className="flex h-72 flex-row items-center justify-center gap-2 align-middle">
        <p className="align-middle text-sm text-slate-500">
          Fetching collaborators...
        </p>
        <Loader className="animate-spin text-slate-500" size={18} />
      </div>
    );
  }

  if (inventors.length == 0) {
    return (
      <p className="my-10 text-center text-sm text-slate-500">
        No tech gens recorded yet.
        {isAdmin
          ? " Add the technology generators involved in this application."
          : " Please coordinate with TTBDO for updates to the inventor list."}
      </p>
    );
  }

  return (
    <>
      <ul className="mt-3 max-h-64 divide-y divide-slate-100 overflow-x-hidden overflow-y-auto">
        {inventors.map((inventor) => {
          if (inventor.status === "non-member") return null;
          return (
            <li key={inventor.id} className="py-3">
              <InventorItems
                inventor={inventor}
                isAdmin={isAdmin}
                isLoading={isLoading}
                isFetchingReports={isReportsLoading}
                inventorUser={inventorUser}
                existingUserIds={existingUserIds}
                reports={
                  reportsByInventorId ? reportsByInventorId[inventor.id] : []
                }
                isUneditable={isUneditable}
              />
            </li>
          );
        })}
      </ul>
      <div className="mt-4">
        {isAdmin ? (
          <>
            <button
              type="button"
              onClick={() => {
                setIsAdminAdding(true);
                openAddVerifiedInventorModal();
              }}
              disabled={isAddingInventor}
              className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Add technology generator
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Link an IRIS account to a tech gen to let them access this
              application.
            </p>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setIsAdminAdding(false);
                openAddVerifiedInventorModal();
              }}
              disabled={isAddingInventor}
              className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Add technology generator
            </button>
            <p className="mt-2 text-sm text-gray-500">
              You can try to file a report <b>once</b> for issues and concerns
              on a tech gen. For further concerns, please coordinate with TTBDO
              directly.
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default ViewInventors;
