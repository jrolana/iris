"use client";

import ApplicationView from "@/components/application/ApplicationView";
import { useGetAppById } from "@/hooks/applications/useGetApplicationById";
import { useSearchParams } from "next/navigation";

function TtbdoViewApplicationPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationID") ?? "";

  const { application, isLoading, isFetched } = useGetAppById({
    appId: applicationId,
  });

  if (isLoading || !isFetched) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return <div>Application not found.</div>;
  }

  return <ApplicationView mode="admin" initialApplication={application} />;
}

export default TtbdoViewApplicationPage;
