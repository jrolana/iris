import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  STATUS_ORDER,
  DASHBOARD_STATUS_LABELS,
  SummaryTableRow,
  SummaryTotals,
  formatIpTypeLabel,
} from "@/lib/dashboard/dashboard-summary";

interface DashboardSummaryTableProps {
  rows: SummaryTableRow[];
  totals: SummaryTotals;
  yearFrom: number;
  yearTo: number;
}

const DashboardSummaryTable: React.FC<DashboardSummaryTableProps> = ({
  rows,
  totals,
  yearFrom,
  yearTo,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Detailed Breakdown
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Exact totals by IP type for the selected timeline ({yearFrom}–{yearTo}
          ).
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b border-gray-200">
              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase"
              >
                Year
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase"
              >
                IP Type
              </TableCell>

              {STATUS_ORDER.map((status) => (
                <TableCell
                  key={status}
                  isHeader
                  className="px-5 py-3 text-right text-xs font-semibold tracking-wide text-gray-500 uppercase"
                >
                  {DASHBOARD_STATUS_LABELS[status]}
                </TableCell>
              ))}

              <TableCell
                isHeader
                className="px-5 py-3 text-right text-xs font-semibold tracking-wide text-gray-500 uppercase"
              >
                Total
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length > 0 ? (
              <>
                {rows.map((row) => (
                  <TableRow
                    key={`${row.year}-${row.ipType}`}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800">
                      {row.year}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800">
                      {formatIpTypeLabel(row.ipType)}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-right text-sm text-gray-700">
                      {row.filed}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right text-sm text-gray-700">
                      {row.pending}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right text-sm text-gray-700">
                      {row.granted}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right text-sm text-gray-700">
                      {row.withdrawn}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right text-sm text-gray-700">
                      {row.downgraded}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                      {row.total}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className="bg-gray-50">
                  <TableCell className="px-5 py-4 text-sm font-semibold text-gray-900">
                    {yearFrom}–{yearTo}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm font-semibold text-gray-900">
                    Grand Total
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                    {totals.filed}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                    {totals.pending}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                    {totals.granted}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                    {totals.withdrawn}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                    {totals.downgraded}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                    {totals.total}
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={STATUS_ORDER.length + 3}
                  className="px-5 py-10 text-center text-sm text-gray-500"
                >
                  No data available for the selected timeline.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardSummaryTable;
