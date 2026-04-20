"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";

import {
  ipClassificationTree,
  WizardNode,
  WizardOption,
  WizardResult,
} from "@/lib/structs/classification";
import { ADMIN_EMAIL } from "@/lib/constants/admin";

type ClassificationWizardProps = {
  onFinished: (result: WizardResult) => void;
  resetResult: Dispatch<SetStateAction<WizardResult | null>>;
};

export default function ClassificationWizard(props: ClassificationWizardProps) {
  const { onFinished, resetResult } = props;
  const [currentNodeId, setCurrentNodeId] = useState<string>("root");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>([]); // history of nodeIds

  const currentNode: WizardNode = ipClassificationTree[currentNodeId];
  const isLeaf = Boolean(currentNode.result);

  const handleNext = () => {
    // If we are at a leaf, finish the wizard.
    if (currentNode.result) {
      onFinished(currentNode.result);
      return;
    }
    if (!selectedOptionId || !currentNode.options) return;

    const chosen = currentNode.options.find(
      (opt: WizardOption) => opt.id === selectedOptionId,
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

  return (
    <div className="border-slate-200 bg-white p-2">
      <section className="">
        <div className="">
          <h3 className="text-lg font-medium text-slate-900">
            {currentNode.question}
          </h3>
          {currentNode.helperText && (
            <p className="text-md text-slate-500">{currentNode.helperText}</p>
          )}
        </div>

        {/* If leaf is reached, show the recommendation */}
        {isLeaf && currentNode.result ? (
          <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">
              Recommended disclosure form
            </p>
            <p className="text-md mt-1 font-semibold text-emerald-900">
              {currentNode.result.formName}
            </p>
            <p className="text-md mt-2 text-emerald-900">
              {currentNode.result.summary}
            </p>
            <p className="mt-3 text-sm text-emerald-800">
              This is a starting recommendation based on your answers. TTBDO
              will still perform a formal evaluation and may refine this
              classification.
            </p>
            <p className="mt-3 text-sm text-gray-500">
              If you are still unsure about the proper disclosure form after
              this, you may contact {ADMIN_EMAIL} for a consultation before
              proceeding.
            </p>
          </div>
        ) : (
          // Otherwise show options as conversational choices
          <div className="mt-5 space-y-2">
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              {currentNode.options?.map((option: WizardOption) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOptionId(option.id)}
                    className={clsx(
                      "flex h-full flex-col items-start rounded-lg border p-3 text-left transition",
                      isSelected
                        ? "border-sky-500 bg-sky-50 text-sky-900"
                        : "border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-300 hover:bg-sky-50",
                    )}
                  >
                    <span className="font-bold">{option.label}</span>
                    {option.description && (
                      <span className="text-md mt-1 text-slate-600">
                        {option.description}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-slate-500">
              Choose the option that best matches your research output. You can
              always go back and adjust your answer.
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={path.length === 0}
            className={clsx(
              "rounded-md border px-3 py-2 text-sm font-semibold",
              path.length === 0
                ? "cursor-not-allowed border-slate-200 text-slate-300"
                : "border-slate-300 text-slate-700 hover:bg-slate-50",
            )}
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-200"
            disabled={!isLeaf && !selectedOptionId}
          >
            {isLeaf ? "Use this recommendation" : "Next"}
          </button>
        </div>
      </section>
    </div>
  );
}
