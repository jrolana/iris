import TechgenViewApplicationPageClient from "./TechgenViewApplicationPageClient";

interface TechgenViewApplicationPageProps {
  searchParams: Promise<{
    applicationID?: string;
  }>;
}

export default async function TechgenViewApplicationPage({
  searchParams,
}: TechgenViewApplicationPageProps) {
  const params = await searchParams;
  const applicationId = params.applicationID ?? "";

  return <TechgenViewApplicationPageClient applicationId={applicationId} />;
}