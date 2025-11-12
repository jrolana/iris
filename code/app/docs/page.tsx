"use client";
import { useEffect, useState } from "react";

interface Doc {
  id: string;
  title: string;
  google_doc_url: string;
  status: string;
}

export default function DocsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const userId = "USER_ID_HERE"; // Replace with Supabase auth user ID

  useEffect(() => {
    fetch(`http://localhost:4000/docs/${userId}`)
      .then((res) => res.json())
      .then(setDocs);
  }, []);

  return (
    <div>
      <h1>My Documents</h1>
      <ul>
        {docs.map((doc) => (
          <li key={doc.id}>
            <a
              href={doc.google_doc_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {doc.title}
            </a>{" "}
            - Status: {doc.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
