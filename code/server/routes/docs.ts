/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from "express";
import { createGoogleDocForUser, getDocModifiedTimeForUser } from "../google";
import { supabase } from "@/lib/supabase/client";

const router = express.Router();

interface CreateDocBody {
  title: string;
  userId: string;
}
interface UpdateStatusBody {
  new_status: string;
  notes?: string;
  userId: string;
}

// Create Google Doc
router.post("/", async (req: Request<object, object, CreateDocBody>, res: Response) => {
  const { title, userId } = req.body;
  try {
    const { id, url } = await createGoogleDocForUser(userId, title);
    const { data, error } = await supabase
      .from("documents")
      .insert({
        google_doc_id: id,
        google_doc_url: url,
        title,
        created_by: userId,
      })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update status
router.patch(
  "/:id/status",
  async (req: Request<{ id: string }, object, UpdateStatusBody>, res: Response) => {
    const { id } = req.params;
    const { new_status, notes, userId } = req.body;

    const { data: doc } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();
    if (!doc) return res.status(404).send("Document not found");

    await supabase
      .from("documents")
      .update({ status: new_status, updated_at: new Date() })
      .eq("id", id);

    const { data: update } = await supabase
      .from("document_status_updates")
      .insert({
        document_id: id,
        previous_status: doc.status,
        new_status,
        updated_by: userId,
        notes,
      })
      .select()
      .single();

    res.json(update);
  }
);

// Get all docs for a user
router.get(
  "/:userId",
  async (req: Request<{ userId: string }>, res: Response) => {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("created_by", userId);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  }
);

// Poll Google Doc for changes
router.get(
  "/:id/check",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { data: doc } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();
    if (!doc) return res.status(404).send("Document not found");

    const modifiedTime = await getDocModifiedTimeForUser(
      doc.created_by,
      doc.google_doc_id
    );
    if (new Date(modifiedTime) > new Date(doc.updated_at)) {
      await supabase
        .from("documents")
        .update({ updated_at: modifiedTime, status: "edited" })
        .eq("id", id);
    }

    res.json({ ...doc, modifiedTime });
  }
);

export default router;
