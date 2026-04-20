import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  SummaryTableRow,
  SummaryTotals,
  formatIpTypeLabel,
} from "@/lib/dashboard/dashboard-summary";

type ExportDashboardCsvParams = {
  yearFrom: number;
  yearTo: number;
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
  hasData?: boolean;
};

type ExportDashboardPdfParams = {
  filename: string;
  yearFrom: number;
  yearTo: number;
  chartExports: ChartExportItem[];
  summaryTableRows: SummaryTableRow[];
  summaryTotals: SummaryTotals;
  includeWatermark?: boolean;
};

type ApexDataUriResult = {
  imgURI: string;
};

const UNIVERSITY_NAME = "University Of The Philippines Visayas";
const UPV_LOGO_PATH = "/images/upv-logo.png";

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
  summaryTableRows,
  summaryTotals,
}: ExportDashboardCsvParams) => {
  const lines: string[] = [];

  lines.push("IP Portfolio Dashboard Export");
  lines.push(`Timeline,${escapeCsvValue(`${yearFrom}-${yearTo}`)}`);
  lines.push(`Exported At,${escapeCsvValue(new Date().toISOString())}`);
  lines.push("");

  lines.push("SUMMARY TABLE");
  lines.push("Year,IP Type,Filed,Pending,Granted,Withdrawn,Downgraded,Total");

  summaryTableRows.forEach((row) => {
    lines.push(
      [
        escapeCsvValue(row.year),
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
      escapeCsvValue(`${yearFrom}-${yearTo}`),
      escapeCsvValue("Grand Total"),
      escapeCsvValue(summaryTotals.filed),
      escapeCsvValue(summaryTotals.pending),
      escapeCsvValue(summaryTotals.granted),
      escapeCsvValue(summaryTotals.withdrawn),
      escapeCsvValue(summaryTotals.downgraded),
      escapeCsvValue(summaryTotals.total),
    ].join(","),
  );

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

const getImageDataUri = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load image: ${path}`);
  }

  const blob = await response.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
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

const drawUniversityLogo = (
  pdf: jsPDF,
  logoDataUri: string | null,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number,
) => {
  if (logoDataUri) {
    const imageProps = pdf.getImageProperties(logoDataUri);
    const rawWidth = imageProps.width || 1;
    const rawHeight = imageProps.height || 1;
    const ratio = Math.min(maxWidth / rawWidth, maxHeight / rawHeight);
    const width = rawWidth * ratio;
    const height = rawHeight * ratio;

    pdf.addImage(logoDataUri, "PNG", x, y, width, height);
    return;
  }

  pdf.setDrawColor(22, 101, 52);
  pdf.setFillColor(240, 253, 244);
  pdf.circle(x + maxHeight / 2, y + maxHeight / 2, maxHeight / 2, "FD");
};

const drawWatermark = (pdf: jsPDF, pageWidth: number, pageHeight: number) => {
  pdf.saveGraphicsState();
  pdf.setGState(pdf.GState({ opacity: 0.12 }));
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(107, 114, 128);
  drawText(pdf, UNIVERSITY_NAME, pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: -30,
  });
  pdf.restoreGraphicsState();
};

const drawNoChartCard = (
  pdf: jsPDF,
  title: string,
  subtitle: string | undefined,
  margin: number,
  cursorY: number,
  contentWidth: number,
) => {
  const cardHeight = subtitle ? 24 : 20;

  pdf.setDrawColor(229, 231, 235);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, cursorY, contentWidth, cardHeight, 3, 3, "FD");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(17, 24, 39);
  drawText(pdf, title, margin + 6, cursorY + 7);

  if (subtitle) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    drawText(pdf, subtitle, margin + 6, cursorY + 12);
  }

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  drawText(
    pdf,
    "No chart available for the selected range.",
    margin + 6,
    cursorY + (subtitle ? 18 : 13),
  );

  return cardHeight;
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
  chartExports,
  summaryTableRows,
  summaryTotals,
  includeWatermark = true,
}: ExportDashboardPdfParams) => {
  if (typeof window === "undefined") return;

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const bottomLimit = pageHeight - 14;
  const logoDataUri = await getImageDataUri(UPV_LOGO_PATH).catch(() => null);

  let cursorY = 18;

  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight > bottomLimit) {
      pdf.addPage();
      cursorY = 18;
    }
  };

  const drawPageTitle = () => {
    drawUniversityLogo(pdf, logoDataUri, margin, cursorY - 8, 100, 100);
    cursorY += 25;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(17, 24, 39);
    drawText(pdf, UNIVERSITY_NAME, margin, cursorY);

    pdf.setFontSize(15);
    drawText(pdf, "IP Portfolio Dashboard Report", margin, cursorY + 7);
    cursorY += 14;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    drawText(pdf, `Range: ${yearFrom}–${yearTo}`, margin, cursorY);
    cursorY += 5;
    drawText(
      pdf,
      `Exported At: ${new Date().toLocaleString()}`,
      margin,
      cursorY,
    );
    cursorY += 10;
  };

  drawPageTitle();

  for (const chart of chartExports) {
    if (chart.hasData === false) {
      ensureSpace(26);
      const cardHeight = drawNoChartCard(
        pdf,
        chart.title,
        chart.subtitle,
        margin,
        cursorY,
        contentWidth,
      );
      cursorY += cardHeight + 8;
      continue;
    }

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

      const estimatedLabelsHeight = chart.labels?.length ? 14 : 0;
      const cardHeight = 12 + imgHeight + estimatedLabelsHeight + 12;

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
      ensureSpace(26);
      const cardHeight = drawNoChartCard(
        pdf,
        chart.title,
        chart.subtitle,
        margin,
        cursorY,
        contentWidth,
      );
      cursorY += cardHeight + 8;
    }
  }

  ensureSpace(18);
  drawSectionHeader(
    pdf,
    `Detailed Breakdown (${yearFrom}–${yearTo})`,
    margin,
    cursorY,
  );
  cursorY += 4;

  autoTable(pdf, {
    startY: cursorY,
    head: [
      [
        "Year",
        "IP Type",
        "Filed",
        "Pending",
        "Granted",
        "Withdrawn",
        "Downgraded",
        "Total",
      ],
    ],
    body: [
      ...summaryTableRows.map((row) => [
        row.year,
        formatIpTypeLabel(row.ipType),
        row.filed,
        row.pending,
        row.granted,
        row.withdrawn,
        row.downgraded,
        row.total,
      ]),
      [
        `${yearFrom}-${yearTo}`,
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
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: margin, right: margin },
  });

  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    pdf.setPage(i);
    if (includeWatermark) {
      drawWatermark(pdf, pageWidth, pageHeight);
    }
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    drawText(pdf, `Page ${i} of ${pageCount}`, pageWidth - 28, pageHeight - 8);
  }

  pdf.save(filename);
};
