import TtbdoViewApplicationPageClient from "./TtbdoViewApplicationPageClient";

interface TtbdoViewApplicationPageProps {
  searchParams: Promise<{
    applicationID?: string;
  }>;
}

export default async function TtbdoViewApplicationPage({
  searchParams,
}: TtbdoViewApplicationPageProps) {
  const params = await searchParams;
  const applicationId = params.applicationID ?? "";

  return <TtbdoViewApplicationPageClient applicationId={applicationId} />;
}