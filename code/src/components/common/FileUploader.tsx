import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { getFileType } from "@/lib/helper/get-file-type";
import { AttachmentType } from "@/lib/types/application";
import { cn } from "@/lib/utils"; // Standard shadcn utility
import { formatAcceptedExtensions } from "@/lib/helper/get-allowed-file-types";

import {
  X,
  FileText,
  Link as LinkIcon,
  UploadCloud,
  Image as ImageIcon,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type ExtendedAttachmentType = AttachmentType["Insert"] & { fileObject?: File };

function getFileIcon(fileType: string) {
  if (fileType === "link") {
    return <LinkIcon className="h-5 w-5 text-blue-500" />;
  } else if (fileType === "Image") {
    return <ImageIcon className="h-5 w-5 text-purple-500" />;
  } else {
    return <FileText className="h-5 w-5 text-orange-500" />;
  }
}

interface FileUploaderProps {
  items: ExtendedAttachmentType[];
  setItems: Dispatch<SetStateAction<ExtendedAttachmentType[]>>;
  isLoading?: boolean;
  maxFileCount?: number;
  acceptedFileTypes?: Accept;
}

export default function FileUploader(props: FileUploaderProps) {
  const { items, setItems, isLoading, maxFileCount, acceptedFileTypes } = props;
  const [linkInput, setLinkInput] = useState("");
  const isMaxFilesReached =
    maxFileCount !== undefined && items.length >= maxFileCount;

  // function to handle file drops
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // set limit on the number of files that can be uploaded if maxFileCount is provided;
      const remainingSlots = (maxFileCount ?? Infinity) - items.length;

      if (remainingSlots <= 0) return; // if no slots left, do nothing

      const filesToAdd = acceptedFiles.slice(0, remainingSlots); // only take files that fit within the limit

      const newItems: ExtendedAttachmentType[] = filesToAdd.map((file) => ({
        owner_id: "",
        file_name: file.name,
        application_id: "",
        comments: null,
        file_description: "",
        fileObject: file,
        file_type: getFileType(file),
        storage_path: "",
        uploaded_at: new Date().toString(),
      }));
      setItems((prev) => [...prev, ...newItems]);
    },
    [setItems, items.length, maxFileCount],
  );

  // set up react-dropzone, implementing the onDrop function
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: acceptedFileTypes,
      disabled: isLoading,
      noClick: isMaxFilesReached, // prevent opening file dialog if max files reached
      noKeyboard: isMaxFilesReached, // prevent keyboard events if max files reached
      maxFiles: maxFileCount ? maxFileCount - items.length : undefined,
    });

  function handleAddLink() {
    if (!linkInput) return;
    const newItem: ExtendedAttachmentType = {
      owner_id: "",
      application_id: "",
      file_name: linkInput,
      uploaded_at: new Date().toString(),
      comments: null,
      file_type: "link",
      storage_path: linkInput,
      file_description: "",
    };
    setItems((prev) => [...prev, newItem]);
    setLinkInput("");
  }

  function removeItem(index_removed: number) {
    setItems((prev) => prev.filter((item, index) => index !== index_removed));
  }

  function updateDescription(index_updated: number, newDesc: string) {
    setItems((prev) =>
      prev.map((item, index) =>
        index === index_updated ? { ...item, file_description: newDesc } : item,
      ),
    );
  }

  return (
    <div className="w-full flex-col justify-center space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "rounded-lg border-2 border-dashed p-8 text-center transition-colors",

          !isMaxFilesReached &&
            !isDragActive &&
            !isLoading &&
            "border-muted-foreground/25 hover:bg-accent/50 cursor-pointer",

          isDragActive &&
            !isMaxFilesReached &&
            !isDragReject &&
            "border-primary bg-accent opacity-100",

          (isDragReject || (isDragActive && isMaxFilesReached)) &&
            "border-destructive bg-destructive/10",

          (isMaxFilesReached || isLoading) &&
            "border-muted-foreground/25 bg-muted/20 cursor-not-allowed opacity-60",
        )}
      >
        <input {...getInputProps()} />
        <div className="text-muted-foreground flex flex-col items-center gap-2">
          {isMaxFilesReached ? (
            <p className="text-foreground text-sm font-medium">
              You can no longer upload. Maximum of {maxFileCount} file(s)
              reached
            </p>
          ) : (
            <>
              <UploadCloud className="mb-2 h-10 w-10" />
              <p className="text-foreground text-sm font-medium">
                {isDragReject
                  ? "File type not allowed"
                  : "Drag & drop files here, or click to select"}
              </p>
              <p className="text-xs">
                {formatAcceptedExtensions(acceptedFileTypes)}
                {maxFileCount &&
                  ` (maximum of ${maxFileCount} item${maxFileCount > 1 ? "s" : ""})`}
              </p>
            </>
          )}
        </div>
      </div>

      {/* handle adding a link */}
      {/* TODO: finalize if adding a link is needed. For now, it is hidden */}
      <div className="hidden items-center gap-2">
        <div className="relative flex-1">
          <LinkIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Or paste a URL here (e.g. Google Drive link)"
            className="pl-9"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
          />
        </div>
        <Button
          className="disabled:text-muted-foreground bg-sky-600 hover:bg-sky-600/50 disabled:bg-slate-200"
          onClick={handleAddLink}
          disabled={!linkInput || isMaxFilesReached || isLoading}
        >
          Add Link
        </Button>
      </div>

      {/* preview list of files */}
      {items.length > 0 && (
        <ScrollArea className="rounded-md border p-2 pr-4">
          <div className="max-h-[300px] space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id + index.toString()}
                className="bg-card text-card-foreground flex flex-col gap-2 rounded-lg border p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded">
                      {getFileIcon(item.file_type)}
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="block max-w-[250px] truncate text-sm font-medium">
                        {item.file_name}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <span className="bg-muted rounded px-1.5 text-[10px] uppercase">
                          {item.file_type}
                        </span>
                        {/* show file size, optional for now  */}
                        {item.file_type !== "link" && item.fileObject && (
                          <span>
                            • {(item.fileObject.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-muted-foreground flex h-8 w-auto items-center gap-2 rounded">
                      <span>Uploading</span>
                      <Loader className="animate-spin" size={15} />
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                      onClick={() => removeItem(index)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Input
                  placeholder="Add a description for this attachment..."
                  value={item.file_description ?? ""}
                  onChange={(e) => updateDescription(index, e.target.value)}
                  className="h-8 text-sm"
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
