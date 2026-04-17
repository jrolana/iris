"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/button/Button";
import { PDF_EXPORT_CHARTS } from "@/lib/dashboard/dashboard";
import type {
  buildSummaryTableRows,
  buildSummaryTotals,
} from "@/lib/dashboard/dashboard-summary";
import { cn } from "@/lib/utils";

type SummaryTableRows = ReturnType<typeof buildSummaryTableRows>;
type SummaryTotals = ReturnType<typeof buildSummaryTotals>;

type ExportMenuProps = {
  yearFrom: number;
  yearTo: number;
  summaryTableRows: SummaryTableRows;
  summaryTotals: SummaryTotals;
};

export default function ExportMenu({
  yearFrom,
  yearTo,
  summaryTableRows,
  summaryTotals,
}: ExportMenuProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const isExporting = isExportingCsv || isExportingPdf;

  const handleExportCsv = async () => {
    try {
      setIsExportingCsv(true);

      const { exportDashboardCsv } =
        await import("@/lib/dashboard/dashboard-export");

      exportDashboardCsv({
        yearFrom,
        yearTo,
        summaryTableRows,
        summaryTotals,
      });

      setShowExportMenu(false);
      toast.success("CSV exported successfully.");
    } catch (error) {
      toast.error("Failed to export CSV: " + error);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);

      const { exportDashboardPdf } =
        await import("@/lib/dashboard/dashboard-export");

      await exportDashboardPdf({
        filename: `ip-portfolio-${yearFrom}-${yearTo}.pdf`,
        yearFrom,
        yearTo,
        chartExports: PDF_EXPORT_CHARTS,
        summaryTableRows,
        summaryTotals,
      });

      setShowExportMenu(false);
      toast.success("PDF exported successfully.");
    } catch (error) {
      toast.error("Failed to export PDF: " + error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="relative">
      <Button
        startIcon={
          isExporting ? (
            <Loader2 size={18} className="transform-gpu animate-spin" />
          ) : (
            <Download size={18} />
          )
        }
        onClick={() => {
          if (isExporting) return;
          setShowExportMenu((prev) => !prev);
        }}
        disabled={isExporting}
      >
        {isExporting ? "Exporting..." : "Export"}
      </Button>

      {showExportMenu && (
        <div className="absolute top-12 right-0 z-20 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm",
              isExporting
                ? "cursor-not-allowed text-gray-400"
                : "text-gray-700 hover:bg-gray-50",
            )}
          >
            <span>{isExportingCsv ? "Exporting CSV..." : "Export CSV"}</span>

            {isExportingCsv && (
              <Loader2 className="h-4 w-4 transform-gpu animate-spin" />
            )}
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm",
              isExporting
                ? "cursor-not-allowed text-gray-400"
                : "text-gray-700 hover:bg-gray-50",
            )}
          >
            <span>{isExportingPdf ? "Exporting PDF..." : "Export PDF"}</span>

            {isExportingPdf && (
              <Loader2 className="h-4 w-4 transform-gpu animate-spin" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
