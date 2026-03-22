"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  Download,
  Eye,
  FileArchive,
  FileCode2,
  FileImage,
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { useGetPublicResourcesByIpType } from "@/hooks/public-resources/useGetPublicResourcesByIpType";
import { IpType } from "@/lib/types/ip";

type FileAction = "view" | "download";

interface DisclosureFormActionsProps {
  title: string;
  description: string;
  finalIpType: IpType | null;
  canProceed?: boolean;
  onProceed?: () => void;
  proceedLabel?: string;
  proceedHint?: string;
  showHeader?: boolean;
  showProceed?: boolean;
  filesTitle?: string | null;
  showFooterNote?: boolean;
}

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

function formatFileSize(size?: number) {
  if (typeof size !== "number") return null;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DisclosureFormActions(
  props: DisclosureFormActionsProps,
) {
  const {
    title,
    description,
    finalIpType,
    canProceed = true,
    onProceed,
    proceedLabel = "Proceed to application",
    proceedHint = "You can still update the details during review.",
    showHeader = true,
    showProceed = true,
    filesTitle = "Documents",
    showFooterNote = true,
  } = props;

  const { files, isLoading } = useGetPublicResourcesByIpType({
    ipType: finalIpType,
  });

  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  async function handleFileAction(
    file: {
      fullPath: string;
      name: string;
      viewUrl: string;
      downloadUrl: string;
      size?: number;
    },
    action: FileAction,
  ) {
    const actionKey = `${file.fullPath}-${action}`;
    setActiveActionKey(actionKey);

    try {
      const fileUrl = action === "view" ? file.viewUrl : file.downloadUrl;

      if (!fileUrl) {
        toast.error("Unable to access file", {
          description:
            "The file URL could not be generated. Please check the configured public resource path.",
        });
        return;
      }

      if (action === "view") {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const anchor = document.createElement("a");
      anchor.href = fileUrl;
      anchor.download = file.name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      console.error(error);

      toast.error(
        action === "view" ? "Failed to open file" : "Failed to download file",
        {
          description:
            "There was a problem accessing the file. Please try again.",
        },
      );
    } finally {
      setActiveActionKey(null);
    }
  }

  return (
    <section className="space-y-4">
      <div
        className={clsx(
          showHeader
            ? "rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700"
            : "bg-white",
        )}
      >
        {showHeader ? (
          <>
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-lg/snug text-slate-700">{description}</p>
          </>
        ) : null}

        <div
          className={clsx(
            "rounded-xl border border-slate-200 bg-white",
            showHeader ? "mt-5 p-4" : "border-0 p-0",
          )}
        >
          {filesTitle ? (
            <h4 className="text-base font-semibold text-slate-900">
              {filesTitle}
            </h4>
          ) : null}

          {isLoading ? (
            <div
              className={clsx(
                "flex items-center gap-2 text-sm text-slate-500",
                filesTitle ? "mt-3" : "",
              )}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading files...
            </div>
          ) : files.length === 0 ? (
            <div
              className={clsx(
                "rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500",
                filesTitle ? "mt-3" : "",
              )}
            >
              No files are configured yet for this protection type.
            </div>
          ) : (
            <>
              <ul
                className={clsx(
                  "divide-y divide-slate-100",
                  filesTitle ? "mt-3" : "",
                )}
              >
                {files.map((file) => {
                  const isViewing = activeActionKey === `${file.fullPath}-view`;
                  const isDownloading =
                    activeActionKey === `${file.fullPath}-download`;
                  const isBusy = isViewing || isDownloading;

                  return (
                    <li
                      key={file.fullPath}
                      className="grid gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="shrink-0 rounded-xl bg-slate-100 p-2.5">
                          {getFileIcon(file.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {file.name}
                          </p>

                          {formatFileSize(file.size) ? (
                            <p className="mt-0.5 text-xs text-slate-500">
                              {formatFileSize(file.size)}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => handleFileAction(file, "view")}
                          disabled={isBusy}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-auto"
                        >
                          {isViewing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleFileAction(file, "download")}
                          disabled={isBusy}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-auto"
                        >
                          {isDownloading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Download
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {showFooterNote ? (
                <p className="mt-3 text-xs/tight text-slate-500">
                  Review the relevant files carefully before moving on to your
                  application.
                </p>
              ) : null}
            </>
          )}
        </div>

        {showProceed ? (
          <div className="mt-4">
            <button
              type="button"
              onClick={onProceed}
              disabled={!canProceed}
              className="w-full rounded-md bg-sky-600 px-4 py-2 text-center text-base font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {proceedLabel}
            </button>
            <p className="mt-2 text-xs/tight text-slate-500">{proceedHint}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
