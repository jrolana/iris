'use client';

import React from 'react';
import { StatusType } from '@/lib/types/ip';
import { IprStatus } from '@/lib/types/status';
import clsx from 'clsx';



// Re-usable text labels for statuses
export const STATUS_LABELS: Partial<Record<StatusType, string>> = {
  draft_classification: 'Draft – Classification in progress',
  draft_idf: 'Draft – IDF in progress',
  submitted_to_ttbdo: 'Submitted to TTBDO',
  under_ttbdo_review: 'Under TTBDO review',
  prior_art_search: 'Prior art search',
  draft_application: 'Drafting IPOPHL application',
  filed_with_ipophil: 'Filed with IPOPHL',
  wait_registrability_report: 'Waiting for registrability report',
  wait_formality_exam_report: 'Waiting for formality exam report',
  wait_substantive_exam_report: 'Waiting for substantive exam report',
  wait_notice_publication: 'Waiting for notice of publication',
  registered: 'Registered',
  closed: 'Closed',
};

interface StatusHistoryPanelProps {
  statuses: IprStatus[];
  currentStatusType: StatusType;
  variant?: 'techgen' | 'ttbdo';
  className?: string;
  // For TTBDO only – triggers the “unsaved changes” flow
  onStartStatusUpdate?: () => void;
};

export default function StatusHistoryPanel(props: StatusHistoryPanelProps){
    const { statuses, currentStatusType, variant = 'techgen', className = '', onStartStatusUpdate } = props;
    if (!statuses || statuses.length === 0) {
        return (
        <div
            className={
            'rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 ' +
            className
            }
        >
            <h2 className="text-sm font-semibold text-slate-900">
            Status history
            </h2>
            <p className="mt-2">
            No status records yet. TTBDO updates will appear here once the
            application starts moving through the process.
            </p>
        </div>
        );
    }

    const sortedStatuses = [...statuses].sort(
        (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const latestStatus = sortedStatuses[0];

    return (
        <div
        className={
            'rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-sm ' +
            className
        }
        >
        <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
            Status history
            </h2>
            {variant === 'ttbdo' && onStartStatusUpdate && (
            <button
                type="button"
                onClick={onStartStatusUpdate}
                className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700 hover:bg-sky-100"
            >
                Update status
            </button>
            )}
        </div>

        {latestStatus?.note && (
            <div className="mt-1 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
            <p className="font-semibold">
                {variant === 'ttbdo'
                ? 'Latest note for records'
                : 'Latest note from TTBDO'}
            </p>
            <p className="mt-1">{latestStatus.note}</p>
            {latestStatus.deadline && (
                <p className="mt-1 text-[11px] font-medium">
                Deadline:{' '}
                {new Date(latestStatus.deadline).toLocaleDateString()}
                </p>
            )}
            </div>
        )}

        <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
            {sortedStatuses.map((status) => {
            const label =
                STATUS_LABELS[status.status_type] ?? status.status_type;
            const isCurrent = status.status_type === currentStatusType;
            const isLatest = status.statusId === latestStatus?.statusId;

            return (
                <div
                    key={status.statusId}
                    className={clsx(
                        'flex items-start justify-between gap-3 rounded-lg border px-3 py-2',
                        isCurrent ? 'border-sky-300 bg-sky-50' : 'border-slate-100 bg-slate-50',
                    )}
                >
                <div className="flex-1">
                    <p className="text-[11px] font-semibold text-slate-800">
                    {label}
                    {isCurrent && (
                        <span className="ml-1 rounded-full bg-sky-100 px-2 py-px text-[9px] font-medium uppercase text-sky-700">
                        Current
                        </span>
                    )}
                    {isLatest && !isCurrent && (
                        <span className="ml-1 rounded-full bg-amber-100 px-2 py-px text-[9px] font-medium uppercase text-amber-800">
                        Latest
                        </span>
                    )}
                    </p>
                    {status.note && !isLatest && (
                    <p className="mt-1 line-clamp-2 text-[11px] text-slate-600">
                        {status.note}
                    </p>
                    )}
                    {status.deadline && (
                    <p className="mt-1 text-[10px] text-slate-500">
                        Deadline:{' '}
                        {new Date(status.deadline).toLocaleDateString()}
                    </p>
                    )}
                </div>
                <p className="shrink-0 text-[10px] text-slate-500">
                    {new Date(status.created_at).toLocaleString()}
                </p>
                </div>
            );
            })}
        </div>
        </div>
    );
    };
