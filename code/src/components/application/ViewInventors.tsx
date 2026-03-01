import { useEffect } from "react";
import { useDeleteInventor } from "@/hooks/inventors/useDeleteInventorById";
import useLinkInventorModal from "@/hooks/useLinkInventorModal";
import useInventorCommentModal from "@/hooks/useInventorCommentModal";

import { InventorType } from "@/lib/types/application";
import { User } from "@supabase/supabase-js";

import Hint from "../common/Tooltip";
import { Cable, BadgeCheck, MessageSquareWarning } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ViewInventorsProps {
  inventors: InventorType["Row"][];
  isAdmin: boolean;
  isLoading: boolean;
  user: User | null;
}

function ViewInventors(props: ViewInventorsProps) {
  const { inventors, isAdmin, isLoading, user } = props;

  const { deleteInventor, isLoading: isDeleting } = useDeleteInventor();

  // const reportsBySubject = reports.reduce(
  //   (acc, report) => {
  //     if (report.subject_id) {
  //       acc[report.subject_id] = report;
  //     }
  //     return acc;
  //   },
  //   {} as Record<string, ReportType["Row"]>,
  // );

  const {
    openModal: openLinkModal,
    setExcludedUIDs,
    setInventorUID,
  } = useLinkInventorModal();
  const {
    openModal: openCommentModal,
    setInventorComment,
    setIsAdmin,
    setInventorId,
  } = useInventorCommentModal();

  useEffect(() => {
    setIsAdmin(isAdmin);
  }, [isAdmin, setIsAdmin]);

  // TODO: show proper loading state
  if (isLoading) {
    return (
      <div className="mt-3 flex h-64 items-center justify-center overflow-x-auto overflow-y-auto">
        <p className="text-md mt-4 items-center justify-center text-center text-slate-500">
          Loading inventors...
        </p>
      </div>
    );
  }

  if (inventors.length == 0) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        No inventors recorded yet.
        {isAdmin
          ? " Add the technology generators involved in this application."
          : " Please coordinate with TTBDO for updates to the inventor list."}
      </p>
    );
  }

  function handleCommentClicked(inventorId: string, comment: string | null) {
    setInventorComment(comment);
    setInventorId(inventorId);
    openCommentModal();
  }

  function handleLinkInventor(inventorId: string) {
    const existingUserIds =
      inventors.map((inv) => inv.techgen_id).filter((id) => id !== null) || [];
    setInventorUID(inventorId);
    setExcludedUIDs(existingUserIds);
    openLinkModal();
  }

  function onRemoveInventor(inventor: InventorType["Row"]) {
    toast.promise(deleteInventor({ id: inventor.id }), {
      loading: `Removing ${inventor.full_name} from the application...`,
      success: `${inventor.full_name} has been removed from the application.`,
      error: `Failed to remove ${inventor.full_name} from the application. Please try again.`,
    });
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
                  onClick={() =>
                    handleCommentClicked(inventor.id, inventor.comments)
                  }
                  disabled={isDeleting}
                  className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Reports <MessageSquareWarning size={24} />
                </Button>
                <button
                  type="button"
                  onClick={() => onRemoveInventor(inventor)}
                  className="rounded-md border border-red-100 bg-red-50 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                  disabled={isDeleting}
                >
                  Remove
                </button>
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
                          onClick={() =>
                            handleCommentClicked(inventor.id, inventor.comments)
                          }
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
