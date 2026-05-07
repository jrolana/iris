import { supabaseClient as supabase } from "@/lib/supabase"
import { ApplicationType } from "@/lib/types/application";
import { getApplicationLockState } from "./assert-application-action-allowed";

interface UpdateApplicationProps {
    id: string;
    applicationData: Partial<ApplicationType["Update"]>;
}

export const updateApplicationById = async (props: UpdateApplicationProps) => {
    const { id, applicationData } = props;
    const updateKeys = Object.entries(applicationData)
        .filter(([, value]) => value !== undefined)
        .map(([key]) => key);
    const { currentStatusType, isWithdrawn } = await getApplicationLockState(id);
    const isDowngradedToUm = currentStatusType === "downgraded_to_um";

    if (isDowngradedToUm) {
        const allowedWhileDowngraded = new Set(["is_archived"]);
        const hasRestrictedUpdates = updateKeys.some(
            (key) => !allowedWhileDowngraded.has(key),
        );

        if (hasRestrictedUpdates) {
            throw new Error(
                "This application can no longer be edited because it has already been downgraded to a Utility Model.",
            );
        }
    }

    if (isWithdrawn) {
        const allowedWhileWithdrawn = new Set(["is_archived", "is_withdrawn"]);
        const hasRestrictedUpdates = updateKeys.some(
            (key) => !allowedWhileWithdrawn.has(key),
        );

        if (hasRestrictedUpdates) {
            throw new Error(
                "This application can no longer be edited because it has been withdrawn.",
            );
        }
    }

    const { data, error } = await supabase.schema("private").from('ipr_applications').update(applicationData).eq('id', id).select().single()

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
