import {Database} from "@/lib/types/supabase"

export type NotificationsType = Database["private"]["Tables"]["notifications"];

export type NotifCategoryType = "deadline_reminder_1_week" | "deadline_reminder_3_days" | "deadline_reminder_today";
