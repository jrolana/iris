# Iris deployment on Debian/Proxmox

This project is a Next.js web application that depends on Supabase. The simplest way to deploy it for your class is:

1. Create a Debian 12 VM or LXC in Proxmox.
2. Run this app on port `3000`.
3. Put Nginx in front of it on port `80` or `443`.
4. Point the app to your Supabase project through environment variables.

## What "Debian webapp" means here

You do not need to convert this into a native Debian desktop app. Your professor was most likely referring to a web app deployed on a Debian server.

## Recommended lab setup

- Use a dedicated Debian VM in Proxmox, not your laptop.
- Use a separate Supabase project just for the security class.
- Put only test data in it.
- Treat the VM as disposable and take a Proxmox snapshot before each hacking exercise.
- Do not reuse personal email passwords or production API keys.

## Option A: Docker on Debian

Install Docker and Compose on the Debian guest, then copy this repository onto the VM.

Create `/opt/iris-web/.env` from [.env.example](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/.env.example) and fill in the real values.

Run:

```bash
cd /opt/iris-web
docker compose build
docker compose up -d
```

The app will listen on `http://SERVER_IP:3000`.

## Option B: Native Node.js service on Debian

Install Node.js 22 and Nginx on the Debian guest.

Run:

```bash
cd /opt/iris-web
npm ci
npm run build
sudo cp deploy/systemd/iris-web.service /etc/systemd/system/iris-web.service
sudo systemctl daemon-reload
sudo systemctl enable --now iris-web
```

The service file expects:

- app files in `/opt/iris-web`
- environment file in `/opt/iris-web/.env`
- runtime user `iris`

Create the service user first:

```bash
sudo useradd --system --home /opt/iris-web --shell /usr/sbin/nologin iris
sudo chown -R iris:iris /opt/iris-web
```

## Nginx reverse proxy

Use [deploy/nginx/iris-web.conf](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/deploy/nginx/iris-web.conf) as a starting point:

```bash
sudo cp deploy/nginx/iris-web.conf /etc/nginx/sites-available/iris-web
sudo ln -s /etc/nginx/sites-available/iris-web /etc/nginx/sites-enabled/iris-web
sudo nginx -t
sudo systemctl reload nginx
```

## Required environment variables

These must exist in `/opt/iris-web/.env` or your Docker `.env`:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional for email features:

- `GMAIL_EMAIL`
- `GMAIL_APP_PASSWORD`

## Important security note for your class

This project has an admin-facing API and service-role access to Supabase. For a hacking class, deploy it as an isolated lab target only.

- Keep it on a private lab VLAN if possible.
- Do not point it at your real school or personal Supabase project.
- Rotate all secrets after the exercise.
- Revert the Proxmox snapshot after each class run.

## Suggested Proxmox flow

1. Create a Debian 12 VM.
2. Give it a private IP.
3. Clone or copy this repository to `/opt/iris-web`.
4. Fill in `.env`.
5. Deploy with Docker or systemd.
6. Confirm sign-in works.
7. Take a clean Proxmox snapshot.
8. Let the class attack that snapshot, then roll back.
