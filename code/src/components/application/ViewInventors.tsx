import { InventorType } from "@/lib/types/application";

import { Cable, BadgeCheck, NotepadText } from "lucide-react";
import Hint from "../common/Tooltip";
import useLinkInventorModal from "@/hooks/useLinkInventorModal";
import useInventorCommentModal from "@/hooks/useInventorCommentModal";
import { useEffect } from "react";

interface ViewInventorsProps {
  inventors: InventorType[];
  isAdmin: boolean;
}

function ViewInventors(props: ViewInventorsProps) {
  const { inventors, isAdmin } = props;

  const { openModal: openLinkModal } = useLinkInventorModal();
  const {
    openModal: openCommentModal,
    setInventorComment,
    setIsAdmin,
  } = useInventorCommentModal();

  useEffect(() => {
    setIsAdmin(isAdmin);
  }, [isAdmin, setIsAdmin]);

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
    openCommentModal();
  }

  function handleLinkInventor(inventorId: string) {
    console.log("Link inventor:", inventorId);
    openLinkModal();
  }
  return (
    <>
      <ul className="mt-3 max-h-64 divide-y divide-slate-100 overflow-x-auto overflow-y-auto">
        {inventors.map((inventor) => (
          <li
            key={inventor.inventorId}
            className="flex items-center justify-between py-3 sm:items-start"
          >
            <div className="min-w-0 flex-1">
              <p className="text-md truncate font-medium text-slate-900">
                {inventor.full_name}
              </p>
              <p className="text-sm text-slate-600">{inventor.email}</p>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700 uppercase">
                {inventor.college}
              </span>
            </div>
            {isAdmin ? (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCommentClicked(inventor.inventorId, inventor.comments)
                  }
                  className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Comment
                </button>
                {inventor.userId ? (
                  <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-sky-600">
                    Verified Account <BadgeCheck size={24} />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLinkInventor(inventor.inventorId)}
                    className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Link Account <Cable size={24} />
                  </button>
                )}
                {/* <button
                  type="button"
                  onClick={() => onRemoveInventor?.(inventor.inventorId)}
                  className="rounded-md border border-red-100 bg-red-50 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  Remove
                </button> */}
              </div>
            ) : (
              <div className="flex shrink-0 items-center gap-2">
                <Hint label="Click to see TTBDO annotations">
                  <button
                    type="button"
                    onClick={() =>
                      handleCommentClicked(
                        inventor.inventorId,
                        inventor.comments,
                      )
                    }
                    className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <NotepadText />
                  </button>
                </Hint>
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
              Link an IRIS account to an inventor to let them access this
              application. For issues and concerns on an inventor, please
              annotate or comment to inform the other inventors.
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Read annotations for an inventor. For issues and concerns on an
            inventor, please coordinate with TTBDO.
          </p>
        )}
      </div>
    </>
  );
}

export default ViewInventors;
