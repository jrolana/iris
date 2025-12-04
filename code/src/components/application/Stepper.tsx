'use client';

import React from 'react';
import { ipApplicationFlows } from '@/lib/structs/ip-flow';
import { IpType, StatusType } from '@/lib/types/ip';
import clsx from 'clsx';

interface ApplicationStepperProps {
  ipType: IpType;
  statusType: StatusType;
}

export default function ApplicationStepper(props: ApplicationStepperProps) {
  const { ipType, statusType } = props;
  const steps = ipApplicationFlows[ipType];
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.statusTypes.includes(statusType))
  );

  return (
    // horizontal scroll container on narrow screens
    <div className="w-full overflow-x-auto pb-1">
      <ol className="flex min-w-[520px] items-stretch gap-3 px-1 sm:min-w-0 sm:gap-4 sm:px-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <li
              key={step.id}
              className='flex items-centerflex-none sm:flex-1 items-start' // steps get equal width on desktop, scroll on mobile
            >
              {/* each step item */}
              <div className="flex w-full flex-col items-center text-center">
                <div
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors sm:h-9 sm:w-9',
                    isCompleted && 'border-emerald-500 bg-emerald-500 text-white',
                    isActive && !isCompleted && 'border-sky-600 bg-sky-50 text-sky-700',
                    !isCompleted && !isActive && 'border-slate-300 bg-white text-slate-400'
                  )}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className="mt-2 line-clamp-2 font-medium leading-tight text-slate-700 text-sm truncate">
                  {step.label}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={clsx(
                    'mx-2 hidden h-0.5 flex-1 rounded-full sm:block',
                    index < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
