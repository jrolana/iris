import useLinkInventorModal from "@/hooks/useLinkInventorModal";
import useInventorFileReportModal from "@/hooks/useInventorFileReportModal";
import useInventorViewReportsModal from "@/hooks/useInventorViewReportsModal";
import { useAutoLinkInventor } from "@/hooks/inventors/useAutoLinkInventor";
import { useConfirm } from "@/hooks/useConfirm";
import { useAcceptRejectInventor } from "@/hooks/inventors/useAcceptRejectInventor";

import { ReportWithRelations } from "@/lib/types/reports";
import { InventorType } from "@/lib/types/application";

import Hint from "../common/Tooltip";
import {
  Cable,
  BadgeCheck,
  MessageSquareWarning,
  MessageSquareReply,
  Loader,
  UserRoundX,
  UserRoundPlus,
  UserRoundCog,
} from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface InventorItemsProps {
  inventor: InventorType["Row"];
  isAdmin: boolean;
  isLoading: boolean;
  inventorUser?: InventorType["Row"];
  existingUserIds: string[];
  reports?: ReportWithRelations[];
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

  const {
    openModal: openViewReportsModal,
    setReports: setViewReportsReports,
    setIsUneditable: setViewReportsIsUneditable,
  } = useInventorViewReportsModal();

  const { autoLinkInventor, isLoading: isAutoLinking } = useAutoLinkInventor();
  const { acceptRejectInventor, isLoading: isAcceptRejecting } =
    useAcceptRejectInventor();
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

  function handleViewReportsClicked(reports: ReportWithRelations[]) {
    setViewReportsReports(reports || []);
    setViewReportsIsUneditable(isUneditable);
    openViewReportsModal();
  }

  function handleLinkInventor(inventorId: string) {
    setInventorUID(inventorId);
    setExcludedUIDs(existingUserIds);
    openLinkModal();
  }

  async function handleAcceptRejectInventor(status: "member" | "non-member") {
    const isConfirmed = await confirm({
      title: `Confirm ${status === "member" ? "Acceptance" : "Rejection"}`,
      message: `Are you sure you want to ${
        status === "member" ? "accept" : "reject"
      } this tech gen? This action cannot be undone.`,
    });

    if (!isConfirmed) return;

    toast.promise(acceptRejectInventor({ inventorId: inventor.id, status }), {
      loading: `Updating tech gen status...`,
      success: `Tech gen status updated successfully!`,
      error: (err) => `Failed to update tech gen status: ${err.message}`,
    });
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
        loading: "Linking account...",
        success: "Account linked successfully!",
        error: (err) => `Failed to link account: ${err.message}`,
      },
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-md truncate font-medium text-slate-900">
          {inventor.full_name}
        </p>
        <p className="text-sm break-all text-slate-600">{inventor.email}</p>

        <Hint
          label={
            inventor.external_institution ??
            inventor.college_code ??
            inventor.other_college_name ??
            ""
          }
        >
          <span className="block w-fit max-w-full truncate rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700 uppercase sm:max-w-48">
            {inventor.external_institution ??
              inventor.college_code ??
              inventor.other_college_name}
          </span>
        </Hint>
      </div>
      <ActionButtons
        isAdmin={isAdmin}
        inventor={inventor}
        reports={reports}
        isLoading={isLoading}
        isFetchingReports={isFetchingReports}
        inventorUser={inventorUser}
        isUneditable={isUneditable}
        handleLinkInventor={handleLinkInventor}
        handleViewReportsClicked={handleViewReportsClicked}
        handleFileReportClicked={handleFileReportClicked}
        handleAutoLinkInventor={handleAutoLinkInventor}
        hasFiledReport={hasFiledReport}
        isAutoLinking={isAutoLinking}
        handleAcceptRejectInventor={handleAcceptRejectInventor}
        isAcceptRejecting={isAcceptRejecting}
      />
    </div>
  );
}

interface ActionButtonsProps {
  isAdmin: boolean;
  inventor: InventorType["Row"];
  reports?: ReportWithRelations[];
  isLoading: boolean;
  isFetchingReports: boolean;
  inventorUser?: InventorType["Row"];
  isUneditable: boolean;
  handleLinkInventor: (inventorId: string) => void;
  handleViewReportsClicked: (reports: ReportWithRelations[]) => void;
  handleFileReportClicked: (inventor: InventorType["Row"]) => void;
  handleAutoLinkInventor: () => void;
  hasFiledReport: boolean;
  isAutoLinking: boolean;
  handleAcceptRejectInventor: (status: "member" | "non-member") => void;
  isAcceptRejecting: boolean;
}

function ActionButtons(props: ActionButtonsProps) {
  const {
    isAdmin,
    inventor,
    reports,
    isLoading,
    isFetchingReports,
    inventorUser,
    isUneditable,
    handleLinkInventor,
    handleViewReportsClicked,
    handleFileReportClicked,
    handleAutoLinkInventor,
    handleAcceptRejectInventor,
    isAcceptRejecting,
    hasFiledReport,
    isAutoLinking,
  } = props;

  if (inventor.status === "member") {
    return (
      <>
        {isAdmin ? (
          <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 whitespace-nowrap xl:w-auto xl:justify-end xl:overflow-visible xl:pb-0">
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
          <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 whitespace-nowrap xl:w-auto xl:justify-end xl:overflow-visible xl:pb-0">
            {inventor.techgen_id ? (
              <>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-sky-600">
                  Verified Account <BadgeCheck size={24} />
                </div>
                {inventor.techgen_id !== inventorUser?.techgen_id && (
                  <FileReportButton
                    reports={reports}
                    inventorUser={inventorUser}
                    isFetchingReports={isFetchingReports}
                    isUneditable={isUneditable}
                    hasFiledReport={hasFiledReport}
                    handleFileReportClicked={handleFileReportClicked}
                    inventor={inventor}
                  />
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
  } else if (inventor.status === "pending") {
    return (
      <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 whitespace-nowrap xl:w-auto xl:justify-end xl:overflow-visible xl:pb-0">
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-sky-600">
          Verified Account <BadgeCheck size={24} />
        </div>
        {isAdmin ? (
          <>
            <Button
              type="button"
              onClick={() => handleAcceptRejectInventor("member")}
              disabled={isUneditable || isAcceptRejecting || isLoading}
              className="flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-2 py-1 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
            >
              Accept
              {isAcceptRejecting ? (
                <Loader className="animate-spin" size={24} />
              ) : (
                <UserRoundPlus size={24} />
              )}
            </Button>
            <Button
              type="button"
              onClick={() => handleAcceptRejectInventor("non-member")}
              disabled={isLoading || isAcceptRejecting || isUneditable}
              className="flex items-center gap-2 rounded-md border border-rose-200 bg-white px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <p>Reject</p>
              {isAcceptRejecting ? (
                <Loader className="animate-spin" size={24} />
              ) : (
                <UserRoundX size={24} />
              )}
            </Button>
          </>
        ) : (
          <>
            {inventor.techgen_id !== inventorUser?.techgen_id && (
              <Hint label={"Waiting for admin approval"}>
                <Button
                  type="button"
                  disabled
                  className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Pending
                  <UserRoundCog size={24} />
                </Button>
              </Hint>
            )}
          </>
        )}
      </div>
    );
  }
}

interface FileReportButtonProps {
  reports?: ReportWithRelations[];
  inventorUser?: InventorType["Row"];
  isFetchingReports: boolean;
  isUneditable: boolean;
  hasFiledReport: boolean;
  handleFileReportClicked: (inventor: InventorType["Row"]) => void;
  inventor: InventorType["Row"];
}

function FileReportButton(props: FileReportButtonProps) {
  const {
    reports,
    inventorUser,
    isFetchingReports,
    isUneditable,
    hasFiledReport,
    handleFileReportClicked,
    inventor,
  } = props;
  const filedReport = reports?.find(
    (report) => report.reporter_id === inventorUser?.id,
  );
  if (filedReport?.is_resolved) {
    return (
      <Hint
        label={
          "You have filed a report for this tech gen, but it has already been resolved."
        }
      >
        <Button
          type="button"
          disabled
          className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Resolved
          <MessageSquareReply size={24} />
        </Button>
      </Hint>
    );
  }
  return (
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
        disabled={isFetchingReports || hasFiledReport || isUneditable}
        className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        {hasFiledReport ? "Report Filed" : "File Report"}
        <MessageSquareWarning size={24} />
      </Button>
    </Hint>
  );
}
