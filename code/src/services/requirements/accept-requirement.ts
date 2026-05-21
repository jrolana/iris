import { supabaseClient as supabase } from "@/lib/supabase";

interface AcceptRequirementProps {
  requirementId: string;
}

export const acceptRequirement = async function (
  props: AcceptRequirementProps,
) {
  const { requirementId } = props;

  if (!requirementId) {
    throw new Error("Invalid requirement id.");
  }

  const { data, error } = await supabase
    .schema("private")
    .from("ipr_requirements")
    .update({ status: "accepted" })
    .eq("id", requirementId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
