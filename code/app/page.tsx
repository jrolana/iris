"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Get session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        router.push("/docs/create"); // Redirect immediately if user exists
      }
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          router.push("/docs/create"); // Redirect when login happens
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/docs/create", // Redirect after login
      },
    });
    if (error) console.error("Google login error:", error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-2">Google Docs Integration</h1>
      {user ? (
        <p className="mb-4">Logged in as: {user.email}</p>
      ) : (
        <p className="mb-4">Connect your Google account to manage documents</p>
      )}
      <button
        onClick={handleGoogleLogin}
        disabled={!!user} // Disable button if user exists
        className={`px-6 py-3 rounded-md text-white ${
          user
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {user ? "Connected" : "Connect with Google"}
      </button>
    </div>
  );
}
