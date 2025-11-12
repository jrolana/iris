/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState, FormEvent } from "react";

interface User {
  id: string;
  email: string;
  serviceEnabled: boolean;
}

interface Document {
  id: string;
  google_doc_id: string;
  google_doc_url: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocContent, setNewDocContent] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await fetch("/api/auth/user");
        if (!userRes.ok) throw new Error("Not authenticated");
        setUser(await userRes.json());

        const docsRes = await fetch("/api/documents");
        if (!docsRes.ok) throw new Error("Failed to fetch documents");
        setDocs(await docsRes.json());
      } catch (error) {
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateDoc = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;

    setCreating(true);
    try {
      await fetch("/api/documents/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newDocTitle, content: newDocContent }),
      });
      setNewDocTitle("");
      setNewDocContent("");
      const docsRes = await fetch("/api/documents");
      setDocs(await docsRes.json());
    } catch (error) {
      alert("Error creating document");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (docId: string, newStatus: string) => {
    try {
      await fetch(`/api/documents/${docId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const docsRes = await fetch("/api/documents");
      setDocs(await docsRes.json());
    } catch (error) {
      alert("Error updating status");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Google Docs Dashboard</h1>
          <p>Welcome, {user?.email}</p>
          {user?.serviceEnabled && (
            <span className="text-green-600">
              ✓ Google Docs service enabled
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </header>

      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Create New Document</h2>
        <form onSubmit={handleCreateDoc} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Document Title"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Initial content (optional)"
            value={newDocContent}
            onChange={(e) => setNewDocContent(e.target.value)}
            rows={4}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {creating ? "Creating..." : "Create Document"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
        {docs.length === 0 ? (
          <p className="text-center text-gray-500">
            No documents yet. Create one above!
          </p>
        ) : (
          <div className="grid gap-4">
            {docs.map((doc) => (
              <div key={doc.id} className="p-4 border rounded">
                <h3 className="font-semibold">{doc.title}</h3>
                <p>
                  Status: <strong>{doc.status}</strong>
                </p>
                <p>Created: {new Date(doc.created_at).toLocaleString()}</p>
                <div className="mt-2 flex gap-2 items-center">
                  <a
                    href={doc.google_doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open in Google Docs
                  </a>
                  <select
                    value={doc.status}
                    onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
