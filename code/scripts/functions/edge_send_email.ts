import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import * as nodemailer from "npm:nodemailer"

serve(async (req) => {
  try {
    // since from db server, just use service role key to have admin access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // fetch unsent deadline notifications and the user's email based on if email sent and if category is deadline reminder
    // last value means that using the fk_notifs_user_id relationship, we want to get the "email" from the "users" table
    const { data: notifications, error: fetchError } = await supabaseAdmin
      .schema('private')
      .from('notifications')
      .select(`
        id,
        title,
        content,
        users!fk_notifs_user_id ( email, full_name ), 
        ipr_applications!fk_notifs_app_id ( project_title )
      `)
      .eq('has_email_sent', false)
      .like('category', 'deadline_reminder_%')

    if (fetchError) throw fetchError

    // if there's nothing to send, exit successfully
    if (!notifications || notifications.length === 0) {
      return new Response(JSON.stringify({ message: "No pending emails" }), { status: 200 })
    }

    // group notifs by email to batch them into single emails per user (save free quota 100 per day on Resend)
    const userBatches = notifications.reduce((acc: any, notif: any) => {
      // safe parsing just in case array is returned or single object is returned from the relationship query
      const email = Array.isArray(notif.users) ? notif.users[0]?.email : notif.users?.email;
      const fullName = Array.isArray(notif.users) ? notif.users[0]?.full_name : notif.users?.full_name;
      const projectTitle = Array.isArray(notif.ipr_applications) ? notif.ipr_applications[0]?.project_title : notif.ipr_applications?.project_title;
      if (!email) return acc;

      if (!acc[email]) {
        acc[email] = { ids: [], htmlItems: [] } // initialize batch for this email
      }
      acc[email].ids.push(notif.id)
      acc[email].htmlItems.push(
        `<li>
          <strong>${projectTitle}</strong> - ${notif.content}
        </li>`
      )
      acc[email].fullName = fullName
      return acc
    }, {})


    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use true for port 465
      auth: {
        user: Deno.env.get('GMAIL_EMAIL'), 
        pass: Deno.env.get('GMAIL_APP_PASSWORD') 
      }
    })


    // Nodemailer batch payload format: https://nodemailer.com/message/
    // Prepare all emails to send simultaneously
    const emailPromises = Object.entries(userBatches).map(([email, data]: [string, any]) => {
      return transporter.sendMail({
        from: `IP Management System <${Deno.env.get('GMAIL_EMAIL')}>`,
        to: email,
        subject: `[IRIS] Action Required: ${data.htmlItems.length} IP Application Deadline(s)`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Hello, ${data.fullName}!</p>
            <p>You have approaching deadlines for the following intellectual property applications:</p>
            <ul>
              ${data.htmlItems.join('')}
            </ul>
            <p>Please accomplish the required actions before the deadlines. You can log in to the system to view the details.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888;">This is an automated message from the Intellectual Rights Information System (IRIS). Do not reply directly to this email.</p>
          </div>
        `
      })
    })

    // execute batch email sending in parallel
    await Promise.all(emailPromises);
    const sentCount = emailPromises.length;


    // toggle the notifs 'email_sent = true', use the collected ids
    const allProcessedIds = notifications.map((n: any) => n.id)
    const { error: updateError } = await supabaseAdmin
      .schema('private')
      .from('notifications')
      .update({ has_email_sent: true })
      .in('id', allProcessedIds)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, total_emails_sent: sentCount }), 
      { headers: { "Content-Type": "application/json" }, status: 200 }
    )

  } catch (err: any) {
    console.error("CRITICAL FUNCTION ERROR:", err);
    return new Response(
      JSON.stringify({ error: err.message }), 
      { headers: { "Content-Type": "application/json" }, status: 500 }
    )
  }
})