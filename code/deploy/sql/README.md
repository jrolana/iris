# Remote Supabase bootstrap

Use this when you want to initialize a brand-new hosted Supabase lab project from this repo.

Run from the repository root:

```bash
psql "$NEW_DB_URL" -f deploy/sql/remote-lab-bootstrap.psql.sql
```

Notes:

- This script is designed for `psql`, not the Supabase web SQL editor.
- It creates the current app schema, helper functions, RPCs, policies, views, and triggers.
- It does not deploy Edge Functions.
- It does not schedule `pg_cron` jobs.
- It assumes the target is a fresh remote Supabase project.

After it finishes, update your app `.env` to point at the new lab project.
