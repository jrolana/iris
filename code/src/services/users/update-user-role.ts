import { supabaseClient as supabase } from "@/lib/supabase";
import { RoleType } from "@/lib/types/role";

interface PropsInterface {
  id: string;
  role: RoleType;
}

export const updateUserRole = async function (props: PropsInterface) {
  const { id, role } = props;

  const { data, error } = await supabase
    .schema("private")
    .from("users")
    .update({ role })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
