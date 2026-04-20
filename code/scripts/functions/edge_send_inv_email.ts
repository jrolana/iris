import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as nodemailer from "npm:nodemailer";

// Standard CORS headers for Edge Functions
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, inviteLink } = await req.json();

    if (!email || !inviteLink) {
      throw new Error("Missing required parameters: email or inviteLink");
    }

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
      subject: `Welcome to IRIS`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, Helvetica, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:40px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background:#ffffff; border-radius:8px; padding:32px;">
                    <tr>
                      <td align="center" style="padding-bottom:24px;">
                        <h1 style="margin:0; font-size:24px; color:#111827;">
                          Welcome to IRIS
                        </h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="font-size:15px; color:#374151; line-height:1.6; padding-bottom:24px;">
                        You've been invited to join <strong>IRIS - Information Rights Information System</strong>.
                        Click the button below to accept your invitation and set up your account.
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding-bottom:24px;">
                        <a href="${inviteLink}"
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
                      <td style="font-size:13px; color:#6b7280; line-height:1.5; padding-bottom:16px;">
                        This invitation link is unique to you and will expire after 24 hours for security reasons.
                        If you did not expect this invitation, you can safely ignore this email.
                      </td>
                    </tr>

                    <tr>
                      <td style="font-size:13px; color:#9ca3af;">
                        -- The IRIS Team
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
