import useLinkInventorModal from "@/hooks/useLinkInventorModal";
import useInventorFileReportModal from "@/hooks/useInventorFileReportModal";

import Hint from "../common/Tooltip";
import { Cable, BadgeCheck, MessageSquareWarning } from "lucide-react";
import { Button } from "../ui/button";
import { InventorType } from "@/lib/types/application";

import { toast } from "sonner";
import useInventorViewReportsModal from "@/hooks/useInventorViewReportsModal";

interface InventorItemsProps {
  inventor: InventorType["Row"];
  isAdmin: boolean;
  isLoading: boolean;
  inventorUser?: InventorType["Row"] | undefined;
  existingUserIds: string[];
}

export default function InventorItems(props: InventorItemsProps) {
  const { inventor, isAdmin, isLoading, inventorUser, existingUserIds } = props;

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
    setInventorUID(inventorId);
    setExcludedUIDs(existingUserIds);
    openLinkModal();
  }

  return (
    <>
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
            disabled={!inventor.techgen_id || isLoading}
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
              {inventor.techgen_id !== inventorUser?.techgen_id && (
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
    </>
  );
}
