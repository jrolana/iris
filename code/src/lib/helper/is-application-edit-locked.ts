export function isApplicationEditLocked(props: {
  isWithdrawn?: boolean | null;
  currentStatusType?: string | null;
}) {
  const { isWithdrawn, currentStatusType } = props;

  return Boolean(isWithdrawn) || currentStatusType === "downgraded_to_um";
}

export function getApplicationEditLockReason(props: {
  isWithdrawn?: boolean | null;
  currentStatusType?: string | null;
}) {
  const { isWithdrawn, currentStatusType } = props;

  if (currentStatusType === "downgraded_to_um") {
    return "This application can no longer be edited because it has already been downgraded to a Utility Model.";
  }

  if (isWithdrawn) {
    return "This application can no longer be edited because it has been withdrawn.";
  }

  return null;
}
