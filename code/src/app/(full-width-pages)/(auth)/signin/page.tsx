import SigninPageClient from "@/app/(full-width-pages)/(auth)/signin/SigninPageClient";

interface SigninPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SigninPage({ searchParams }: SigninPageProps) {
  const params = await searchParams;

  return <SigninPageClient errorMessage={params.error ?? ""} />;
}
