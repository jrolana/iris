"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "@/../utils/supabase/client";
import { Loader, AlertCircle } from "lucide-react";

export default function InviteProcessingPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createAuthClient();

    const processInvite = async () => {
      console.log("Processing invite...");
      const hash = globalThis.location.hash;

      // get hash error for cases like expired tokens or invalid links
      if (hash?.includes("error=")) {
        const hashParams = new URLSearchParams(hash.substring(1));
        const errorDescription = hashParams.get("error_description");

        const formattedError = errorDescription
          ? errorDescription.replaceAll("+", " ")
          : "Invalid or expired invitation link.";

        setErrorMsg(formattedError);
        globalThis.history.replaceState(null, "", globalThis.location.pathname);
        return; // end process
      }

      // if no errors, then must be a valid link with tokens, so try to set session
      if (hash?.includes("access_token")) {
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setErrorMsg(error.message);
          } else {
            globalThis.history.replaceState(
              null,
              "",
              globalThis.location.pathname,
            );
            router.push("/techgen");
            return;
          }
        }
      }

      // fallback check for existing sessions
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/techgen");
      } else if (error) {
        console.error("Auth Error:", error.message);
      }
    };

    processInvite();

    // final fallback, keep listening for auth changes in case the invite flow completes asynchronously
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.push("/techgen");
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      {errorMsg ? (
        <div className="flex max-w-md flex-col items-center gap-4 p-6 text-center">
          <div className="flex flex-row items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <p className="text-lg font-semibold">{errorMsg}</p>
          </div>
          <p className="text-sm text-gray-500">
            Please ask your administrator to send a new invitation link.
          </p>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2">
          <p>Verifying your invitation and securely logging you in... </p>
          <Loader className="animate-spin" />
        </div>
      )}
    </div>
  );
}
