1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

   > Use `--legacy-peer-deps` flag if you face peer-dependency error during installation.

2. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Production deployment

This repository now includes a Debian/Proxmox deployment bundle:

- [.env.example](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/.env.example)
- [Dockerfile](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/Dockerfile)
- [compose.yaml](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/compose.yaml)
- [deploy/systemd/iris-web.service](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/deploy/systemd/iris-web.service)
- [deploy/nginx/iris-web.conf](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/deploy/nginx/iris-web.conf)
- [deploy/PROXMOX-DEBIAN.md](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/deploy/PROXMOX-DEBIAN.md)

For a classroom security lab, use a dedicated Debian VM in Proxmox and connect the app to a separate Supabase project with throwaway data.
