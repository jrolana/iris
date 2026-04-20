import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as nodemailer from "npm:nodemailer"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { adminEmail, ccEmails, projectTitle } = await req.json()

    if (!adminEmail || !ccEmails || !Array.isArray(ccEmails)) {
      throw new Error("Missing required parameters: adminEmail or ccEmails array")
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: Deno.env.get('GMAIL_EMAIL'),
        pass: Deno.env.get('GMAIL_APP_PASSWORD')
      }
    })

    const info = await transporter.sendMail({
      from: `IP Management System <${Deno.env.get('GMAIL_EMAIL')}>`,
      to: adminEmail,
      cc: ccEmails, // Array of collaborator emails gets injected here
      subject: `[IRIS] Action Required: Collaboration Meeting for ${projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hello team,</p>
          <p>An administrative review has been requested regarding the project: <strong>${projectTitle}</strong>.</p>
          <p>We need to initiate a meeting to discuss recent developments, address the filed report, and determine the best direction to proceed.</p>
          <p>Please create a google group chat to discuss the details of the meeting.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">Do not reply to this email. This is an automated message from the Intellectual Rights Information System (IRIS).</p>
        </div>
      `
    })

    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})