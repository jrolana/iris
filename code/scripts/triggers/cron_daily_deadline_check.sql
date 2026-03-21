SELECT cron.schedule(
    'daily_deadline_reminders', 
    '0 16 * * *', -- runs at 12:00 AM every day (4PM UTC)
    $$ SELECT private.process_daily_deadline_reminders(); $$
);