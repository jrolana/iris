import WelcomePageClient from "@/app/(full-width-pages)/welcome/WelcomePageClient";

interface PropsInterface {
  searchParams: Promise<{ error?: string }>;
}

export default async function WelcomePage(props: PropsInterface) {
  const { searchParams } = props;
  const params = await searchParams;
  return <WelcomePageClient errorMessage={params.error ?? ""} />;
}
