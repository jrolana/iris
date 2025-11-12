import { google } from "googleapis";
import { supabase } from "@/lib/supabase/client";

export const getOAuth2ClientForUser = async (userId: string) => {
  const { data: user } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (!user || !user.google_access_token)
    throw new Error("User has no Google OAuth tokens");

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    access_token: user.google_access_token,
    refresh_token: user.google_refresh_token,
  });

  return oAuth2Client;
};

export async function createGoogleDocForUser(userId: string, title: string) {
  const auth = await getOAuth2ClientForUser(userId);

  const docs = google.docs({ version: "v1", auth });
  const drive = google.drive({ version: "v3", auth });

  // 1️⃣ Create the Google Doc
  const doc = await docs.documents.create({ requestBody: { title } });

  // 2️⃣ Make it shareable (anyone with the link can edit)
  await drive.permissions.create({
    fileId: doc.data.documentId!,
    requestBody: {
      type: "anyone",
      role: "writer", // allows editing
    },
  });

  // 3️⃣ Get a shareable URL
  const url = `https://docs.google.com/document/d/${doc.data.documentId}/edit`;

  return { id: doc.data.documentId!, url };
}

export const getDocModifiedTimeForUser = async (
  userId: string,
  googleDocId: string
) => {
  const auth = await getOAuth2ClientForUser(userId);
  const drive = google.drive({ version: "v3", auth });
  const file = await drive.files.get({
    fileId: googleDocId,
    fields: "modifiedTime",
  });
  return file.data.modifiedTime!;
};
