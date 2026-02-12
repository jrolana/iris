import { useState } from "react";
import { useGetUrlByStoragePath } from "@/hooks/attachments/useGenerateUrlByStoragePath";
import { AttachmentType } from "@/lib/types/application";

import {
  FileText,
  ImageIcon,
  LinkIcon,
  Loader,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Hint from "./Tooltip";
import UploadFileButton from "./UploadFileButton";
import { Button } from "../ui/button";
import { User } from "@supabase/supabase-js";

interface FileItemProps {
  file: AttachmentType["Row"];
  oldVersions: AttachmentType["Row"][];
  owner: User | null;
  isHistoryView?: boolean;
}

function getFileIcon(fileType: string) {
  if (fileType === "link") {
    return <LinkIcon className="h-7 w-7 text-blue-500" />;
  } else if (fileType === "Image") {
    return <ImageIcon className="h-7 w-7 text-purple-500" />;
  } else {
    return <FileText className="h-7 w-7 text-orange-500" />;
  }
}

export default function FileItem(props: FileItemProps) {
  const { file, owner, oldVersions, isHistoryView = false } = props;
  const { fetchUrl, isLoading: isFetchingUrl } = useGetUrlByStoragePath();
  const [isOpen, setIsOpen] = useState(false);

  async function handleDownloadAttachment(
    storagePath: string,
    fileName: string,
  ) {
    const downloadUrl = await fetchUrl({
      storagePath,
      fileName,
      action: "download",
    });
    globalThis.location.assign(downloadUrl);
  }

  async function handleViewAttachment(
    storagePath: string,
    fileName: string,
    fileType: string,
  ) {
    if (fileType === "link") {
      window.open(storagePath, "_blank");
      return;
    }
    const viewUrl = await fetchUrl({ storagePath, fileName, action: "view" });
    window.open(viewUrl, "_blank");
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-row items-center gap-3 overflow-x-hidden">
          <div className="shrink-0">{getFileIcon(file.file_type)}</div>
          <div className="flex min-w-0 flex-col">
            <Hint label={file.file_name}>
              <p className="text-md inline-block w-fit max-w-full truncate font-medium">
                {file.file_name}
              </p>
            </Hint>

            {file.file_description && (
              <Hint label={file.file_description}>
                <p className="mt-0.5 line-clamp-2 inline-block w-fit text-sm leading-tight text-slate-600">
                  {file.file_description}
                </p>
              </Hint>
            )}

            <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-400">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700 uppercase">
                {file.file_type}
              </span>
              <span>{new Date(file.uploaded_at!).toLocaleString()}</span>
            </p>
            {owner && owner.id !== file.owner_id && (
              <p className="mt-1 px-1 text-xs font-medium text-slate-400">
                {`by ${file.owner_name ?? "Unknown User"}`}
              </p>
            )}
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="shrink-0 pt-2 text-right">
          <div className="flex flex-wrap justify-end gap-2 text-sm">
            <Button
              type="button"
              variant="outline"
              className="disabled:bg-muted-200 flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 hover:bg-slate-100"
              disabled={isFetchingUrl}
              onClick={() =>
                handleViewAttachment(
                  file.storage_path,
                  file.file_name,
                  file.file_type,
                )
              }
            >
              {isFetchingUrl ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                "View"
              )}
            </Button>

            {file.file_type !== "link" && (
              <Button
                variant="outline"
                type="button"
                className="disabled:text-muted-foreground rounded-md border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 hover:bg-slate-100"
                disabled={isFetchingUrl}
                onClick={() =>
                  handleDownloadAttachment(file.storage_path, file.file_name)
                }
              >
                Download
              </Button>
            )}

            {/* only show update button button if not in history view */}
            {!isHistoryView && (
              <UploadFileButton
                currentFileType={file.file_type}
                disabled={isFetchingUrl}
                folderName={file.storage_path.split("/")[1]}
                className="disabled:text-muted-foreground flex flex-row gap-2 rounded-md border px-2 py-1 font-medium text-slate-600 hover:bg-slate-100"
              />
            )}
          </div>
        </div>
      </div>

      {/* accordion trigger when older versions exists. only shows when not in history view (in latest version)*/}
      {!isHistoryView && oldVersions && oldVersions.length > 0 && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="-ml-2 flex h-8 items-center gap-2 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {isOpen
              ? "Hide previous versions"
              : `Show ${oldVersions.length} previous versions`}
          </Button>
        </div>
      )}

      {isOpen && oldVersions && oldVersions.length > 0 && (
        <div className="animate-in slide-in-from-top-2 mt-2 ml-2 flex flex-col gap-4 border-l-2 border-slate-200 pt-2 pl-6 duration-200">
          {oldVersions.map((oldVersion) => (
            <FileItem
              key={oldVersion.id}
              file={oldVersion}
              oldVersions={[]} // pass empty just in case, to prevent nesting
              owner={owner}
              isHistoryView={true} // indicate that these are old versions (in accordion view)
            />
          ))}
        </div>
      )}
    </div>
  );
}
