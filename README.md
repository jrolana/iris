# IRIS — Information Rights Information System

IRIS is a web-based intellectual property management system built for the UP Visayas Technology Transfer and Business Development Office (TTBDO). It helps researchers, TechGen users, UP officials, and administrators manage IP disclosure and application workflows in one place—from choosing the right disclosure form to tracking requirements, statuses, reports, files, and audit activity.

This repository contains the application source code, database scripts, UML diagrams, and academic paper materials for the project.

## What IRIS Does

IRIS was designed to make IP processing clearer, more traceable, and easier to coordinate. The system supports:

- **Guided IP classification** for patents, utility models, industrial designs, trademarks, and copyright.
- **Role-based portals** for administrators, TechGen users, UP officials, and public guests.
- **Application registry and tracking** with status history, requirements, attached files, and inventor details.
- **Public resources** for downloadable IP forms and reference documents.
- **Notifications and pings** to help users follow up on delayed or updated applications.
- **Reports and audit trail records** for accountability and administrative review.
- **Supabase-backed authentication, database access, storage, policies, functions, and triggers.**

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling/UI:** Tailwind CSS, Radix UI, Headless UI, Lucide React
- **State and data fetching:** TanStack Query, Jotai
- **Backend services:** Supabase Auth, PostgreSQL, Row Level Security, Storage, Edge Functions
- **Charts and reports:** ApexCharts, jsPDF, jsPDF AutoTable
- **Tooling:** ESLint, Prettier, Supabase CLI scripts

## Repository Structure

```text
.
├── code/                  # Main Next.js application
│   ├── src/app/            # App Router pages and route groups
│   ├── src/components/     # Shared and role-specific UI components
│   ├── src/hooks/          # React Query hooks and app hooks
│   ├── src/lib/            # Types, constants, schemas, helpers
│   ├── src/services/       # Supabase-backed service functions
│   ├── scripts/            # SQL functions, policies, triggers, deploy helpers
│   └── utils/supabase/     # Supabase client/admin helpers
├── paper/                 # LaTeX paper files
├── uml diagrams code/     # PlantUML source and generated diagram output
└── README.md              # Project overview and setup guide
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 20 or newer
- npm
- A Supabase project
- Supabase CLI, if you need to apply database scripts or deploy edge functions

### 1. Install dependencies

```bash
cd code
npm install
```

If npm reports peer dependency conflicts, install with:

```bash
npm install --legacy-peer-deps
```

### 2. Configure environment variables

Create `code/.env.local` and add the required Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For server-side admin actions, edge functions, and email workflows, configure the relevant Supabase secrets as needed:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GMAIL_EMAIL=your_email_address
GMAIL_APP_PASSWORD=your_gmail_app_password
```

Keep service role keys and email credentials out of version control.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm run start
```

## Database and Supabase Setup

The database layer is maintained through SQL scripts in `code/scripts/`:

- `create_tables.sql` defines the core database tables.
- `create_views.sql` defines analytics and reporting views.
- `functions/` contains stored procedures, audit helpers, notification logic, and edge function source files.
- `policies/` contains Row Level Security policies.
- `triggers/` contains database triggers and scheduled jobs.
- `global/` contains grants and schema-level setup scripts.
- `migrations/` contains later schema changes.

A typical setup flow is:

1. Create or connect a Supabase project.
2. Apply table and enum definitions.
3. Apply functions, policies, triggers, views, and grants.
4. Create the required storage buckets for application files and public resources.
5. Configure authentication users and role records in the private user table.
6. Deploy edge functions if invite or email workflows are needed.

Review each SQL script before applying it to a shared or production database.

## Available Scripts

Run these from the `code/` directory:

```bash
npm run dev                 # Start the local development server
npm run build               # Create a production build using webpack
npm run start               # Start the production server
npm run build:turbopack     # Create a production build using Turbopack
npm run analyze             # Build with bundle analyzer enabled
npm run generate-types      # Generate Supabase TypeScript types
npm run deploy:invite-email # Deploy the invite email edge function
```

## Main User Areas

- **Guest:** Browse public guidance, view the application registry, and use the public IP form recommendation flow.
- **TechGen:** Start and manage IP applications, upload documents, review requirements, and track application progress.
- **UP Official:** View dashboards and registry information relevant to official review.
- **Admin:** Manage applications, users, resources, notifications, reports, audit trails, API tokens, and system records.

## Testing and Security Notes

The repository includes `code/iris_pentest.sh` and `code/pentest.env.example` for security-oriented checks against a configured app instance. These tests require real Supabase tokens and object IDs from test accounts.

Do not run security tests against production data unless you intentionally prepared a safe test window and backup plan.

## Documentation Assets

- `paper/` contains the academic manuscript files.
- `uml diagrams code/` contains PlantUML diagrams for use cases, database design, system flow, and sequence diagrams.
- `code/jhoanna-app-contributions.md` and related contribution reports document implementation work and file-level contributions.

## License

The application code under `code/` includes its own license file. Review `code/LICENSE` before reusing, modifying, or distributing this project.
