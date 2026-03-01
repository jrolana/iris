import useLinkInventorModal from "@/hooks/useLinkInventorModal";
import useInventorFileReportModal from "@/hooks/useInventorFileReportModal";

import { InventorType } from "@/lib/types/application";
import { User } from "@supabase/supabase-js";

import Hint from "../common/Tooltip";
import { Cable, BadgeCheck, MessageSquareWarning } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import useInventorViewReportsModal from "@/hooks/useInventorViewReportsModal";

interface ViewInventorsProps {
  inventors: InventorType["Row"][];
  isAdmin: boolean;
  isLoading: boolean;
  user: User | null;
}

function ViewInventors(props: ViewInventorsProps) {
  const { inventors, isAdmin, isLoading, user } = props;

  const inventorUser = inventors.find((inv) => inv.techgen_id === user?.id);

  const {
    openModal: openLinkModal,
    setExcludedUIDs,
    setInventorUID,
  } = useLinkInventorModal();

  const {
    openModal: openFileReportModal,
    setSubject,
    setReporter,
  } = useInventorFileReportModal();

  const { openModal: openViewReportsModal, setSubject: setViewReportsSubject } =
    useInventorViewReportsModal();

  // TODO: show proper loading state
  if (isLoading) {
    return (
      <div className="mt-3 flex h-64 items-center justify-center overflow-x-auto overflow-y-auto">
        <p className="text-md mt-4 items-center justify-center text-center text-slate-500">
          Loading tech gens...
        </p>
      </div>
    );
  }

  if (inventors.length == 0) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        No tech gens recorded yet.
        {isAdmin
          ? " Add the technology generators involved in this application."
          : " Please coordinate with TTBDO for updates to the inventor list."}
      </p>
    );
  }

  function handleFileReportClicked(subject: InventorType["Row"]) {
    if (!inventorUser) {
      toast.error(
        "You need to be a tech gen on this application to file a report.",
      );
      return;
    }
    setSubject(subject);
    setReporter(inventorUser);
    openFileReportModal();
  }

  function handleViewReportsClicked(subject: InventorType["Row"]) {
    setViewReportsSubject(subject);
    openViewReportsModal();
  }

  function handleLinkInventor(inventorId: string) {
    const existingUserIds =
      inventors.map((inv) => inv.techgen_id).filter((id) => id !== null) || [];
    setInventorUID(inventorId);
    setExcludedUIDs(existingUserIds);
    openLinkModal();
  }

  return (
    <>
      <ul className="mt-3 max-h-64 divide-y divide-slate-100 overflow-x-auto overflow-y-auto">
        {inventors.map((inventor) => (
          <li
            key={inventor.id}
            className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <p className="text-md truncate font-medium text-slate-900">
                {inventor.full_name}
              </p>
              <p className="text-sm text-slate-600">{inventor.email}</p>

              <Hint
                label={
                  inventor.external_institution ??
                  inventor.college_code ??
                  inventor.other_college_name ??
                  ""
                }
              >
                <span className="block w-fit max-w-32 truncate rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700 uppercase">
                  {inventor.external_institution ??
                    inventor.college_code ??
                    inventor.other_college_name}
                </span>
              </Hint>
            </div>
            {isAdmin ? (
              <div className="flex shrink-0 items-center gap-2">
                {inventor.techgen_id ? (
                  <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-sky-600">
                    Verified Account <BadgeCheck size={24} />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLinkInventor(inventor.id)}
                    className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Link Account <Cable size={24} />
                  </button>
                )}
                <Button
                  type="button"
                  onClick={() => handleViewReportsClicked(inventor)}
                  disabled={!inventor.techgen_id}
                  className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Reports <MessageSquareWarning size={24} />
                </Button>
              </div>
            ) : (
              <div className="flex shrink-0 items-center gap-2">
                {inventor.techgen_id ? (
                  <>
                    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-sky-600">
                      Verified Account <BadgeCheck size={24} />
                    </div>
                    {inventor.techgen_id !== user?.id && (
                      <Hint label="File a report regarding this tech gen">
                        <button
                          type="button"
                          onClick={() => handleFileReportClicked(inventor)}
                          className="flex items-center gap-2 rounded-md border border-red-100 bg-red-50 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          <MessageSquareWarning size={24} />
                        </button>
                      </Hint>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    className="text-muted-foreground flex cursor-not-allowed items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium"
                  >
                    Unverified Account <BadgeCheck size={24} />
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        {isAdmin ? (
          <>
            {/* <button
              type="button"
              onClick={onAddInventor}
              className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Add inventor
            </button> */}
            <p className="mt-2 text-sm text-gray-500">
              Link an IRIS account to a tech gen to let them access this
              application.
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            You can try to file a report <b>once</b> for issues and concerns on
            a tech gen. For further concerns, please coordinate with TTBDO
            directly.
          </p>
        )}
      </div>
    </>
  );
}

export default ViewInventors;
