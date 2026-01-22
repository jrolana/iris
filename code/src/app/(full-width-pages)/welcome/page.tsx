"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { ChevronLeft } from "lucide-react";

const LoadingState = () => (
  <div className="py-6 text-center">
    <div className="border-brand-500 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
    <p className="text-gray-700">Loading your account...</p>
  </div>
);

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="space-y-4 py-6 text-center">
    <div className="bg-error-100 mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full">
      <svg
        className="text-error-500 h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
    <h2 className="text-lg font-semibold text-gray-900">
      Authentication Failed
    </h2>
    <p className="text-sm text-gray-700">{message}</p>
    {message.includes("expired") && (
      <p className="text-xs text-gray-500">
        Please request a new invitation link.
      </p>
    )}
    <button
      onClick={onRetry}
      className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 rounded-lg px-6 py-2 text-white"
    >
      Go to Sign In
    </button>
  </div>
);

const WelcomeState = ({
  userName,
  isRedirecting,
}: {
  userName: string;
  isRedirecting: boolean;
}) => (
  <div className="space-y-4 py-6 text-center">
    <div className="flex justify-center">
      <div className="bg-success-100 flex h-16 w-16 items-center justify-center rounded-full">
        <svg
          className="text-success-500 h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
    <h1 className="text-title-sm sm:text-title-md font-semibold text-gray-800">
      Welcome to IRIS, {userName}!
    </h1>
    <p className="text-sm text-gray-500">
      Your account has been successfully created. Redirecting to your
      dashboard...
    </p>
    {isRedirecting && (
      <div className="text-brand-500 flex items-center justify-center space-x-2">
        <div className="border-brand-500 h-5 w-5 animate-spin rounded-full border-b-2"></div>
        <span className="text-sm">Redirecting...</span>
      </div>
    )}
  </div>
);

export default function WelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "welcome" | "error">("loading");
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const supabase = createClient();

  const handleRetry = () => router.push("/signin");

  useEffect(() => {
    const loadUser = async () => {
      // Check for error from callback route
      const error = searchParams.get("error");
      if (error) {
        setErrorMessage(decodeURIComponent(error));
        setStatus("error");
        return;
      }

      // Get current user session
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage(userError?.message || "No active session found. Please sign in.");
        setStatus("error");
        return;
      }

      // User is authenticated
      setUserName(user.email?.split("@")[0] || "there");
      setStatus("welcome");

      setTimeout(async () => {
        setIsRedirecting(true);
        const { data: userRole } = await supabase.rpc("get_user_role");
        router.push(userRole ? `/${userRole}` : "/");
      }, 3000);
    };

    loadUser();
  }, [router, supabase, searchParams]);

  return (
    <div className="flex min-h-screen flex-col bg-white p-6 sm:p-12">
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-700 transition-colors hover:text-gray-900"
        >
          <ChevronLeft className="mr-1 h-5 w-5" />
          Back to homepage
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="shadow-default w-full max-w-md space-y-2 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6">
          {status === "loading" && <LoadingState />}
          {status === "error" && (
            <ErrorState message={errorMessage} onRetry={handleRetry} />
          )}
          {status === "welcome" && (
            <WelcomeState userName={userName} isRedirecting={isRedirecting} />
          )}
        </div>
      </div>
    </div>
  );
}