import { AttachmentType, RequirementsType } from "@/lib/types/application";

export type RequirementStatusType = RequirementsType["Row"]["status"];

export type RequirementWithAttachment = RequirementsType["Row"] & {
  attachment: AttachmentType["Row"] | null;
};
