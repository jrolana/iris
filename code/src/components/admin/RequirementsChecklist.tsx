"use client";
import {
  FileArchive,
  FileCode2,
  FileImage,
  FileSpreadsheet,
  FileText,
  Loader,
} from "lucide-react";
import { Button } from "../ui/button";
import Hint from "../common/Tooltip";

interface RequirementsChecklistProps {
  requirements: {
    requirement: string;
    filename: string;
  }[];
  setRequirements: React.Dispatch<React.SetStateAction<string[]>>;
  existingRequirements?: string[];
  selectedRequirements?: string[];
}

export default function RequirementsChecklist(
  props: RequirementsChecklistProps,
) {
  const {
    requirements,
    setRequirements,
    existingRequirements,
    selectedRequirements,
  } = props;
  const isLoading = false;

  function getFileIcon(fileName: string) {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-slate-600" />;
      case "xls":
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className="h-5 w-5 text-slate-600" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
      case "svg":
        return <FileImage className="h-5 w-5 text-slate-600" />;
      case "zip":
      case "rar":
      case "7z":
        return <FileArchive className="h-5 w-5 text-slate-600" />;
      case "json":
      case "xml":
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <FileCode2 className="h-5 w-5 text-slate-600" />;
      default:
        return <FileText className="h-5 w-5 text-slate-600" />;
    }
  }

  function handleRequireClick(requirement: string) {
    setRequirements((prev) =>
      prev.filter((r) => r !== requirement).concat(requirement),
    );
  }

  function handleUnrequireClick(requirement: string) {
    setRequirements((prev) => prev.filter((r) => r !== requirement));
  }

  function renderRequirementButton(req: {
    requirement: string;
    filename: string;
  }) {
    if (existingRequirements?.includes(req.requirement)) {
      return (
        <div className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-300 px-4 py-2 text-sm font-semibold">
          Required
        </div>
      );
    } else if (selectedRequirements?.includes(req.requirement)) {
      return (
        <Button
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-green-700 bg-green-700 px-4 py-2 text-sm font-semibold hover:bg-transparent hover:text-green-700"
          onClick={() => handleUnrequireClick(req.requirement)}
        >
          Selected
        </Button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleRequireClick(req.requirement)}
        disabled={false}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-auto"
      >
        {isLoading && <Loader className="h-4 w-4 animate-spin" />}
        Require
      </button>
    );
  }

  function renderRequirementItem(req: {
    requirement: string;
    filename: string;
  }) {
    return (
      <li
        key={req.filename}
        className="grid gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl bg-slate-100 p-2.5">
            {getFileIcon(req.filename)}
          </div>

          <div className="min-w-0">
            <Hint label={req.filename}>
              <p className="truncate text-sm font-semibold text-slate-900">
                {req.filename}
              </p>
            </Hint>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
          {renderRequirementButton(req)}
        </div>
      </li>
    );
  }

  return <ul>{requirements.map((req) => renderRequirementItem(req))}</ul>;
}
