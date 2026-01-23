import  { Database } from "@/lib/types/supabase"

export type ApplicationType = Database["private"]["Tables"]["ipr_applications"];

export type AttachmentType = Database["private"]["Tables"]["ipr_files"];

export type InventorType = Database["private"]["Tables"]["inventors"];
