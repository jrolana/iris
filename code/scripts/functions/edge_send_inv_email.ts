import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as nodemailer from "npm:nodemailer"

// Standard CORS headers for Edge Functions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, inviteLink, fullName, role } = await req.json()

    if (!email || !inviteLink) {
      throw new Error("Missing required parameters: email or inviteLink")
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
      to: email,
      subject: `[IRIS] Invitation to Join the System`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hello ${fullName ? fullName : 'there'},</p>
          <p>You have been invited to join the Intellectual Rights Information System (IRIS) as ${role=="admin" ? "an":"a"} ${role}.</p>
          <p>Please click the button below to accept your invitation and set up your account:</p>
          <p>
            <a href="${inviteLink}" style="display: inline-block; padding: 10px 15px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Accept Invitation
            </a>
          </p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${inviteLink}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">This is an automated message from the Intellectual Rights Information System (IRIS). Do not reply directly to this email.</p>
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