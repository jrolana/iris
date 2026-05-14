import { isApplicationEditLocked } from "@/lib/helper/is-application-edit-locked";
import { supabaseClient as supabase } from "@/lib/supabase";

interface ApplicationActionGuardOptions {
  downgradedMessage: string;
  withdrawnMessage: string;
}

export async function getApplicationLockState(applicationId: string) {
  const { data: application, error: applicationError } = await supabase
    .schema("private")
    .from("ipr_applications")
    .select("is_withdrawn, curr_status")
    .eq("id", applicationId)
    .single();

  if (applicationError) {
    throw new Error(applicationError.message);
  }

  let currentStatusType: string | null = null;

  if (application.curr_status) {
    const { data: currentStatus, error: currentStatusError } = await supabase
      .schema("private")
      .from("ipr_statuses")
      .select("status_type")
      .eq("id", application.curr_status)
      .single();

    if (currentStatusError) {
      throw new Error(currentStatusError.message);
    }

    currentStatusType = currentStatus.status_type;
  }

  return {
    isWithdrawn: Boolean(application.is_withdrawn),
    currentStatusType,
    isLocked: isApplicationEditLocked({
      isWithdrawn: application.is_withdrawn,
      currentStatusType,
    }),
  };
}

export async function assertApplicationActionAllowed(
  applicationId: string,
  options: ApplicationActionGuardOptions,
) {
  const lockState = await getApplicationLockState(applicationId);

  if (lockState.currentStatusType === "downgraded_to_um") {
    throw new Error(options.downgradedMessage);
  }

  if (lockState.isWithdrawn) {
    throw new Error(options.withdrawnMessage);
  }

  return lockState;
}
