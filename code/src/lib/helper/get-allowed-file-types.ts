import { Accept } from "react-dropzone";

export function formatAcceptedExtensions(accept?: Accept): string {
    if (!accept) return "Supports PDF, Images, Word, Excel, etc."; // default fallback

    const extensions = Object.values(accept).flat();

    // clean up extensions (remove dots, convert to uppercase)
    const uniqueExtensions = Array.from(
    new Set(extensions.map((ext) => ext.replace(".", "").toUpperCase()))
    );

    // 4. Return formatted string
    if (uniqueExtensions.length === 0) return "Supports PDF, Images, Word, Excel, etc.";

    // truncate if too long
    if (uniqueExtensions.length > 5) {
        return `Supports ${uniqueExtensions.slice(0, 4).join(", ")} and others`;
    }

    return `Supports ${uniqueExtensions.join(", ")}`;
}