"use client";

import React, { useMemo } from "react";
import {
  FileText,
  Send,
  Clock3,
  CheckCircle2,
  Undo2,
  ArrowDown,
  Shield,
  Shapes,
  Palette,
  BadgeCheck,
  Copyright,
  Inbox,
  CalendarRange,
  Layers3,
} from "lucide-react";
import { useGetDashboardAnalyticsTechgen } from "@/hooks/views/useGetDashboardAnalyticsTechgen";
import { IP_TYPE_ORDER, STATUS_ORDER } from "@/lib/dashboard/dashboard-summary";
import { ipTypeToTitle } from "@/lib/helper/get-ip-title";

type MetricCardProps = {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ElementType;
  emptyText?: string;
  isEmpty?: boolean;
};

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  emptyText = "No data yet",
  isEmpty = false,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
        <Icon className="h-6 w-6 text-gray-700" />
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>
        <p className="mt-1 text-xs text-gray-400">
          {isEmpty ? emptyText : subtitle}
        </p>
      </div>
    </div>
  );
}

type BreakdownItemProps = {
  label: string;
  value: number;
  total: number;
  icon?: React.ElementType;
};

function BreakdownItem({
  label,
  value,
  total,
  icon: Icon,
}: BreakdownItemProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-2 rounded-xl bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {Icon ? <Icon className="h-4 w-4" /> : null}
          <span>{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-gray-800"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500">
        {percentage}% of total applications
      </p>
    </div>
  );
}

type YearItemProps = {
  year: number;
  total: number;
  max: number;
};

function YearItem({ year, total, max }: YearItemProps) {
  const percentage = max > 0 ? Math.round((total / max) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{year}</span>
        <span className="font-semibold text-gray-900">{total}</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-gray-800"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

type EmptyPanelProps = {
  title: string;
  description: string;
  icon: React.ElementType;
};

function EmptyPanel({ title, description, icon: Icon }: EmptyPanelProps) {
  return (
    <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
        <Icon className="h-6 w-6 text-gray-500" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  );
}

export function Metrics() {
  const { data, isLoading } = useGetDashboardAnalyticsTechgen();
  console.log(data);

  const summary = useMemo(() => {
    const temp = {
      totalApplications: 0,
      filed: 0,
      pending: 0,
      granted: 0,
      withdrawn: 0,
      downgraded: 0,
    };

    if (!data || data.length == 0) {
      return temp;
    }

    temp.totalApplications = data?.reduce((acc, row) => {
      return acc + (row.total ?? 0);
    }, 0);

    for (const status of STATUS_ORDER) {
      const filteredRows = data.filter((row) => row.dashboard_status == status);

      temp[status as keyof typeof temp] = filteredRows.reduce((acc, row) => {
        return acc + (row.total ?? 0);
      }, 0);
    }

    return temp;
  }, [data]);

  const ipTypeIcon = {
    patent: Shield,
    utility_model: Shapes,
    industrial_design: Palette,
    copyright: Copyright,
    trademark: BadgeCheck,
  };

  const applicationsByType = useMemo(() => {
    const temp: { label: string; value: number; icon: any }[] = [];

    if (!data || data.length == 0) {
      return temp;
    }

    for (const ipType of IP_TYPE_ORDER) {
      const filteredRows = data.filter((row) => row.ip_type == ipType);

      const value = filteredRows.reduce((acc, row) => {
        return acc + (row.total ?? 0);
      }, 0);

      temp.push({
        label: ipTypeToTitle(ipType),
        value,
        icon: ipTypeIcon[ipType],
      });
    }

    return temp;
  }, [data]);

  const applicationsByYear = useMemo(() => {
    const temp: Record<number, number> = {};

    if (!data || data.length == 0) {
      return [];
    }

    data.forEach((item) => {
      if (!item || !item.year) return;

      const year = item.year;

      temp[year] = (temp[year] ?? 0) + (item.total ?? 0);
    });

    return temp;
  }, [data]);

  const hasApplications = summary.totalApplications > 0;
  const highestYearTotal =
    Object.keys(applicationsByYear).length > 0
      ? Math.max(...Object.values(applicationsByYear))
      : 0;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Total Applications"
          value={summary.totalApplications}
          subtitle="All IP applications recorded"
          emptyText="No applications recorded yet"
          icon={FileText}
          isEmpty={!hasApplications}
        />
        <MetricCard
          title="Filed"
          value={summary.filed}
          subtitle="Applications formally filed"
          emptyText="No filed applications yet"
          icon={Send}
          isEmpty={!hasApplications}
        />
        <MetricCard
          title="Pending"
          value={summary.pending}
          subtitle="Currently under review or processing"
          emptyText="No pending applications yet"
          icon={Clock3}
          isEmpty={!hasApplications}
        />
        <MetricCard
          title="Granted"
          value={summary.granted}
          subtitle="Applications successfully granted"
          emptyText="No granted applications yet"
          icon={CheckCircle2}
          isEmpty={!hasApplications}
        />
        <MetricCard
          title="Withdrawn"
          value={summary.withdrawn}
          subtitle="Applications withdrawn"
          emptyText="No withdrawn applications yet"
          icon={Undo2}
          isEmpty={!hasApplications}
        />
        <MetricCard
          title="Downgraded"
          value={summary.downgraded}
          subtitle="Applications moved to a lower IP type"
          emptyText="No downgraded applications yet"
          icon={ArrowDown}
          isEmpty={!hasApplications}
        />
      </div>

      {/* Breakdown panels */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Applications by IP Type
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Distribution of your filings across IP categories
            </p>
          </div>

          {hasApplications && applicationsByType.length > 0 ? (
            <div className="space-y-3">
              {applicationsByType.map((item) => (
                <BreakdownItem
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  total={summary.totalApplications}
                  icon={item.icon}
                />
              ))}
            </div>
          ) : (
            <EmptyPanel
              title="No IP type data yet"
              description="Once applications are recorded, their distribution across patent, utility model, industrial design, trademark, and copyright will appear here."
              icon={Layers3}
            />
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Applications by Year
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Filing activity over the years
            </p>
          </div>

          {hasApplications && Object.keys(applicationsByYear).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(applicationsByYear).map(([year, total]) => (
                <YearItem
                  key={year}
                  year={Number(year)}
                  total={total}
                  max={highestYearTotal}
                />
              ))}
            </div>
          ) : (
            <EmptyPanel
              title="No yearly activity yet"
              description="Application activity by year will appear here once at least one IP application has been recorded."
              icon={CalendarRange}
            />
          )}
        </div>
      </div>

      {!hasApplications && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Inbox className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                No applications yet
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                When this TechGen starts submitting intellectual property
                applications, the dashboard metrics and breakdowns will appear
                here.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
