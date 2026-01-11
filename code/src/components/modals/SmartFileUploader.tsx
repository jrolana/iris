import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  X,
  FileText,
  Link as LinkIcon,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogFooter } from "@/components/ui/dialog"; // could be removed
import { cn } from "@/lib/utils"; // Standard shadcn utility

// Helper to determine file type string
const getFileType = (file: File) => {
  if (file.type.includes("pdf")) return "PDF";
  if (file.type.includes("image")) return "Image";
  if (
    file.type.includes("word") ||
    file.name.endsWith(".doc") ||
    file.name.endsWith(".docx")
  )
    return "Document";
  if (
    file.type.includes("sheet") ||
    file.name.endsWith(".xls") ||
    file.name.endsWith(".xlsx")
  )
    return "Spreadsheet";
  return file.name.split(".").pop()?.toUpperCase() || "File";
};

// Interface for our unified item (File or Link)
interface UploadItem {
  id: string;
  type: "file" | "link";
  fileObject?: File; // Only for files
  url?: string; // Only for links
  name: string;
  fileType: string; // "PDF", "Link", "PNG", etc.
  description: string;
}

export default function SmartFileUploader({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: (items: UploadItem[]) => void;
}) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [linkInput, setLinkInput] = useState("");

  // 1. Handle File Drops
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems: UploadItem[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9), // change this to a better ID generator if needed
      type: "file",
      fileObject: file,
      name: file.name,
      fileType: getFileType(file), // 2. Auto-identify file type
      description: "",
    }));

    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // 5. Handle adding a Link
  const handleAddLink = () => {
    if (!linkInput) return;
    const newItem: UploadItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: "link",
      url: linkInput,
      name: linkInput,
      fileType: "Link", // Automatically set to "Link"
      description: "",
    };
    setItems((prev) => [...prev, newItem]);
    setLinkInput("");
  };

  // 3. Remove item
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 4. Update Description
  const updateDescription = (id: string, newDesc: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, description: newDesc } : item,
      ),
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* --- DROPZONE AREA --- */}
      <div
        {...getRootProps()}
        className={cn(
          "hover:bg-accent/50 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive
            ? "border-primary bg-accent"
            : "border-muted-foreground/25",
        )}
      >
        <input {...getInputProps()} />
        <div className="text-muted-foreground flex flex-col items-center gap-2">
          <UploadCloud className="mb-2 h-10 w-10" />
          <p className="text-foreground text-sm font-medium">
            Drag & drop files here, or click to select
          </p>
          <p className="text-xs">Supports PDF, Images, Word, Excel, etc.</p>
        </div>
      </div>

      {/* --- ADD LINK SECTION --- */}
      <div className="flex items-center gap-2">
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
          variant="secondary"
          onClick={handleAddLink}
          disabled={!linkInput}
        >
          Add Link
        </Button>
      </div>

      {/* --- PREVIEW LIST --- */}
      {items.length > 0 && (
        <ScrollArea className="h-[300px] rounded-md border p-2 pr-4">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-card text-card-foreground flex flex-col gap-2 rounded-lg border p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded">
                      {item.type === "link" ? (
                        <LinkIcon className="h-5 w-5 text-blue-500" />
                      ) : item.fileType === "Image" ? (
                        <ImageIcon className="h-5 w-5 text-purple-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="block max-w-[250px] truncate text-sm font-medium">
                        {item.name}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <span className="bg-muted rounded px-1.5 text-[10px] uppercase">
                          {item.fileType}
                        </span>
                        {item.type === "file" && item.fileObject && (
                          <span>
                            • {(item.fileObject.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Description Input */}
                <Input
                  placeholder="Add a description for this attachment..."
                  value={item.description}
                  onChange={(e) => updateDescription(item.id, e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* --- FOOTER ACTIONS --- */}
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onUpload(items)} disabled={items.length === 0}>
          Upload {items.length} Item{items.length !== 1 && "s"}
        </Button>
      </DialogFooter>
    </div>
  );
}
