import { Suspense } from "react";
import SigninPageClient from "@/app/(full-width-pages)/(auth)/signin/SigninPageClient";
import { Loader } from "lucide-react";

export default function SigninPage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full flex-1 flex-row items-center justify-center gap-2">
          <span className="text-lg font-medium">Loading sign in page...</span>
          <Loader className="animate-spin" />
        </div>
      }
    >
      <SigninPageClient />
    </Suspense>
  );
}
