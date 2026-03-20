SELECT cron.schedule(
    'daily_deadline_reminders', 
    '0 0 * * *', -- runs at 12:00 AM every day
    $$ SELECT private.process_daily_deadline_reminders(); $$
);