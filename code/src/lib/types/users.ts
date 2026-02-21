import  { Database } from "@/lib/types/supabase"

export type UserType = Database["private"]["Tables"]["users"];

export type RegistrationRequestType = Database["private"]["Tables"]["user_registration_requests"];