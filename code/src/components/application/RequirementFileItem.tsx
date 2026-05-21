import { useGetUrlByStoragePath } from "@/hooks/attachments/useGenerateUrlByStoragePath";
import { formatDateTime } from "@/lib/helper/format-date";
import { RequirementWithAttachment } from "@/lib/types/requirements";
import { Button } from "@/components/ui/button";
import Hint from "@/components/common/Tooltip";
import { FileText, ImageIcon, LinkIcon, Loader } from "lucide-react";

interface RequirementFileItemProps {
  requirement: RequirementWithAttachment;
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

export default function RequirementFileItem(props: RequirementFileItemProps) {
  const { requirement } = props;
  const { attachment } = requirement;
  const { fetchUrl, isLoading: isFetchingUrl } = useGetUrlByStoragePath();

  if (!attachment) {
    return (
      <p className="mt-2 text-xs font-medium text-slate-500">
        Uploaded file details unavailable.
      </p>
    );
  }

  const modifiedAt = attachment.modified_at ?? attachment.uploaded_at;

  async function handleDownloadAttachment() {
    if (!attachment || attachment.file_type === "link") return;
    const downloadUrl = await fetchUrl({
      storagePath: attachment.storage_path,
      fileName: attachment.file_name,
      action: "download",
    });
    globalThis.location.assign(downloadUrl);
  }

  async function handleViewAttachment() {
    if (!attachment) return;
    if (attachment.file_type === "link") {
      window.open(attachment.storage_path, "_blank");
      return;
    }
    const viewUrl = await fetchUrl({
      storagePath: attachment.storage_path,
      fileName: attachment.file_name,
      action: "view",
    });
    window.open(viewUrl, "_blank");
  }

  return (
    <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-3 overflow-x-hidden">
        <div className="shrink-0">{getFileIcon(attachment.file_type)}</div>
        <div className="flex min-w-0 flex-1 flex-col xl:min-w-[16rem]">
          <Hint label={attachment.file_name}>
            <p className="text-md inline-block w-fit max-w-full truncate font-medium">
              {attachment.file_name}
            </p>
          </Hint>
          {attachment.file_description && (
            <Hint label={attachment.file_description}>
              <p className="mt-0.5 line-clamp-2 w-fit max-w-full text-sm leading-tight font-medium text-slate-400">
                {attachment.file_description}
              </p>
            </Hint>
          )}
          <p className="mt-0.5 flex flex-wrap items-center gap-1 text-sm text-slate-400">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 uppercase">
              {attachment.file_type}
            </span>
            {modifiedAt && (
              <span className="text-xs font-medium">
                {formatDateTime(new Date(modifiedAt))}
              </span>
            )}
            <span className="max-w-full truncate text-xs font-medium">
              {`by ${attachment.owner_name ?? "Unknown User"}`}
            </span>
          </p>
        </div>
      </div>

      <div className="flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 text-sm whitespace-nowrap xl:justify-end xl:overflow-visible xl:pb-0">
        <Button
          type="button"
          variant="outline"
          className="disabled:bg-muted-200 flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 hover:bg-slate-100"
          disabled={isFetchingUrl}
          onClick={handleViewAttachment}
        >
          {isFetchingUrl ? (
            <Loader className="animate-spin" size={16} />
          ) : (
            "View"
          )}
        </Button>

        {attachment.file_type !== "link" && (
          <Button
            variant="outline"
            type="button"
            className="disabled:text-muted-foreground rounded-md border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 hover:bg-slate-100"
            disabled={isFetchingUrl}
            onClick={handleDownloadAttachment}
          >
            Download
          </Button>
        )}
      </div>
    </div>
  );
}
