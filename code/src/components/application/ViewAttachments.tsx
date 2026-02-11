import useFilesUploadModal from "@/hooks/useFilesUploadModal";
import { AttachmentType } from "@/lib/types/application";
import { User } from "@supabase/supabase-js";
import FileItem from "../common/FileItems";

interface ViewAttachmentProps {
  attachments: AttachmentType["Row"][];
  user: User | null;
  isFetchingUser: boolean;
  isLoading: boolean;
}

function ViewAttachments(props: ViewAttachmentProps) {
  const { attachments, isLoading, isFetchingUser } = props;
  const { openModal: openUploadModal } = useFilesUploadModal();

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

  // async function handleDeleteAttachment(fileId: string, fileName: string) {
  //   await deleteFile(
  //     { storage_path: fileId },
  //     {
  //       onSuccess: () => {
  //         toast.success(`File "${fileName}" deleted successfully.`, {
  //           duration: 4000,
  //         });
  //       },
  //     },
  //   );
  // }

  return (
    // TOOD: maybe create a separate component for each attachment item so that there can have separate view, download, and delete loading states
    <>
      <ul className="mt-3 max-h-64 divide-y divide-slate-100 overflow-y-auto">
        {attachments.map((file) => (
          <li
            key={file.id}
            className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <FileItem file={file} />
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
