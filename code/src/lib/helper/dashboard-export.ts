import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DashboardAnalyticsType } from "@/lib/types/views";
import {
  SummaryTableRow,
  SummaryTotals,
  formatIpTypeLabel,
} from "@/lib/helper/dashboard-summary";

type ExportDashboardCsvParams = {
  yearFrom: number;
  yearTo: number;
  presetLabel: string;
  filteredData: DashboardAnalyticsType["Row"][];
  summaryTableRows: SummaryTableRow[];
  summaryTotals: SummaryTotals;
};

type ChartExportItem = {
  chartId: string;
  title: string;
};

type ExportDashboardPdfParams = {
  filename: string;
  yearFrom: number;
  yearTo: number;
  presetLabel: string;
  chartExports: ChartExportItem[];
  summaryTableRows: SummaryTableRow[];
  summaryTotals: SummaryTotals;
  filteredData: DashboardAnalyticsType["Row"][];
};

type ApexDataUriResult = {
  imgURI: string;
  blob?: Blob;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const escapeCsvValue = (value: string | number | null | undefined) => {
  const stringValue = String(value ?? "");
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const exportDashboardCsv = ({
  yearFrom,
  yearTo,
  presetLabel,
  filteredData,
  summaryTableRows,
  summaryTotals,
}: ExportDashboardCsvParams) => {
  const lines: string[] = [];

  lines.push("IP Portfolio Dashboard Export");
  lines.push(`Timeline,${escapeCsvValue(`${yearFrom}-${yearTo}`)}`);
  lines.push(`Mode,${escapeCsvValue(presetLabel)}`);
  lines.push(`Exported At,${escapeCsvValue(new Date().toISOString())}`);
  lines.push("");

  lines.push("SUMMARY TABLE");
  lines.push("IP Type,Filed,Pending,Granted,Withdrawn,Downgraded,Total");

  summaryTableRows.forEach((row) => {
    lines.push(
      [
        escapeCsvValue(formatIpTypeLabel(row.ipType)),
        escapeCsvValue(row.filed),
        escapeCsvValue(row.pending),
        escapeCsvValue(row.granted),
        escapeCsvValue(row.withdrawn),
        escapeCsvValue(row.downgraded),
        escapeCsvValue(row.total),
      ].join(","),
    );
  });

  lines.push(
    [
      escapeCsvValue("Grand Total"),
      escapeCsvValue(summaryTotals.filed),
      escapeCsvValue(summaryTotals.pending),
      escapeCsvValue(summaryTotals.granted),
      escapeCsvValue(summaryTotals.withdrawn),
      escapeCsvValue(summaryTotals.downgraded),
      escapeCsvValue(summaryTotals.total),
    ].join(","),
  );

  lines.push("");
  lines.push("RAW FILTERED DATA");
  lines.push("Year,IP Type,Dashboard Status,Total");

  filteredData.forEach((item) => {
    lines.push(
      [
        escapeCsvValue(item.year),
        escapeCsvValue(item.ip_type),
        escapeCsvValue(item.dashboard_status),
        escapeCsvValue(item.total),
      ].join(","),
    );
  });

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  downloadBlob(blob, `ip-portfolio-${yearFrom}-${yearTo}.csv`);
};

const getChartImage = async (chartId: string) => {
  if (typeof window === "undefined") {
    throw new Error("Chart export is only available in the browser.");
  }

  const apexchartsModule = await import("apexcharts");
  const ApexCharts = apexchartsModule.default;

  const result = (await ApexCharts.exec(chartId, "dataURI", {
    scale: 2,
  })) as ApexDataUriResult;

  return result.imgURI;
};

export const exportDashboardPdf = async ({
  filename,
  yearFrom,
  yearTo,
  presetLabel,
  chartExports,
  summaryTableRows,
  summaryTotals,
  filteredData,
}: ExportDashboardPdfParams) => {
  if (typeof window === "undefined") {
    return;
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let cursorY = 18;

  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 14) {
      pdf.addPage();
      cursorY = 18;
    }
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("IP Portfolio Dashboard Report", margin, cursorY);
  cursorY += 8;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Timeline: ${yearFrom}–${yearTo}`, margin, cursorY);
  cursorY += 5;
  pdf.text(`Mode: ${presetLabel}`, margin, cursorY);
  cursorY += 5;
  pdf.text(`Exported At: ${new Date().toLocaleString()}`, margin, cursorY);
  cursorY += 10;

  for (const chart of chartExports) {
    try {
      const imgURI = await getChartImage(chart.chartId);

      ensureSpace(75);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(chart.title, margin, cursorY);
      cursorY += 4;

      const imgWidth = contentWidth;
      const imgHeight = 60;

      pdf.addImage(imgURI, "PNG", margin, cursorY, imgWidth, imgHeight);
      cursorY += imgHeight + 8;
    } catch {
      ensureSpace(10);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(`${chart.title} could not be exported.`, margin, cursorY);
      cursorY += 8;
    }
  }

  ensureSpace(16);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Detailed Breakdown", margin, cursorY);
  cursorY += 4;

  autoTable(pdf, {
    startY: cursorY,
    head: [[
      "IP Type",
      "Filed",
      "Pending",
      "Granted",
      "Withdrawn",
      "Downgraded",
      "Total",
    ]],
    body: [
      ...summaryTableRows.map((row) => [
        formatIpTypeLabel(row.ipType),
        row.filed,
        row.pending,
        row.granted,
        row.withdrawn,
        row.downgraded,
        row.total,
      ]),
      [
        "Grand Total",
        summaryTotals.filed,
        summaryTotals.pending,
        summaryTotals.granted,
        summaryTotals.withdrawn,
        summaryTotals.downgraded,
        summaryTotals.total,
      ],
    ],
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 2.5,
    },
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [55, 65, 81],
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: [31, 41, 55],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: margin, right: margin },
  });

  pdf.addPage();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Raw Filtered Data", margin, 18);

  autoTable(pdf, {
    startY: 24,
    head: [["Year", "IP Type", "Dashboard Status", "Total"]],
    body: filteredData.map((item) => [
      item.year ?? "",
      formatIpTypeLabel(String(item.ip_type ?? "")),
      String(item.dashboard_status ?? ""),
      Number(item.total ?? 0),
    ]),
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [55, 65, 81],
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: [31, 41, 55],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: margin, right: margin },
  });

  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    pdf.setPage(i);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 28, pageHeight - 8);
  }

  pdf.save(filename);
};