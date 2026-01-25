import { useDeleteFileById } from "@/hooks/attachments/useDeleteFileById";
import { useGetUrlByStoragePath } from "@/hooks/attachments/useGenerateUrlByStoragePath";
import useFilesUploadModal from "@/hooks/useFilesUploadModal";
import { AttachmentType } from "@/lib/types/application";
import { User } from "@supabase/supabase-js";
import { FileText, ImageIcon, LinkIcon, Loader } from "lucide-react";
import { toast } from "sonner";
import Hint from "../common/Tooltip";

interface ViewAttachmentProps {
  attachments: AttachmentType["Row"][];
  user: User | null;
  isFetchingUser: boolean;
  isLoading: boolean;
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

function ViewAttachments(props: ViewAttachmentProps) {
  const { attachments, isLoading, user, isFetchingUser } = props;
  const { openModal: openUploadModal } = useFilesUploadModal();

  const { fetchUrl, isLoading: isFetchingUrl } = useGetUrlByStoragePath();
  const { deleteFile, isLoading: isDeletingFile } = useDeleteFileById();

  // TODO: show loading state properly
  if (isLoading || isFetchingUser) {
    return (
      <p className="mt-4 text-sm text-slate-500">Loading attachments...</p>
    );
  }

  if (attachments.length == 0) {
    return (
      <>
        <p className="mt-4 text-sm text-slate-500">
          No attachments yet. Please upload appropriate files or links.
        </p>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              openUploadModal();
            }}
            className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Upload a file or link
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Attach necessary files or links related to this application.
          </p>
        </div>
      </>
    );
  }

  async function handleDeleteAttachment(fileId: string) {
    await deleteFile(
      { id: fileId },
      {
        onSuccess: (data) => {
          toast.success(`File "${data.file_name}" deleted successfully.`, {
            duration: 4000,
          });
        },
      },
    );
  }

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
    // TOOD: maybe create a separate component for each attachment item so that there can have separate view, download, and delete loading states
    <>
      <ul className="mt-3 max-h-64 divide-y divide-slate-100 overflow-y-auto">
        {attachments.map((file) => (
          <li
            key={file.id}
            className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex flex-row items-center gap-3">
              {getFileIcon(file.file_type)}
              <div className="min-w-0 flex-1">
                <Hint label={file.file_name}>
                  <p className="text-md max-w-[250px] truncate font-medium text-slate-900">
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
            <div className="flex shrink-0 flex-wrap gap-2 text-sm">
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-600 hover:bg-slate-50"
                onClick={() =>
                  handleViewAttachment(
                    file.storage_path,
                    file.file_name,
                    file.file_type,
                  )
                }
              >
                View
              </button>
              {file.file_type !== "link" && (
                <button
                  type="button"
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() =>
                    handleDownloadAttachment(file.storage_path, file.file_name)
                  }
                >
                  Download
                </button>
              )}
              {file.owner_id === user?.id && (
                <button
                  type="button"
                  onClick={() => handleDeleteAttachment(file.id)}
                  className="disabled:text-muted-foreground rounded-md border border-red-100 bg-red-50 px-2 py-1 font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-slate-200"
                  disabled={isDeletingFile || isFetchingUrl}
                >
                  {isDeletingFile ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    "Delete"
                  )}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            openUploadModal();
          }}
          className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Upload a file or link
        </button>
        <p className="mt-2 text-sm text-gray-500">
          Attach necessary files or links related to this application.
        </p>
      </div>
    </>
  );
}

export default ViewAttachments;
