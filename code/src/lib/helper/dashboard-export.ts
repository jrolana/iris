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

type ChartLabelItem = {
  label: string;
  value: string | number;
};

type ChartExportItem = {
  chartId: string;
  title: string;
  subtitle?: string;
  labels?: ChartLabelItem[];
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

const drawText = (
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  options?: Parameters<jsPDF["text"]>[3],
) => {
  pdf.text(text, x, y, options);
};

const drawSectionHeader = (
  pdf: jsPDF,
  title: string,
  margin: number,
  y: number,
) => {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  drawText(pdf, title, margin, y);
};

const drawLabelChips = (
  pdf: jsPDF,
  labels: ChartLabelItem[],
  startX: number,
  startY: number,
  maxWidth: number,
) => {
  let x = startX;
  let y = startY;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);

  for (const item of labels) {
    const chipText = `${item.label}: ${item.value}`;
    const textWidth = pdf.getTextWidth(chipText);
    const chipWidth = textWidth + 8;
    const chipHeight = 6;

    if (x + chipWidth > startX + maxWidth) {
      x = startX;
      y += 8;
    }

    pdf.setDrawColor(220, 224, 230);
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(x, y - 4.5, chipWidth, chipHeight, 2, 2, "FD");

    pdf.setTextColor(55, 65, 81);
    drawText(pdf, chipText, x + 4, y, { baseline: "middle" });

    x += chipWidth + 4;
  }
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
  if (typeof window === "undefined") return;

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const bottomLimit = pageHeight - 14;

  let cursorY = 18;

  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight > bottomLimit) {
      pdf.addPage();
      cursorY = 18;
    }
  };

  const drawPageTitle = () => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    drawText(pdf, "IP Portfolio Dashboard Report", margin, cursorY);
    cursorY += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    drawText(pdf, `Timeline: ${yearFrom}–${yearTo}`, margin, cursorY);
    cursorY += 5;
    drawText(pdf, `Mode: ${presetLabel}`, margin, cursorY);
    cursorY += 5;
    drawText(pdf, `Exported At: ${new Date().toLocaleString()}`, margin, cursorY);
    cursorY += 10;
  };

  drawPageTitle();

  for (const chart of chartExports) {
    try {
      const imgURI = await getChartImage(chart.chartId);

      const imgProps = pdf.getImageProperties(imgURI);
      const rawWidth = imgProps.width || 1;
      const rawHeight = imgProps.height || 1;

      const imageMaxWidth = contentWidth - 10;
      const imageMaxHeight = 95;

      let imgWidth = imageMaxWidth;
      let imgHeight = (rawHeight / rawWidth) * imgWidth;

      if (imgHeight > imageMaxHeight) {
        imgHeight = imageMaxHeight;
        imgWidth = (rawWidth / rawHeight) * imgHeight;
      }

      const labelRows = chart.labels?.length
        ? Math.ceil(
            chart.labels.reduce((rows, item, index, arr) => {
              return rows;
            }, 1),
          )
        : 0;

      const estimatedLabelsHeight = chart.labels?.length ? 14 : 0;
      const cardHeight =
        12 + // title area
        imgHeight +
        estimatedLabelsHeight +
        12;

      ensureSpace(cardHeight);

      pdf.setDrawColor(229, 231, 235);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, cursorY, contentWidth, cardHeight, 3, 3, "FD");

      let cardY = cursorY + 8;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(17, 24, 39);
      drawText(pdf, chart.title, margin + 6, cardY);

      cardY += 5;

      if (chart.subtitle) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(107, 114, 128);
        drawText(pdf, chart.subtitle, margin + 6, cardY);
        cardY += 5;
      }

      const imageX = margin + (contentWidth - imgWidth) / 2;
      pdf.addImage(imgURI, "PNG", imageX, cardY, imgWidth, imgHeight);

      cardY += imgHeight + 6;

      if (chart.labels?.length) {
        drawLabelChips(pdf, chart.labels, margin + 6, cardY, contentWidth - 12);
      }

      cursorY += cardHeight + 8;
    } catch {
      ensureSpace(16);

      pdf.setDrawColor(229, 231, 235);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, cursorY, contentWidth, 16, 3, 3, "FD");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(17, 24, 39);
      drawText(pdf, chart.title, margin + 6, cursorY + 6);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128);
      drawText(pdf, "This chart could not be exported.", margin + 6, cursorY + 11);

      cursorY += 24;
    }
  }

  ensureSpace(18);
  drawSectionHeader(pdf, "Detailed Breakdown", margin, cursorY);
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
      textColor: [31, 41, 55],
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [55, 65, 81],
      fontStyle: "bold",
    },
    footStyles: {
      fillColor: [249, 250, 251],
      textColor: [17, 24, 39],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: margin, right: margin },
  });

  pdf.addPage();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(17, 24, 39);
  drawText(pdf, "Raw Filtered Data", margin, 18);

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
      textColor: [31, 41, 55],
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [55, 65, 81],
      fontStyle: "bold",
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
    pdf.setTextColor(107, 114, 128);
    drawText(pdf, `Page ${i} of ${pageCount}`, pageWidth - 28, pageHeight - 8);
  }

  pdf.save(filename);
};