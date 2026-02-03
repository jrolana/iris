// import { StatusType } from "./ip";

import {Database} from "@/lib/types/supabase"

export type IprStatusType = Database["private"]["Tables"]["ipr_statuses"];

// export type IprStatus = {
//   statusId: string;
//   status_type: StatusType;
//   deadline?: string | null;
//   note?: string | null;
//   created_at: string;
// };
