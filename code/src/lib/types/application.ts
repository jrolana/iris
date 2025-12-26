import { IpType, StatusType } from "./ip";
import { FileType } from "./file";
import { CollegeUnitType } from "./college-units";

export type ApplicationType = {
  applicationId: string | number; // will be changed later
  ipTitle: string;
  projectTitle?: string;
  ipType: IpType;
  currentStatus: StatusType;
  applicationNumber?: string | null;
  filingDate?: string | Date; // will be changed later
  lastUpdated?: string | null;
  registrationDate?: Date;
  fundingAgency?: string;
  current_stage_deadline?: string | Date;
  techGens?: string[];
  colleges?: string[];
};

export type AttachmentType = {
  applicationId: string;
  fileId: string;
  filename: string;
  description?: string | null;
  fileType: FileType;
  uploadedAt: string;
  owner_id: string;
};

export type InventorType = {
  inventorId: string;
  full_name: string;
  email: string;
  college: CollegeUnitType;
  userId: string | null; //change uuid type to something supabase related
  comments: string | null;
};