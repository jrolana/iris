import { useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { useUploadFile } from "@/hooks/attachments/useUploadFile";
import { AttachmentType } from "@/lib/types/application";
import { getFileType } from "@/lib/helper/get-file-type";
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
import { useCheckOffRequirement } from "@/hooks/requirements/useCheckOffRequirement";

function getFileIcon(fileType: string) {
  if (fileType === "link") {
    return <LinkIcon className="h-5 w-5 text-blue-500" />;
  } else if (fileType === "Image") {
    return <ImageIcon className="h-5 w-5 text-purple-500" />;
  } else {
    return <FileText className="h-5 w-5 text-orange-500" />;
  }
}

interface UploadRequirementButtonProps {
  applicationId: string;
  disabled?: boolean;
  className?: string;
  requirementId: string;
  acceptedFileTypes: Accept;
}

type ExtendedAttachmentType = AttachmentType["Insert"] & { fileObject?: File };

export default function UploadRequirementButton(
  props: UploadRequirementButtonProps,
) {
  const {
    className,
    disabled,
    applicationId,
    requirementId,
    acceptedFileTypes,
  } = props;
  const { uploadFile, isLoading } = useUploadFile();
  const { checkOffRequirement, isLoading: isCheckingOff } =
    useCheckOffRequirement();
  const confirm = useConfirm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setIsModalOpen(true);
      }
    },
    accept: acceptedFileTypes, // only allow certain file types
    maxFiles: 1, //  only allow one file to be selected
    multiple: false,
    noDrag: true, // disables drag-and-drop on the button itself, click only
    noClick: true,
  });

  const handleConfirmUpload = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Upload",
      message:
        "Are you sure you want to upload this file? This will check off the requirement and cannot be undone. Make sure you have uploaded the correct file.",
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
    toast.promise(uploadFile({ file: newItemVersion, appId: applicationId }), {
      loading: `Uploading ${newItemVersion.file_name}...`,
      success: `Uploaded: ${newItemVersion.file_name}`,
      error: (err) =>
        `Error uploading ${newItemVersion.file_name}: ${err.message}`,
    });

    toast.promise(checkOffRequirement({ requirementId }), {
      loading: "Checking off requirement...",
      success: "Requirement checked off successfully.",
      error: (err) => `Error checking off requirement: ${err.message}`,
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
        disabled={isLoading || isCheckingOff || disabled}
        className={`${className}`}
        onClick={(e) => {
          e.stopPropagation();
          open();
        }} // prevent row clicks if needed
      >
        Upload
        {isLoading || isCheckingOff ? (
          <Loader className="animate-spin" size={20} />
        ) : (
          <Upload size={20} />
        )}
      </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="flex w-full max-w-[95vw] min-w-[75vw] flex-col sm:w-[80vh] sm:min-w-100">
          <DialogHeader>
            <DialogTitle>Upload Required File</DialogTitle>
            <DialogDescription>
              Upload the required file for this application. This will check off
              the item from the requirements list. Remember that files{" "}
              <b>cannot be removed</b> once uploaded.
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
                <Label htmlFor="desc">File Description</Label>
                <Input
                  id="desc"
                  value={description}
                  placeholder="e.g., Submission for requirement X, version 2"
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
              disabled={isLoading || isCheckingOff}
              className="disabled:text-muted-foreground bg-sky-600 hover:bg-sky-600/50 disabled:bg-slate-200"
            >
              {isLoading || isCheckingOff ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload and Check Off"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
