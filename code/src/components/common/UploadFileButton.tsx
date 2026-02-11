import { useDropzone } from "react-dropzone";
import { getAcceptedFileType } from "@/lib/helper/get-accepted-file-type";
import { useUploadFile } from "@/hooks/attachments/useUploadFile";
import { AttachmentType } from "@/lib/types/application";
import { getFileType } from "@/lib/helper/get-file-type";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Loader, Upload } from "lucide-react";
import { toast } from "sonner";

interface UpdateFileButtonProps {
  currentFileType: string;
  folderName: string;
  disabled?: boolean;
  className?: string;
}
type ExtendedAttachmentType = AttachmentType["Insert"] & { fileObject?: File };
export default function UpdateFileButton(props: UpdateFileButtonProps) {
  const { currentFileType, className, disabled } = props;
  const { uploadFile, isLoading } = useUploadFile();
  const searchParams = useSearchParams();
  const appId = searchParams.get("applicationID") || "";

  const acceptedFileType = getAcceptedFileType(currentFileType.toUpperCase());

  async function handleFileUpdate(file: File) {
    const newItemVersion: ExtendedAttachmentType = {
      owner_id: "",
      file_name: file.name,
      application_id: "",
      comments: null,
      file_description: "",
      fileObject: file,
      file_type: getFileType(file),
      storage_path: "",
      uploaded_at: new Date().toString(),
    };
    await uploadFile(
      { file: newItemVersion, appId },
      {
        onSuccess: () => handleSuccess(newItemVersion),
        onError: (error: unknown) => handleError(newItemVersion, error),
      },
    );
  }

  function handleSuccess(item: ExtendedAttachmentType) {
    toast.success(`Uploaded: ${item.file_name}`, { duration: 5000 });
  }

  function handleError(item: ExtendedAttachmentType, error: unknown) {
    toast.error(
      `Error uploading ${item.file_name}: ${(error as Error).message}`,
      {
        duration: 8000,
      },
    );
  }

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        alert(
          `Selected file: ${acceptedFiles[0].name} (type: ${acceptedFiles[0].type})`,
        );
        handleFileUpdate(acceptedFiles[0]);
      }
    },
    accept: acceptedFileType, // dynamically set accepted file types based on current file type
    maxFiles: 1, // since it is update, only allow one file to be selected
    multiple: false,
    noDrag: true, // disables drag-and-drop on the button itself, click only
    noClick: true,
  });

  return (
    <div {...getRootProps()} className="inline-block">
      <input {...getInputProps()} />

      {/* trigger the file dialog */}
      <Button
        variant="outline"
        disabled={isLoading || disabled}
        className={`${className}`}
        onClick={(e) => {
          e.stopPropagation();
          open();
        }} // prevent row clicks if needed
      >
        {isLoading ? (
          <>
            Updating
            <Loader className="animate-spin" size={20} />
          </>
        ) : (
          <>
            Update
            <Upload size={20} />
          </>
        )}
      </Button>
    </div>
  );
}
