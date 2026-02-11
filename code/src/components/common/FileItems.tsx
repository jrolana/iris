import { useDeleteFileByStoragePath } from "@/hooks/attachments/useDeleteFileByStoragePath";
import { useGetUrlByStoragePath } from "@/hooks/attachments/useGenerateUrlByStoragePath";
import { AttachmentType } from "@/lib/types/application";

import { FileText, ImageIcon, LinkIcon, Loader } from "lucide-react";
import Hint from "./Tooltip";
import UploadFileButton from "./UploadFileButton";
import { Button } from "../ui/button";

interface FileItemProps {
  file: AttachmentType["Row"];
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
  const { file } = props;
  const { fetchUrl, isLoading: isFetchingUrl } = useGetUrlByStoragePath();
  // const { deleteFile, isLoading: isDeletingFile } =
  //   useDeleteFileByStoragePath();

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
      // For links, the storagePath is actually the URL
      window.open(storagePath, "_blank");
      return;
    }
    const viewUrl = await fetchUrl({ storagePath, fileName, action: "view" });
    window.open(viewUrl, "_blank");
  }

  return (
    <>
      <div className="flex flex-row items-center gap-3 overflow-x-hidden">
        {getFileIcon(file.file_type)}
        <div className="min-w-0 flex-1">
          <Hint label={file.file_name}>
            <p className="text-md truncate font-medium text-slate-900">
              {file.file_name}
            </p>
          </Hint>
          {file.file_description && (
            <p className="mt-0.5 line-clamp-2 text-sm leading-tight text-slate-600">
              {file.file_description}
            </p>
          )}

          <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-400">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700 uppercase">
              {file.file_type}
            </span>
            <span>{new Date(file.uploaded_at!).toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* action buttons */}
      <div className="text-right">
        <div className="flex w-[250px] shrink-0 flex-wrap gap-2 text-sm">
          <Button
            type="button"
            variant="outline"
            className="disabled:bg-muted-200 flex w-[50px] items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-600 hover:bg-slate-100"
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
              <Loader className="animate-spin" size={20} />
            ) : (
              "View"
            )}
          </Button>
          {file.file_type !== "link" && (
            <Button
              variant="outline"
              type="button"
              className="disabled:text-muted-foreground rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-600 hover:bg-slate-100"
              disabled={isFetchingUrl}
              onClick={() =>
                handleDownloadAttachment(file.storage_path, file.file_name)
              }
            >
              Download
            </Button>
          )}
          {/* {file.owner_id === user?.id && (
                <button
                type="button"
                onClick={() =>
                handleDeleteAttachment(file.storage_path, file.file_name)
                }
                className="disabled:text-muted-foreground rounded-md border border-red-100 bg-red-50 px-2 py-1 font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-slate-200"
                disabled={isDeletingFile || isFetchingUrl}
                >
                {isDeletingFile ? (
                    <Loader className="animate-spin" size={20} />
                    ) : (
                        "Delete"
                        )}
                        </button>
                        )} */}
          <UploadFileButton
            currentFileType={file.file_type}
            disabled={isFetchingUrl}
            folderName={file.storage_path.split("/")[1]}
            className="disabled:text-muted-foreground flex flex-row gap-2 rounded-md border px-2 py-1 font-medium text-slate-600 hover:bg-slate-100"
          />
        </div>
        <p className="px-4 py-1 text-sm font-medium text-slate-700">
          by {`${file.owner_name ?? "Unknown User"}`}
        </p>
      </div>
    </>
  );
}
