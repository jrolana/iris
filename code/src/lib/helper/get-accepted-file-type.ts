import { Accept } from "react-dropzone";

export function getAcceptedFileType(fileType: string): Accept | undefined {
  if (!fileType) return undefined;

  switch (fileType) {
    case "PDF":
      return { 
        "application/pdf": [".pdf"] 
      };

    case "IMAGE":
      // "image/*" allows all standard image types (png, jpg, jpeg, gif, webp, etc.)
      return { 
        "image/*": [] 
      };

    case "TXT":
      return { 
        "text/plain": [".txt"] 
      };

    case "DOCUMENT":
      return {
        "application/msword": [".doc"], // Old Word
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], // New Word
      };

    case "SPREADSHEET":
      return {
        "application/vnd.ms-excel": [".xls"], // Old Excel
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"], // New Excel
      };

    //  generic file types like "File" or unrecognized types
    default:
      { if (fileType === "FILE") return undefined;

      // best effort for specific extensions (e.g. "ZIP" -> ".zip")
      const ext = `.${fileType.toLowerCase()}`;
      return {
        "application/octet-stream": [ext],
      }; }
  }
}