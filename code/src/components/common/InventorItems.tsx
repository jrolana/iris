import useLinkInventorModal from "@/hooks/useLinkInventorModal";
import useInventorFileReportModal from "@/hooks/useInventorFileReportModal";
import useInventorViewReportsModal from "@/hooks/useInventorViewReportsModal";
import { useAutoLinkInventor } from "@/hooks/inventors/useAutoLinkInventor";
import { useConfirm } from "@/hooks/useConfirm";

import { ReportType } from "@/lib/types/reports";
import { InventorType } from "@/lib/types/application";

import Hint from "../common/Tooltip";
import { Cable, BadgeCheck, MessageSquareWarning, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface InventorItemsProps {
  inventor: InventorType["Row"];
  isAdmin: boolean;
  isLoading: boolean;
  inventorUser?: InventorType["Row"];
  existingUserIds: string[];
  reports?: ReportType["Row"][];
  isFetchingReports: boolean;
  isUneditable: boolean;
}

export default function InventorItems(props: InventorItemsProps) {
  const {
    inventor,
    isAdmin,
    isLoading,
    inventorUser,
    existingUserIds,
    reports,
    isFetchingReports,
    isUneditable,
  } = props;

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

  const { openModal: openViewReportsModal, setReports: setViewReportsReports } =
    useInventorViewReportsModal();

  const { autoLinkInventor, isLoading: isAutoLinking } = useAutoLinkInventor();
  const confirm = useConfirm();

  const hasFiledReport =
    reports?.find((report) => report.reporter_id === inventorUser?.id) !==
    undefined;

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

  function handleViewReportsClicked(reports: ReportType["Row"][]) {
    setViewReportsReports(reports || []);
    openViewReportsModal();
  }

  function handleLinkInventor(inventorId: string) {
    setInventorUID(inventorId);
    setExcludedUIDs(existingUserIds);
    openLinkModal();
  }

  async function handleAutoLinkInventor() {
    const confirmed = await confirm({
      title: "Confirm Auto-Linking",
      message:
        "Are you sure you want to auto-link this technology generator? This action cannot be undone.",
    });
    if (!confirmed) return;

    toast.promise(
      autoLinkInventor({
        email: inventor.email,
        toBeLinkedInventorId: inventor.id,
      }),
      {
        loading: "Linking inventor...",
        success: "Inventor linked successfully!",
        error: (err) => `Failed to link inventor: ${err.message}`,
      },
    );
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
            <Button
              type="button"
              onClick={() => handleLinkInventor(inventor.id)}
              disabled={isUneditable}
              className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Link Account <Cable size={24} />
            </Button>
          )}
          <Button
            type="button"
            onClick={() => handleViewReportsClicked(reports || [])}
            disabled={!inventor.techgen_id || isLoading || isFetchingReports}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <p>Reports</p>
            <p className="text-center align-middle font-bold">
              ({reports?.length ?? 0})
            </p>
            {isFetchingReports ? (
              <Loader className="animate-spin" size={24} />
            ) : (
              <MessageSquareWarning size={24} />
            )}
          </Button>
        </div>
      ) : (
        <div className="xsm:flex-row xsm:items-center flex shrink-0 flex-col items-start gap-2">
          {inventor.techgen_id ? (
            <>
              <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-sky-600">
                Verified Account <BadgeCheck size={24} />
              </div>
              {inventor.techgen_id !== inventorUser?.techgen_id && (
                <Hint
                  label={
                    hasFiledReport
                      ? "You have already filed a report for this tech gen"
                      : "File a report regarding this tech gen"
                  }
                >
                  <Button
                    type="button"
                    onClick={() => handleFileReportClicked(inventor)}
                    disabled={
                      isFetchingReports || hasFiledReport || isUneditable
                    }
                    className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {hasFiledReport ? "Report Filed" : "File Report"}
                    <MessageSquareWarning size={24} />
                  </Button>
                </Hint>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                className="text-muted-foreground flex cursor-not-allowed items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium"
              >
                Unverified Account <BadgeCheck size={24} />
              </button>
              <Button
                onClick={handleAutoLinkInventor}
                disabled={isAutoLinking || isUneditable}
                className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Link Account <Cable size={24} />
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}
