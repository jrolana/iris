import { IpType, StatusType } from "./ip";
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
  id: string | null;
  application_id: string;
  owner_id: string;
  file_name: string;
  storage_path: string;
  description: string | null;
  file_type: string;
  uploaded_at: Date;
  comments: string | null;
};

export type InventorType = {
  inventorId: string;
  full_name: string;
  email: string;
  college: CollegeUnitType;
  userId: string | null; //change uuid type to something supabase related
  comments: string | null;
};