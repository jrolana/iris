import { supabaseClient as supabase } from "@/lib/supabase";
import { IprStatusType } from "@/lib/types/status";

interface PropsInterface {
  statusData: Partial<IprStatusType["Insert"]>;
}

export const addStatus = async function (props: PropsInterface) {
  const { statusData } = props;
  const { data, error } = await supabase
    .schema("private")
    .from("ipr_statuses")
    .insert(statusData as IprStatusType["Insert"])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
