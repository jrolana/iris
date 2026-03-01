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
    });
  }

  return (
    <Modal
      title={`Reports for ${subject?.full_name ?? "Inventor"}`}
      description={`Here are the reports associated with this inventor.`}
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
      <div className="w-2xl justify-center px-10">
        <p className="text-md mt-4 items-center justify-center text-center text-slate-500">
          Loading reports...
        </p>
      </div>
    );
  }

  return (
    <div className="w-2xl justify-center px-10">
      {reports && reports.length > 0 ? (
        <ul className="list-disc space-y-2">
          {reports.map((report) => (
            <li key={report.id} className="text-left">
              <p className="font-medium">{report.reporter_name}</p>
              <p className="text-sm text-gray-500">{report.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-md mt-4 items-center justify-center text-center text-slate-500">
          No reports found for this inventor.
        </p>
      )}
      <Button
        onClick={() => onRemoveInventor(subject!)}
        disabled={isDeleting || !subject || reports?.length === 0}
        className="mt-8 h-10 w-full border bg-rose-500 text-white hover:bg-white hover:text-rose-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
      >
        Remove Tech Gen
      </Button>
    </div>
  );
}
