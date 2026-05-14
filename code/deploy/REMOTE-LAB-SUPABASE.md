# Remote lab Supabase setup

This is the recommended setup for this project if you want the fastest path to a class-ready deployment:

- Debian VM in Proxmox
- Docker for the web app
- a separate hosted Supabase project just for the lab

## Why this setup

It is easier than self-hosting Supabase locally, but still keeps your class away from your real project.

## Create the lab Supabase project

1. Create a new Supabase project dedicated to the class.
2. Do not reuse your personal or production project.
3. Use fake/test users and fake/test data only.

## App environment

Create `/opt/iris-web/.env` from [.env.lab.example](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/.env.lab.example).

Required values:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Example:

```env
NEXT_PUBLIC_SITE_URL=http://192.168.1.50
NEXT_PUBLIC_SUPABASE_URL=https://abcxyzcompanyref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Deploy with Docker

On the Debian VM:

```bash
cd /opt/iris-web
cp .env.lab.example .env
nano .env
docker compose build
docker compose up -d
```

Then verify:

```bash
docker compose ps
curl http://127.0.0.1:3000
```

## After deploy

Update `NEXT_PUBLIC_SITE_URL` if you later place Nginx or HTTPS in front of the app.

## Lab safety checklist

- use a dedicated Supabase project
- rotate all lab secrets after the class
- remove real user accounts and real files
- take a Proxmox snapshot before each hacking exercise
- assume the lab project may be fully compromised
