"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateDoc() {
  const [title, setTitle] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Get session after redirect from Google login
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("Session on /docs/create:", data.session);
      const session = data.session;
      if (!session) return;

      const access_token = session.provider_token || session.access_token;
      console.log("Access token:", access_token);

      if (!access_token) {
        alert("No Google access token available. You need to login again.");
        return;
      }

      setUser({ ...session.user, access_token });
    });
  }, []);

  const createDoc = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          userId: user.id,
          access_token: user.access_token,
        }),
      });

      const data = await res.json();
      console.log("Created doc:", data);

      // Redirect immediately to the new doc detail page
      router.push(`/docs/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create document");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading user session...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-2">Create Google Doc</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Document title"
        className="border px-2 py-1 mb-2 w-full max-w-md"
      />
      <button
        onClick={createDoc}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}
