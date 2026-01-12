export  function getFileType(file: File){
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