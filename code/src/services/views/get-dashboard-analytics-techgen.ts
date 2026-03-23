import { supabaseClient as supabase } from "@/lib/supabase";

export const getDashboardAnalyticsTechgen = async function (
) {
  const { data: {user}} = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found.");
  }

  const { data, error } = await supabase
    .from("v_dashboard_analytics_techgen")
    .select()
    .eq("techgen_id", user.id)
    .order("year", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};