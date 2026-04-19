import { supabaseClient as supabase } from "@/lib/supabase";

export const assertCurrentUserIsAdmin = async function () {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to perform this action.");
  }

  const { data, error } = await supabase
    .schema("private")
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (data.role !== "admin") {
    throw new Error("Only admins can perform this action.");
  }
};
