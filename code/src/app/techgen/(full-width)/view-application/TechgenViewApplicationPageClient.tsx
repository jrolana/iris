"use client";

import ApplicationView from "@/components/application/ApplicationView";
import { useGetAppById } from "@/hooks/applications/useGetApplicationById";
import { Loader } from "lucide-react";

interface TechgenViewApplicationPageClientProps {
  applicationId: string;
}

function TechgenViewApplicationPageClient({
  applicationId,
}: TechgenViewApplicationPageClientProps) {
  const { application, isLoading, isFetched } = useGetAppById({
    appId: applicationId,
  });

  if ((isLoading || !isFetched) && !application) {
    return (
      <div className="flex w-full flex-1 flex-row items-center justify-center gap-2">
        Fetching Application...
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex w-full flex-1 flex-row items-center justify-center gap-2">
        Application not found.
      </div>
    );
  }

  return <ApplicationView mode="applicant" initialApplication={application} />;
}

export default TechgenViewApplicationPageClient;
