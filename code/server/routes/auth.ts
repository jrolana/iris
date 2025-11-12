import express from "express";
import { supabase } from "@/lib/supabase/client";
import { google } from "googleapis";

const router = express.Router();

// Generate Google OAuth URL
router.get("/login", (req, res) => {
  const userId = req.query.userId as string;
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.file"],
    state: userId,
    prompt: "consent",
  });

  res.redirect(url);
});

// Callback
router.get("/callback", async (req, res) => {
  const code = req.query.code as string;
  const userId = req.query.state as string;

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oAuth2Client.getToken(code);
  await supabase
    .from("user_profiles")
    .update({
      google_access_token: tokens.access_token,
      google_refresh_token: tokens.refresh_token,
      google_token_expiry: tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : null,
      service_enabled: true,
    })
    .eq("id", userId);

  res.redirect("/docs"); // back to frontend
});

export default router;
