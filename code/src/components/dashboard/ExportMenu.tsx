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
  const [isExportingPdf, setIsExportingPdf] = useState(false);

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

      toast.success("PDF exported successfully.");
    } catch (error) {
      toast.error("Failed to export PDF: " + error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <Button
      startIcon={
        isExportingPdf ? (
          <Loader2 size={18} className="transform-gpu animate-spin" />
        ) : (
          <Download size={18} />
        )
      }
      onClick={handleExportPdf}
      disabled={isExportingPdf}
    >
      {isExportingPdf ? "Exporting PDF..." : "Export PDF"}
    </Button>
  );
}
