import {Database} from "@/lib/types/supabase"

export type ReportType = Database["private"]["Tables"]["reports"];
export type ReportWithRelations = ReportType["Row"] & {
  reporter: { techgen_id: string | null } | null;
  app: { project_title: string | null } | null;
};
