import  { Database } from "@/lib/types/supabase"

export type ApplicationType = Database["private"]["Tables"]["ipr_applications"];

export type AttachmentType = Database["private"]["Tables"]["ipr_files"];

export type InventorType = Database["private"]["Tables"]["inventors"];

export type RequirementsType = Database["private"]["Tables"]["ipr_requirements"];

export type SearchApplication = Database['public']['Functions']['search_applications']['Returns'][0] & {
    grouped_techgen_college?: Record<string, string>[]
    };
