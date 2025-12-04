import { IpType, StatusType } from "./ip";
import { FileType } from "./file";
import { CollegeUnitType } from "./college-units";

export type ApplicationType = {
  applicationId: string;
  ipTitle: string;
  projectTitle?: string;
  type_of_ip: IpType;
  current_status_type: StatusType;
  applicationNumber?: string | null;
  dateOfFiling?: string | null;
  lastUpdated?: string | null;
};
export type AttachmentType = {
  fileId: string;
  filename: string;
  description?: string | null;
  fileType: FileType;
  uploadedAt: string;
};

export type InventorType = {
  inventorId: string;
  full_name: string;
  email: string;
  college: CollegeUnitType;
};