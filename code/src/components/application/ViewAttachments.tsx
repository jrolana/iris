import useFilesUploadModal from "@/hooks/useFilesUploadModal";
import { AttachmentType } from "@/lib/types/application";
import { User } from "@supabase/supabase-js";
import FileItem from "../common/FileItems";

interface ViewAttachmentProps {
  groupedFiles: AttachmentType["Row"][][];
  user: User | null;
  isFetchingUser: boolean;
  isLoading: boolean;
  isUneditable: boolean;
}

function ViewAttachments(props: ViewAttachmentProps) {
  const { groupedFiles, isLoading, isFetchingUser, user, isUneditable } = props;
  const { openModal: openUploadModal } = useFilesUploadModal();

  // TODO: show loading state properly
  if (isLoading || isFetchingUser) {
    return (
      <p className="mt-4 text-sm text-slate-500">Loading attachments...</p>
    );
  }

  if (groupedFiles.length == 0) {
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

  return (
    <>
      <ul className="mt-3 max-h-64 min-h-0 divide-y divide-slate-100 overflow-x-hidden overflow-y-auto contain-content">
        {groupedFiles.map((folder) => {
          const latestVersion = folder[0];
          return (
            <li
              key={latestVersion.id}
              className="flex flex-col gap-2 py-2 sm:flex-row sm:items-start sm:justify-between"
            >
              <FileItem
                file={latestVersion}
                owner={user}
                oldVersions={folder.slice(1)}
                isUneditable={isUneditable}
              />
            </li>
          );
        })}
      </ul>

      <div className="mt-4">
        <button
          type="button"
          disabled={isUneditable}
          onClick={() => {
            openUploadModal();
          }}
          className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Upload a file
        </button>
        <p className="mt-2 text-sm text-gray-500">
          Attach necessary files related to this application.
        </p>
      </div>
    </>
  );
}

export default ViewAttachments;
