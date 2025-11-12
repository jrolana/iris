"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Doc {
  id: string;
  title: string;
  google_doc_url: string;
  status: string;
}

export default function DocDetail() {
  const params = useParams();
  const docId = params.id as string;
  const [doc, setDoc] = useState<Doc | null>(null);
  const userId = "USER_ID_HERE"; // Supabase auth

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:4000/docs/${docId}/check`);
      const updatedDoc = await res.json();
      setDoc(updatedDoc);
    }, 5000); // check every 5s

    return () => clearInterval(interval);
  }, [docId]);

  const updateStatus = async (newStatus: string) => {
    await fetch(`http://localhost:4000/docs/${docId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_status: newStatus, userId }),
    });
    setDoc((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };

  if (!doc) return <div>Loading...</div>;

  return (
    <div>
      <h1>{doc.title}</h1>
      <p>Status: {doc.status}</p>
      <a href={doc.google_doc_url} target="_blank" rel="noopener noreferrer">
        Open in Google Docs
      </a>
      <div>
        <button onClick={() => updateStatus("in_review")}>
          Mark In Review
        </button>
        <button onClick={() => updateStatus("approved")}>Mark Approved</button>
      </div>
    </div>
  );
}
