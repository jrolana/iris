"use client";

import ApplicationView from "@/components/application/ApplicationView";
import { useGetAppById } from "@/hooks/applications/useGetApplicationById";
import {
  dummyApplication,
  dummyFiles,
  dummyInventors,
  dummyIprStatuses,
} from "@/lib/dummy-data/application";
import { useSearchParams } from "next/navigation";

function TtbdoViewApplicationPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationID") ?? "";

  const { application, isLoading } = useGetAppById({ appId: applicationId });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <ApplicationView
      mode="admin"
      initialApplication={{
        ...dummyApplication,
        ipTitle: application?.ip_title ?? dummyApplication.ip_title,
        projectTitle:
          application?.project_title ?? dummyApplication.project_title,
      }}
      initialAttachments={dummyFiles}
      initialInventors={dummyInventors}
      initialStatuses={dummyIprStatuses}
    />
  );
}

export default TtbdoViewApplicationPage;
