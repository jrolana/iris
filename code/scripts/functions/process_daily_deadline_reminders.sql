DECLARE
    app_record RECORD;
    inv_record RECORD;
    v_deadline_tier text;
    v_category text;
    v_title text;
    v_content text;
    v_days_left integer;
    v_is_annual_reminder boolean;
    v_today date;
    v_next_anniversary date;
BEGIN
    v_today := (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila')::date;
    -- app_record is all apps that have status deadlines
    -- and apps that are either patent or trademark with filing dates
    FOR app_record IN
        SELECT 
            app.id, 
            app.project_title,
            app.filing_date,
            app.ip_type,
            stat.deadline,
            stat.status_type,
            stat.status_name
        FROM private.ipr_applications app
        LEFT JOIN private.ipr_statuses stat ON app.curr_status = stat.id
        WHERE (
            stat.deadline IS NOT NULL OR ((app.ip_type = 'patent' OR app.ip_type = 'trademark')) AND app.filing_date IS NOT NULL
            ) 
            AND NOT 
            (app.is_withdrawn = TRUE OR app.is_archived = TRUE)
    -- do this loop for each app_record
    LOOP
        v_is_annual_reminder := FALSE;
        -- calculate exact days left to deadline
            
        IF app_record.deadline IS NULL THEN -- if true, then we are checking for annual fees reminder

            -- calculate the most recent past or current anniversary
            v_next_anniversary := (app_record.filing_date::date + 
                (EXTRACT(year FROM age(v_today, app_record.filing_date::date))::int || ' years')::interval)::date;
            
            -- if that anniversary has already passed this year, the next deadline is next year
            IF v_next_anniversary < v_today THEN
                v_next_anniversary := (v_next_anniversary + interval '1 year')::date;
            END IF;

            v_days_left := v_next_anniversary - v_today;
            v_is_annual_reminder := TRUE; -- set this so that we can know that we are notifying for annual fee, and not status deadlines
        ELSE
            v_days_left := app_record.deadline - v_today;
        END IF;

        RAISE NOTICE 'Found App: %, Deadline: %, Days Left: %', app_record.project_title, app_record.deadline, v_days_left;

        -- determine category (deadline tier)
        IF v_days_left = 7 THEN
            v_deadline_tier := '1 week';
            v_category := 'deadline_reminder_1_week';
        ELSIF v_days_left = 3 THEN
            v_deadline_tier := '3 days';
            v_category := 'deadline_reminder_3_days';
        ELSIF v_days_left = 0 THEN
            v_deadline_tier := 'today';
            v_category := 'deadline_reminder_today';
        ELSE
            RAISE NOTICE 'Skipping App: % because days left (%) is not 7, 3, or 0', app_record.project_title, v_days_left;
            CONTINUE; -- skip this app if it doesn't match the trigger days
        END IF;


        -- create title and content for notif
        v_title := 'Deadline Approaching: ' || app_record.project_title;
        
        IF v_deadline_tier = 'today' THEN
            IF v_is_annual_reminder THEN
                v_content := 'Action Required: The deadline to pay for your annual fee to maintain the  ' || app_record.ip_type || ' protection is today.';
            ELSE
                v_content := 'Action Required: The deadline to complete the ' || COALESCE(app_record.status_name, app_record.status_type, 'current') || ' phase is today.';
            END IF;
        ELSE
            IF v_is_annual_reminder THEN
                v_content := 'Action Required: You have ' || v_deadline_tier || ' left to pay for your annual fee to maintain the  ' || app_record.ip_type || ' protection.';
            ELSE
                v_content := 'Action Required: You have ' || v_deadline_tier || ' left to complete the ' || COALESCE(app_record.status_name, app_record.status_type, 'current') || ' phase.';
            END IF;
        END IF;

        RAISE NOTICE 'Attempting to insert notifications for Category: %', v_category;
        INSERT INTO private.notifications (receiver_id, application_id, title, content, category)
        SELECT target_user_id, app_record.id, v_title, v_content, v_category
        FROM (
            -- all inventors linked to the app_record that have a techgen_id (linked to a user account)
            SELECT techgen_id AS target_user_id
            FROM private.inventors
            WHERE application_id = app_record.id
            AND techgen_id IS NOT NULL
            
            UNION
            
            -- all admins
            SELECT id AS target_user_id
            FROM private.users
            WHERE role = 'admin'
        ) AS target_users
        ON CONFLICT (receiver_id, application_id, category) DO NOTHING;
    END LOOP;
END;