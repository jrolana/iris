import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as nodemailer from "npm:nodemailer";

// Standard CORS headers for Edge Functions
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  techgen: "Technology Generator",
  "up-official": "UP Official",
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, inviteLink, fullName, role } = await req.json();

    if (!email || !inviteLink) {
      throw new Error("Missing required parameters: email or inviteLink");
    }

    const recipientName = fullName ? String(fullName) : "User";
    const roleLabel = roleLabels[role] ?? role ?? "User";
    const safeRecipientName = escapeHtml(recipientName);
    const safeInviteLink = escapeHtml(inviteLink);
    const safeAssignedRole = escapeHtml(roleLabel);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: Deno.env.get("GMAIL_EMAIL"),
        pass: Deno.env.get("GMAIL_APP_PASSWORD"),
      },
    });

    const info = await transporter.sendMail({
      from: `IP Management System <${Deno.env.get("GMAIL_EMAIL")}>`,
      to: email,
      subject: `Formal Invitation to Access IRIS as ${roleLabel}`,
      text: [
        `Dear ${recipientName},`,
        "",
        "You have been invited to access IRIS - Information Rights Information System.",
        `Assigned role: ${roleLabel}`,
        "",
        "Please accept the invitation and set up your account using the link below:",
        inviteLink,
        "",
        "This invitation link is unique to you and will expire after 24 hours for security purposes.",
        "If you were not expecting this invitation, you may safely disregard this email.",
        "",
        "Sincerely,",
        "The IRIS Team",
      ].join("\n"),
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, Helvetica, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:40px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:8px; padding:32px; border:1px solid #e5e7eb;">
                    <tr>
                      <td style="padding-bottom:24px;">
                        <h1 style="margin:0; font-size:24px; color:#111827;">
                          Invitation to Access IRIS
                        </h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="font-size:15px; color:#374151; line-height:1.6; padding-bottom:16px;">
                        Dear ${safeRecipientName},
                      </td>
                    </tr>

                    <tr>
                      <td style="font-size:15px; color:#374151; line-height:1.6; padding-bottom:16px;">
                        You have been invited to access <strong>IRIS - Information Rights Information System</strong>.
                        Please accept this invitation to set up your account and begin using the system.
                      </td>
                    </tr>

                    <tr>
                      <td style="font-size:15px; color:#374151; line-height:1.6; padding-bottom:24px;">
                        <strong>Assigned role:</strong> ${safeAssignedRole}
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding-bottom:24px;">
                        <a href="${safeInviteLink}"
                           style="
                             background-color:#6366f1;
                             color:#ffffff;
                             text-decoration:none;
                             padding:12px 24px;
                             border-radius:6px;
                             font-size:16px;
                             display:inline-block;
                           ">
                          Accept Invitation
                        </a>
                      </td>
                    </tr>

                    <tr>
                      <td style="font-size:13px; color:#6b7280; line-height:1.5; padding-bottom:12px;">
                        If the button above does not work, copy and paste this invitation link into your browser:
                      </td>
                    </tr>

                    <tr>
                      <td style="font-size:13px; color:#4f46e5; line-height:1.5; word-break:break-all; padding-bottom:20px;">
                        <a href="${safeInviteLink}" style="color:#4f46e5;">${safeInviteLink}</a>
                      </td>
                    </tr>

                    <tr>
                      <td style="font-size:13px; color:#6b7280; line-height:1.5; padding-bottom:20px;">
                        This invitation link is unique to you and will expire after 24 hours for security purposes.
                        If you were not expecting this invitation, you may safely disregard this email.
                      </td>
                    </tr>

                    <tr>
                      <td style="font-size:13px; color:#374151; line-height:1.5;">
                        Sincerely,<br />
                        The IRIS Team
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
