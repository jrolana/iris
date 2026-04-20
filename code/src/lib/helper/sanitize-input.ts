export function sanitizeFileName(name: string) {
  const lastDotIndex = name.lastIndexOf(".");

  const hasExtension = lastDotIndex > 0;
  const baseName = hasExtension ? name.slice(0, lastDotIndex) : name;
  const extension = hasExtension ? name.slice(lastDotIndex) : "";

  const sanitizedBase = baseName
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("_");

  const sanitizedExtension = extension.replace(/[^a-zA-Z0-9.]/g, "");

  return `${sanitizedBase}${sanitizedExtension}`;
}