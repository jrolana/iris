'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import clsx from 'clsx';

import {
  ipClassificationTree,
  WizardNode,
  WizardOption,
  WizardResult,
} from '@/lib/structs/classification';

type ClassificationWizardProps = {
  onFinished: (result: WizardResult) => void;
  resetResult: Dispatch<SetStateAction<WizardResult | null>>;
};

export default function ClassificationWizard(props : ClassificationWizardProps){
  const {onFinished, resetResult} = props;
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>([]); // history of nodeIds

  const currentNode: WizardNode = ipClassificationTree[currentNodeId];

  const handleNext = () => {
    if (currentNode.result) {
      onFinished(currentNode.result);
      return;
    }
    if (!selectedOptionId || !currentNode.options) return;

    const chosen = currentNode.options.find(
      (opt: WizardOption) => opt.id === selectedOptionId
    );
    if (!chosen) return;

    setPath((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(chosen.nextNodeId);
    setSelectedOptionId(null);
  };

  const handleBack = () => {
    if (path.length === 0) return;
    const newPath = [...path];
    const prevNodeId = newPath.pop()!;
    setPath(newPath);
    setCurrentNodeId(prevNodeId);
    resetResult(null);
    setSelectedOptionId(null);
  };

  const isLeaf = Boolean(currentNode.result);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        IP Classification Guide
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Answer a few quick questions to find the most suitable disclosure form.
      </p>

      <div className="mt-6 space-y-3">
        <h3 className="text-base font-medium text-slate-900">
          {currentNode.question}
        </h3>
        {currentNode.helperText && (
          <p className="text-xs text-slate-500">{currentNode.helperText}</p>
        )}
      </div>

      {/* If leaf is reached, show the recommendation */}
      {isLeaf && currentNode.result ? (
        <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Recommended Disclosure Form
          </p>
          <p className="mt-1 text-sm font-semibold text-emerald-900">
            {currentNode.result.formName}
          </p>
          <p className="mt-2 text-sm text-emerald-900">
            {currentNode.result.summary}
          </p>
          <p className="mt-3 text-xs text-emerald-800">
            Note: TTBDO will still perform a formal evaluation and may refine
            this classification.
          </p>
          <p className='mt-3 text-xs text-gray-500'>
            If you are still unsure about the proper disclosure form after this, 
            then you can try and contact the TTBDO for a consultation!
          </p>
        </div>
      ) : (
        // Otherwise show options
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {currentNode.options?.map((option: WizardOption) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOptionId(option.id)}
                className={clsx(
                  'flex h-full flex-col items-start rounded-lg border p-3 text-left text-sm transition',
                  isSelected ? 'border-sky-500 bg-sky-50 text-sky-900' : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50',
                )}
              >
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="mt-1 text-xs text-slate-600">
                    {option.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={path.length === 0}
          className={clsx(
            'rounded-md border px-3 py-2 text-xs font-medium',
            path.length === 0 ? 'cursor-not-allowed border-slate-200 text-slate-300' : 'border-slate-300 text-slate-700 hover:bg-slate-50',
          )}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-200"
          disabled={!isLeaf && !selectedOptionId}
        >
          {isLeaf ? 'Use this recommendation' : 'Next'}
        </button>
      </div>
    </div>
  );
};
