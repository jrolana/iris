import { StatusType } from "./ip";

export type IprStatus = {
  statusId: string;
  status_type: StatusType;
  deadline?: string | null;
  note?: string | null;
  created_at: string;
};
