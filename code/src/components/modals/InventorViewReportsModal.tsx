import useInventorViewReportsModal from "@/hooks/useInventorViewReportsModal";
import { useGetReportsByAppInventorId } from "@/hooks/reports/useGetReportsByAppInventorId";
import { useDeleteInventor } from "@/hooks/inventors/useDeleteInventorById";

import Modal from "./Modal";
import Button from "../ui/button/Button";
import { InventorType } from "@/lib/types/application";
import { toast } from "sonner";
import { ReportType } from "@/lib/types/reports";

export default function InventorReportsModal() {
  const { isOpen, closeModal, subject } = useInventorViewReportsModal();
  const { reports, isLoading: isFetchingReports } =
    useGetReportsByAppInventorId({
      id: subject?.application_id ?? "",
      subjectId: subject?.id ?? "",
      // TODO: confirm if parentId will be used (for downgrades)
      parentId: null,
    });

  const { deleteInventor, isLoading: isDeleting } = useDeleteInventor();

  function onRemoveInventor(subject: InventorType["Row"]) {
    toast.promise(deleteInventor({ id: subject.id }), {
      loading: `Removing ${subject.full_name} from the application...`,
      success: `${subject.full_name} has been removed from the application.`,
      error: `Failed to remove ${subject.full_name} from the application. Please try again.`,
      finally: () => closeModal(),
    });
  }

  return (
    <Modal
      title={`Reports for ${subject?.full_name ?? "Inventor"}`}
      description={`Here are the reports associated with this tech gen.`}
      isOpen={isOpen}
      onChange={closeModal}
    >
      <ReportsContent
        isFetchingReports={isFetchingReports}
        reports={reports}
        subject={subject}
        onRemoveInventor={onRemoveInventor}
        isDeleting={isDeleting}
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
  isFetchingReports: boolean;
  reports: ReportType["Row"][] | null | undefined;
  subject: InventorType["Row"] | null;
  onRemoveInventor: (subject: InventorType["Row"]) => void;
  isDeleting: boolean;
}

function ReportsContent(props: ReportsContentProps) {
  const { isFetchingReports, reports, subject, onRemoveInventor, isDeleting } =
    props;

  if (isFetchingReports) {
    return (
      <div className="flex w-full max-w-2xl justify-center px-10 py-8">
        <p className="text-md animate-pulse text-slate-500">
          Loading reports...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg min-w-[85vw] px-10 sm:max-h-[90vh] sm:w-[80vh] sm:min-w-[400px]">
      {reports && reports.length > 0 ? (
        <ul className="custom-scrollbar max-h-72 space-y-3 overflow-x-hidden overflow-y-auto pr-2 pb-2">
          {reports.map((report) => (
            <li
              key={report.id}
              className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex flex-col items-center justify-between sm:flex-row sm:items-center sm:gap-4 sm:align-middle">
                <p className="font-semibold text-slate-800">
                  {report.reporter_name}
                </p>
                <span className="shrink-0 text-xs font-medium text-slate-400">
                  {formatTimestamp(report.created_at ?? "")}
                </span>
              </div>
              <p className="text-balanced text-sm leading-relaxed text-slate-600 sm:text-left">
                {report.content}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-md mt-4 py-8 text-center text-slate-500">
          No reports found for this inventor.
        </p>
      )}

      <Button
        onClick={() => onRemoveInventor(subject!)}
        disabled={isDeleting || !subject || reports?.length === 0}
        className="mt-6 h-10 w-full border bg-rose-500 font-medium text-white transition-colors hover:border-rose-500 hover:bg-white hover:text-rose-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-400"
      >
        Remove Tech Gen
      </Button>
    </div>
  );
}
