SELECT cron.schedule(
    'trigger_gmail_deadline_emails',
    '5 16 * * *', -- Runs at 16:05 UTC (12:05 AM PH Time)
    $$
    SELECT net.http_post(
        url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-deadline-emails', -- "send-deadline-emails" is the name of the Edge Function
        headers := '{"Authorization": "Bearer <ANON_KEY>", "Content-Type": "application/json"}'::jsonb
    );
    $$
);