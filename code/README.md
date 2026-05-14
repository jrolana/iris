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
- [.env.lab.example](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/.env.lab.example)
- [.env.lab](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/.env.lab)
- [Dockerfile](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/Dockerfile)
- [compose.yaml](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/compose.yaml)
- [deploy/systemd/iris-web.service](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/deploy/systemd/iris-web.service)
- [deploy/nginx/iris-web.conf](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/deploy/nginx/iris-web.conf)
- [deploy/PROXMOX-DEBIAN.md](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/deploy/PROXMOX-DEBIAN.md)
- [deploy/REMOTE-LAB-SUPABASE.md](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/deploy/REMOTE-LAB-SUPABASE.md)
- [deploy/LAB-ENV-CHECKLIST.md](/Users/jhoannaolana/Documents/projects/schoolworks/iris/code/deploy/LAB-ENV-CHECKLIST.md)

For a classroom security lab, use a dedicated Debian VM in Proxmox and connect the app to a separate Supabase project with throwaway data.
