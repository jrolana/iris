import { supabaseClient as supabase } from "@/lib/supabase";
import { AuditTrailRow } from "@/lib/types/audit_trail";

export const getAuditTrail = async function () {
  const { data, error } = await supabase
    .schema("private")
    .from("audit_trail")
    .select("*")
    .order("event_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AuditTrailRow[];
};
