export function getNotificationApplicationLink(
  applicationId: string | null,
  isAdmin: boolean,
) {
  if (!applicationId) return null;

  return `/${isAdmin ? "admin" : "techgen"}/view-application?applicationID=${applicationId}`;
}
