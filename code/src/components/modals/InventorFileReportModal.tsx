import { useEffect, useState } from "react";
import useInventorFileReportModal from "@/hooks/useInventorFileReportModal";
import { useFileReport } from "@/hooks/reports/useFileReport";
import { ReportType } from "@/lib/types/reports";

import Modal from "./Modal";
import Button from "../ui/button/Button";
import { toast } from "sonner";

function handleError(error: Error, subjectName: string) {
  if (error.message.includes("unique_report_pair")) {
    return `You have already filed a report against ${subjectName}. Please wait for the current report to be reviewed.`;
  }
  return `Failed to file report against ${subjectName}. Please try again. Error: ${error.message}`;
}

export default function InventorFileReportModal() {
  const { isOpen, closeModal, subject, reporter } =
    useInventorFileReportModal();
  const [report, setReport] = useState("");

  const { fileReport, isLoading } = useFileReport();

  useEffect(() => {
    if (isOpen) {
      setReport("");
    }
  }, [isOpen, setReport]);

  async function handleFileReport() {
    if (!subject || !reporter) return;
    const reportData: ReportType["Insert"] = {
      subject_id: subject.id,
      application_id: subject.application_id,
      content: report.trim(),
      subject_name: subject.full_name,
      reporter_id: reporter.id,
      reporter_name: reporter.full_name,
    };

    toast.promise(fileReport({ reportData }), {
      loading: `Filing report against ${subject.full_name}...`,
      success: `Report against ${subject.full_name} has been filed.`,
      finally: () => closeModal(),
      error: (e) => handleError(e, subject.full_name),
    });
  }

  return (
    <Modal
      title={`File a report against ${subject?.full_name ?? "this inventor"}`}
      description={`Please provide a detailed explanation of the issue you are reporting.`}
      isOpen={isOpen}
      onChange={closeModal}
    >
      <div className="w-full max-w-lg min-w-[85vw] justify-center px-0 sm:max-h-[90vh] sm:w-[80vh] sm:min-w-[400px] sm:px-10">
        <textarea
          disabled={isLoading}
          value={report}
          onChange={(e) => setReport(e.target.value)}
          rows={4}
          className="placeholder:text-muted-foreground w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
          placeholder="I would like to report that this inventor has been engaging in suspicious activities such as..."
        />
        <Button
          disabled={!report.trim() || isLoading}
          className="h-10 w-full border bg-rose-500 font-medium text-white transition-colors hover:border-rose-500 hover:bg-white hover:text-rose-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-400"
          onClick={handleFileReport}
        >
          Report
        </Button>
      </div>
    </Modal>
  );
}
