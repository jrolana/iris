import { InventorType } from "@/lib/types/application";

import { Cable, BadgeCheck, NotepadText } from "lucide-react";
import { toast } from "sonner";
import Hint from "../common/Tooltip";

interface ViewInventorsProps {
  inventors: InventorType[];
  isAdmin: boolean;
  onLinkInventor?: (id: string) => void;
  onAnnotateInventor?: (id: string) => void;
}

function ViewInventors(props: ViewInventorsProps) {
  const { inventors, isAdmin, onAnnotateInventor, onLinkInventor } = props;

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

  function handleViewComments(comment: string | null) {
    if (!comment) comment = "No comments available.";
    toast.info(comment, { duration: 3000 });
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
                  onClick={() => onAnnotateInventor?.(inventor.inventorId)}
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
                    onClick={() => onLinkInventor?.(inventor.inventorId)}
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
                    onClick={() => handleViewComments(inventor.comments)}
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
