"use client";

import ApplicationView from "@/components/application/ApplicationView";
import { useGetAppById } from "@/hooks/applications/useGetApplicationById";
import { dummyApplication } from "@/lib/dummy-data/application";

import { useSearchParams } from "next/navigation";

function TechgenViewApplicationPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationID") ?? "";

  const { application, isLoading, isFetched } = useGetAppById({
    appId: applicationId,
  });
  if (isLoading && !isFetched) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return <div>Application not found.</div>;
  }

  return (
    <ApplicationView
      mode="applicant"
      initialApplication={{
        ...dummyApplication,
        ip_title: application?.ip_title ?? dummyApplication.ip_title,
        project_title:
          application?.project_title ?? dummyApplication.project_title,
        id: application.id,
      }}
    />
  );
}

export default TechgenViewApplicationPage;
