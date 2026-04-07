import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { getAcceptedFileType } from "@/lib/helper/get-accepted-file-type";
import { useUploadFile } from "@/hooks/attachments/useUploadFile";
import { AttachmentType } from "@/lib/types/application";
import { getFileType } from "@/lib/helper/get-file-type";
import { useSearchParams } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";

import { Button } from "@/components/ui/button";
import { FileText, ImageIcon, LinkIcon, Loader, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Input } from "../ui/input";
import Label from "../form/Label";

function getFileIcon(fileType: string) {
  if (fileType === "link") {
    return <LinkIcon className="h-5 w-5 text-blue-500" />;
  } else if (fileType === "Image") {
    return <ImageIcon className="h-5 w-5 text-purple-500" />;
  } else {
    return <FileText className="h-5 w-5 text-orange-500" />;
  }
}

interface UpdateFileButtonProps {
  currentFileType: string;
  folderName: string;
  disabled?: boolean;
  className?: string;
}

type ExtendedAttachmentType = AttachmentType["Insert"] & { fileObject?: File };

export default function UpdateFileButton(props: UpdateFileButtonProps) {
  const { currentFileType, className, disabled, folderName } = props;
  const { uploadFile, isLoading } = useUploadFile();
  const confirm = useConfirm();
  const searchParams = useSearchParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const appId = searchParams.get("applicationID") || "";

  const acceptedFileType = getAcceptedFileType(currentFileType.toUpperCase());

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setIsModalOpen(true);
      }
    },
    accept: acceptedFileType, // dynamically set accepted file types based on current file type
    maxFiles: 1, // since it is update, only allow one file to be selected
    multiple: false,
    noDrag: true, // disables drag-and-drop on the button itself, click only
    noClick: true,
  });

  const handleConfirmUpload = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Upload",
      message:
        "Are you sure you want to upload this new version? This will not replace the existing file but will create a new version linked to it. Remember that files cannot be removed once uploaded.",
    });
    if (!isConfirmed) return;
    if (!selectedFile) return;

    const newItemVersion: ExtendedAttachmentType = {
      owner_id: "",
      file_name: selectedFile.name,
      application_id: "",
      comments: null,
      file_description: description,
      fileObject: selectedFile,
      file_type: getFileType(selectedFile),
      storage_path: "",
      uploaded_at: new Date().toString(),
    };

    setIsModalOpen(false);
    setSelectedFile(null);
    setDescription("");
    toast.promise(uploadFile({ file: newItemVersion, appId, folderName }), {
      loading: `Uploading ${newItemVersion.file_name}...`,
      success: `Uploaded: ${newItemVersion.file_name}`,
      error: (err) =>
        `Error uploading ${newItemVersion.file_name}: ${err.message}`,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setDescription("");
  };

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
        Update
        {isLoading ? (
          <Loader className="animate-spin" size={20} />
        ) : (
          <Upload size={20} />
        )}
      </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="flex w-full max-w-[95vw] min-w-[75vw] flex-col sm:w-[80vh] sm:min-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update File Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to upload a new version of this file? This
              will not replace the existing file but will create a new version
              linked to it. Remember that files <b>cannot be removed</b> once
              uploaded.
            </DialogDescription>
          </DialogHeader>

          {selectedFile && (
            <div className="bg-card text-card-foreground flex flex-col gap-2 rounded-lg border p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded">
                    {getFileIcon(getFileType(selectedFile))}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="line-clamp-2 text-sm font-medium">
                      {selectedFile.name}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <span className="bg-muted rounded px-1.5 text-[10px] uppercase">
                        {getFileType(selectedFile)}
                      </span>
                      {/* show file size, optional for now  */}
                      {selectedFile && (
                        <span>
                          • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Version Description</Label>
                <Input
                  id="desc"
                  value={description}
                  placeholder="e.g., Revised based on comments"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpload}
              disabled={isLoading}
              className="disabled:text-muted-foreground bg-sky-600 hover:bg-sky-600/50 disabled:bg-slate-200"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload New Version"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
