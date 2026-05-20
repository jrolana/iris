import useFilesUploadModal from "@/hooks/useFilesUploadModal";
import useAddRequirementsModal from "@/hooks/useAddRequirementsModal";

import { AttachmentType } from "@/lib/types/application";
import FileItem from "../common/FileItems";
import { UserType } from "@/lib/types/users";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { IpType } from "@/lib/types/ip";

interface ViewAttachmentProps {
  groupedFiles: AttachmentType["Row"][][];
  user: UserType["Row"] | null;
  isFetchingUser: boolean;
  isLoading: boolean;
  isUneditable: boolean;
  applicationId: string;
  ipType: IpType;
}

function ViewAttachments(props: ViewAttachmentProps) {
  const {
    groupedFiles,
    isLoading,
    isFetchingUser,
    user,
    isUneditable,
    applicationId,
    ipType,
  } = props;
  const { openModal: openUploadModal } = useFilesUploadModal();
  const {
    openModal: openAddRequirementsModal,
    setAccomplishedRequirements,
    setApplicationId,
    setIpType,
  } = useAddRequirementsModal();

  function handleOpenAddRequirementsModal() {
    setApplicationId(applicationId);
    setIpType(ipType);
    openAddRequirementsModal();
  }

  if (isLoading || isFetchingUser) {
    return (
      <div className="flex h-72 flex-row items-center justify-center gap-2 align-middle">
        <p className="align-middle text-sm text-slate-500">
          Fetching documents...
        </p>
        <Loader className="animate-spin text-slate-500" size={18} />
      </div>
    );
  }

  if (groupedFiles.length == 0) {
    return (
      <>
        <p className="my-10 text-center text-sm text-slate-500">
          No attachments yet. Please upload appropriate files.
        </p>
        <div className="mt-4">
          <Button
            type="button"
            disabled={isUneditable}
            onClick={() => {
              openUploadModal();
            }}
            className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Upload a file
          </Button>
          {user?.role === "admin" && (
            <Button
              type="button"
              disabled={isUneditable}
              onClick={() => {
                handleOpenAddRequirementsModal();
              }}
              className="mt-1 w-full items-center rounded-md border border-amber-200 bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-700 shadow-sm hover:bg-transparent disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-white"
            >
              Add a requirement
            </Button>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Attach necessary files related to this application.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <ul className="mt-3 max-h-72 min-h-0 divide-y divide-slate-100 overflow-x-hidden overflow-y-auto contain-content">
        {groupedFiles.map((folder) => {
          const latestVersion = folder[0];
          return (
            <li key={latestVersion.id} className="py-2">
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
        <Button
          type="button"
          disabled={isUneditable}
          onClick={() => {
            openUploadModal();
          }}
          className="w-full items-center rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:border hover:border-sky-600 hover:bg-transparent hover:text-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Upload a file
        </Button>
        {user?.role === "admin" && (
          <Button
            type="button"
            disabled={isUneditable}
            onClick={() => {
              handleOpenAddRequirementsModal();
            }}
            className="mt-1 w-full items-center rounded-md border border-amber-200 bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-700 shadow-sm hover:bg-transparent disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-white"
          >
            Add a requirement
          </Button>
        )}

        <p className="mt-2 text-sm text-gray-500">
          Attach necessary files related to this application.
        </p>
      </div>
    </>
  );
}

export default ViewAttachments;
