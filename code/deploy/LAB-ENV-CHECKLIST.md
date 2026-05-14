# Lab environment checklist

Use these files for the remote lab setup:

- App runtime: [.env.lab](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/.env.lab)
- App template: [.env.lab.example](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/.env.lab.example)
- Edge Functions template: [supabase/functions/.env.example](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/supabase/functions/.env.example)

## Fill these values from your new Supabase lab project

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Fill this from your Debian/Proxmox VM

- `NEXT_PUBLIC_SITE_URL`

Example:

```env
NEXT_PUBLIC_SITE_URL=http://192.168.1.50
```

## Only if you want email features

- `GMAIL_EMAIL`
- `GMAIL_APP_PASSWORD`
