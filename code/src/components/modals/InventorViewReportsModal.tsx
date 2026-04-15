import useInventorViewReportsModal from "@/hooks/useInventorViewReportsModal";
import { useDeleteInventor } from "@/hooks/inventors/useDeleteInventorById";
import { useConfirm } from "@/hooks/useConfirm";

import Modal from "./Modal";
import Button from "../ui/button/Button";
import { InventorType } from "@/lib/types/application";
import { toast } from "sonner";
import { ReportType } from "@/lib/types/reports";
import { cn } from "@/lib/utils";
import { useResolveReport } from "@/hooks/reports/useResolveReport";

export default function InventorReportsModal() {
  const { isOpen, closeModal, reports, setReports } =
    useInventorViewReportsModal();
  const confirm = useConfirm();

  const subjectName =
    reports && reports.length > 0 ? reports[0].subject_name : null;
  const subjectId =
    reports && reports.length > 0 ? reports[0].subject_id : null;

  const { deleteInventor, isLoading: isDeleting } = useDeleteInventor();

  async function onRemoveInventor(
    subjectName: InventorType["Row"]["full_name"],
    subjectId: InventorType["Row"]["id"],
  ) {
    const isConfirmed = await confirm({
      title: "Confirm Removal",
      message: `Are you sure you want to remove ${subjectName} from the application? This action cannot be undone.`,
    });

    if (!isConfirmed) return;

    toast.promise(deleteInventor({ id: subjectId }), {
      loading: `Removing ${subjectName} from the application...`,
      success: `${subjectName} has been removed from the application.`,
      error: `Failed to remove ${subjectName} from the application. Please try again.`,
      finally: () => closeModal(),
    });
  }

  return (
    <Modal
      title={`Reports for ${subjectName ?? "Tech Gen"}`}
      description={`Here are the reports associated with this tech gen.`}
      isOpen={isOpen}
      onChange={closeModal}
    >
      <ReportsContent
        reports={reports}
        subjectName={subjectName}
        subjectId={subjectId}
        onRemoveInventor={onRemoveInventor}
        isDeleting={isDeleting}
        setReports={setReports}
      />
    </Modal>
  );
}

function formatTimestamp(dateString?: string) {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

interface ReportsContentProps {
  reports: ReportType["Row"][] | null | undefined;
  subjectName: InventorType["Row"]["full_name"] | null;
  subjectId: InventorType["Row"]["id"] | null;
  onRemoveInventor: (
    subjectName: InventorType["Row"]["full_name"],
    subjectId: InventorType["Row"]["id"],
  ) => void;
  setReports: (reports: ReportType["Row"][]) => void;
  isDeleting: boolean;
}

function ReportsContent(props: ReportsContentProps) {
  const {
    reports,
    subjectName,
    subjectId,
    onRemoveInventor,
    setReports,
    isDeleting,
  } = props;

  const isAllResolved = reports
    ? reports.every((report) => report.is_resolved)
    : true;

  const { resolveReport, isLoading: isResolving } = useResolveReport();

  async function handleResolveReport(reportId: string) {
    toast.promise(resolveReport({ reportId }), {
      loading: `Resolving report...`,
      success: `Report has been resolved.`,
    });
    // Update the local state to mark the report as resolved
    const updatedReports = reports
      ? reports.map((report) =>
          report.id === reportId ? { ...report, is_resolved: true } : report,
        )
      : [];
    setReports(updatedReports);
  }

  return (
    <div className="w-full max-w-lg min-w-[85vw] px-10 sm:max-h-[90vh] sm:w-[80vh] sm:min-w-[400px]">
      {reports && reports.length > 0 ? (
        <ul className="custom-scrollbar max-h-72 space-y-3 overflow-x-hidden overflow-y-auto pr-2 pb-2">
          {reports.map((report) => (
            <li
              key={report.id}
              className={cn(
                "flex flex-col rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md",
                report.is_resolved ? "opacity-50" : "opacity-100",
              )}
            >
              <div className="mb-2 flex flex-col items-center justify-between sm:flex-row sm:items-center sm:gap-4 sm:align-middle">
                <p className="font-semibold text-slate-800">
                  {report.reporter_name ?? "[Removed Tech Gen]"}
                </p>
                <span className="shrink-0 text-xs font-medium text-slate-400">
                  {formatTimestamp(report.created_at ?? "")}
                </span>
              </div>
              <p className="text-balanced text-sm leading-relaxed text-slate-600 sm:text-left">
                {report.content}
              </p>
              <div className="item-start flex w-full">
                <Button
                  className="mt-10 h-8 py-0 hover:bg-slate-100"
                  disabled={report.is_resolved || isResolving}
                  size="sm"
                  variant="outline"
                  onClick={() => handleResolveReport(report.id)}
                >
                  Resolve
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-md mt-4 py-8 text-center text-slate-500">
          No reports found for this tech gen.
        </p>
      )}

      <Button
        onClick={() => onRemoveInventor(subjectName!, subjectId!)}
        disabled={
          isDeleting ||
          !subjectName ||
          !subjectId ||
          reports?.length === 0 ||
          isAllResolved ||
          isResolving
        }
        className="mt-6 h-10 w-full border bg-rose-500 font-medium text-white transition-colors hover:border-rose-500 hover:bg-white hover:text-rose-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-400"
      >
        Remove Tech Gen
      </Button>
    </div>
  );
}
