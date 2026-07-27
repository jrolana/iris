# Jhoanna Olana Contributions Inside the App (code/src/app)

Generated: 2026-06-15 14:10:01 PST

Scope: Next.js app router source under code/src/app only. This excludes generated .next files and non-route supporting code such as components, hooks, services, scripts, and database SQL.

## Author identities matched
- Jhoanna Olana <113810517+jrolana@users.noreply.github.com>
- Jhoanna Olana <jhoannaolana@Jhoannas-MacBook-Air.local>
- jrolana <olanajhoanna@gmail.com>

## Summary
- Matching commits touching app routes/actions: 112

- Unique app files touched: 99

- Unique app files added: 59


## Main app contributions inferred from commit subjects and touched route files

### Authentication, signup, and invite flow
- Built and maintained auth route pages/layouts for sign in, signup, callback, welcome, and error handling.
- Added inline sign-in errors, redirect handling, invite link routing, invite server action, welcome flow, and unregistered-user sign-in blocking.
- Improved signup UX including validation, scroll behavior, email/user type fields, and invite acceptance behavior.

### Role-based app areas and layouts
- Added/maintained route groups for guest, admin, techgen, UP official, homepage, full-width pages, and sidebar/full-width role layouts.
- Contributed route-level access/UX behavior tied to roles and home-route behavior.

### Application registry and dashboards
- Built application registry pages for guest, admin, UP official, and homepage-facing views.
- Added dashboard template work and route pages for admin/techgen areas, including later performance and loading/rendering fixes.

### User management and registration requests
- Added admin user-management route.
- Added server-side invite-user action route support.
- Built/updated registration request flow, including approval/rejection-related pages and route behavior.

### Application documents and guide pages
- Added guest, admin, and techgen application-document pages.
- Added guest and techgen application-guide pages.
- Added public resource server action for uploading/deleting application documents.

### Notifications and pings
- Added all-notifications pages for admin and techgen.
- Added admin pings page.
- Connected route pages to notification/ping workflows and improved UX around unread notifications and pings.

### Application workflow pages
- Added and maintained start-application and view-application client route wrappers for admin/TTBDO and techgen flows.
- Fixed searchParam/Suspense build issues and rendering problems in these app-router pages.

### Audit trail and security/compliance UI
- Added admin audit-trail route page.
- Touched app routes for audit logging, security hardening, auth failure logging, rate limiting integration, and baseline security headers.

### App quality, performance, and build fixes
- Cleaned unused starter/default pages.
- Fixed hydration, build, routing, proxy/middleware, image delivery, SEO, lazy loading, provider loading, and public-route component loading issues.

## App files first added by matching commits
COMMIT a236c69 2026-04-19 [Olana][Feature]Update Docs in Application Documents Page
A	code/src/app/actions/public-resources.ts
A	code/src/app/admin/(with-sidebar)/application-document/page.tsx
COMMIT 7b1eb5c 2026-04-17 [Olana][Enhancement] Optimize auth pages and provider loading
A	code/src/app/(full-width-pages)/(auth)/signup/layout.tsx
COMMIT 431fea8 2026-04-06 [Olana][Fix] Build Issues - Added suspense/props to those that use searchParams
A	code/src/app/(full-width-pages)/(auth)/signin/SigninPageClient.tsx
A	code/src/app/(full-width-pages)/welcome/WelcomePageClient.tsx
A	code/src/app/admin/(full-width)/start-application/StartApplicationPageClient.tsx
A	code/src/app/admin/(full-width)/view-application/TtbdoViewApplicationPageClient.tsx
A	code/src/app/techgen/(full-width)/start-application/StartApplicationPageClient.tsx
A	code/src/app/techgen/(full-width)/view-application/TechgenViewApplicationPageClient.tsx
COMMIT 905f07d 2026-03-04 [Olana][Feature] Pings Dropdown and View All - Enhanced Pings and View All UI
A	code/src/app/admin/(full-width)/pings/page.tsx
COMMIT 478bf13 2026-02-27 [Olana][Feature] All Notifications Page
A	code/src/app/admin/(full-width)/notifications/page.tsx
A	code/src/app/techgen/(full-width)/notifications/page.tsx
COMMIT 34a961f 2026-01-22 [Olana][Feature] Inivte User backend, Welcome Page - WIP
A	code/src/app/(full-width-pages)/welcome/page.tsx
A	code/src/app/app/actions/invite-user.ts
COMMIT 1463bd9 2025-12-30 [Olana][Enhancement] Pie Charts Colors and UI Constants
A	code/src/app/admin/(with-sidebar)/audit-trail/page.tsx
COMMIT 59915cd 2025-12-05 [Olana][Feature] Application Documents - Techgen and Guest
A	code/src/app/(guest)/application-document/page.tsx
A	code/src/app/techgen/(with-sidebar)/application-document/page.tsx
COMMIT 22fbfed 2025-12-05 [Olana][Enhancements] Application Guide - Guest and TechGen
A	code/src/app/techgen/(with-sidebar)/application-guide/page.tsx
COMMIT 1fbe859 2025-12-05 [Olana][Feature] Application Guide
A	code/src/app/(guest)/application-guide/page.tsx
COMMIT 79c649f 2025-12-05 [Olana][Enhancements] Guest Dashboard and Applications Registry
A	code/src/app/(guest)/application-registry/page.tsx
COMMIT 0c904e3 2025-12-05 [Olana][Enhancements] Centralized Layout, Uniform UI, Added Consts
A	code/src/app/admin/(full-width)/layout.tsx
A	code/src/app/techgen/(full-width)/layout.tsx
COMMIT ad9c824 2025-12-01 [Olana][Feature] Guest Dashboard and Application Registry
A	code/src/app/(homepage)/application-registry/page.tsx
COMMIT ef15c3c 2025-12-01 [Olana][Feature] UP Officials Page
A	code/src/app/up-official/application-registry/page.tsx
COMMIT 0dfe9d2 2025-12-01 [Olana][Feature] Applications Registry and User Management - Admin
A	code/src/app/(homepage)/_.tsx
A	code/src/app/admin/application-registry/page.tsx
A	code/src/app/admin/user-management/page.tsx
COMMIT 2ab565e 2025-11-26 Stop tracking .env
A	code/src/app/(full-width-pages)/(auth)/layout.tsx
A	code/src/app/(full-width-pages)/(auth)/signin/callback/route.ts
A	code/src/app/(full-width-pages)/(auth)/signin/page.tsx
A	code/src/app/(full-width-pages)/(auth)/signup/page.tsx
A	code/src/app/(full-width-pages)/(error-pages)/error-404/page.tsx
A	code/src/app/(full-width-pages)/layout.tsx
A	code/src/app/(homepage)/layout.tsx
A	code/src/app/(homepage)/page.tsx
A	code/src/app/admin/(others-pages)/(chart)/bar-chart/page.tsx
A	code/src/app/admin/(others-pages)/(chart)/line-chart/page.tsx
A	code/src/app/admin/(others-pages)/(forms)/form-elements/page.tsx
A	code/src/app/admin/(others-pages)/(tables)/basic-tables/page.tsx
A	code/src/app/admin/(others-pages)/blank/page.tsx
A	code/src/app/admin/(others-pages)/calendar/page.tsx
A	code/src/app/admin/(others-pages)/profile/page.tsx
A	code/src/app/admin/(ui-elements)/alerts/page.tsx
A	code/src/app/admin/(ui-elements)/avatars/page.tsx
A	code/src/app/admin/(ui-elements)/badge/page.tsx
A	code/src/app/admin/(ui-elements)/buttons/page.tsx
A	code/src/app/admin/(ui-elements)/images/page.tsx
A	code/src/app/admin/(ui-elements)/modals/page.tsx
A	code/src/app/admin/(ui-elements)/videos/page.tsx
A	code/src/app/admin/layout.tsx
A	code/src/app/admin/page.tsx
A	code/src/app/favicon.ico
A	code/src/app/globals.css
A	code/src/app/layout.tsx
A	code/src/app/not-found.tsx
A	code/src/app/techgen/layout.tsx
A	code/src/app/techgen/page.tsx
A	code/src/app/up-official/layout.tsx
A	code/src/app/up-official/page.tsx

## All matching commits touching code/src/app
- 3318c73 | 2026-05-31 | [Olana][Feature] Applied Rate Limiting
- 5896453 | 2026-05-31 | [Olana][Enhancement] Tightened proof of concept api, Added baseline security headers
- e7311af | 2026-05-24 | Merge branch 'main' into comsec
- 41dd8ea | 2026-05-24 | [Olana][Enhancement] Added more auth fail logs
- 52383f3 | 2026-05-23 | [Olana][Enhancement] Added auth problem logs
- 47c8cf3 | 2026-05-23 | [Olana][Enhancement] Signin redirect uses NEXT_PUBLIC_SITE_URL
- a8eba4c | 2026-05-14 | Merge branch 'main' into comsec
- 2541664 | 2026-05-08 | [Olana][Fiz] Build error fix
- a040b69 | 2026-05-08 | [Olana][Enhancement] Tech gen removal adn addition UX
- 18277cf | 2026-05-08 | [Olana][Feature] Techgen new app 1 inventor issue
- 4b5d1d0 | 2026-05-07 | [Olana][Enhancement] Added sign in error messgae inline
- 986f76c | 2026-05-07 | [Olana][Feature] removed file size limit for uplaoding in public doc bucket
- 3db210c | 2026-05-07 | [Olana][Feature] Audited more actions
- 2ed5f44 | 2026-04-30 | Merge branch 'main' into comsec
- fa58788 | 2026-04-30 | [Olana][Fix] rever to auth handle
- 67e42b4 | 2026-04-29 | [Olana][Enhancement] Used a constant for admin email
- 8917f40 | 2026-04-29 | [Olana][Setup] Debian
- 3d0fdc0 | 2026-04-29 | [Olana][Enhancement] Signin Error Message, Toast Removed Delay Mount, Inserts all Invites into User Registration Request so that its the source of truth for all Auth Entry
- 9a3589c | 2026-04-25 | [Olana][Enhancement] Dev settings last, Notice iris only uses gmail acc
- 144e669 | 2026-04-21 | Merge branch 'main' into penetration-testing
- 11fb97f | 2026-04-21 | [Olana][Fix] removed next url
- 70307b8 | 2026-04-21 | [Olana][Fix] url from vercel for invite user
- f0919b6 | 2026-04-21 | Merge branch 'main' into penetration-testing
- b73c701 | 2026-04-20 | [Olana][Feature] Handles server error component for invite users
- 84c1b2b | 2026-04-20 | [Olana][Enhancement] Used previous welcome page link to redirect users upon accepting invite, used prev email template, Irrelevant format chnange was caused by prettier
- c21d12e | 2026-04-20 | [Olana][Fix] Removed redundant db calls in invite user
- 77f73ab | 2026-04-20 | [Olana][Fix] Node modules Fix, Invite user action fix
- 6636b3d | 2026-04-20 | Merge branch 'main' into penetration-testing
- 2aa7a37 | 2026-04-20 | [Olana] Merge with main from performance test fix
- feb346f | 2026-04-19 | [Olana][Enhancement] Added ttbdo email
- 3ac0e6b | 2026-04-19 | [Olana][Enhancement] Removed fullwidth
- ad648cb | 2026-04-19 | [Olana][Enhancement] Added new app in techgen dashboard, Wrapped techgen/files counts in view app, Improved user schema
- 56b5d4e | 2026-04-19 | [Olana][Enhancement] Signup Scrollbar and Other as Last itme in the List, Used initials as default image pic
- a236c69 | 2026-04-19 | [Olana][Feature]Update Docs in Application Documents Page
- 1ce46a2 | 2026-04-19 | [Olana][Feature] Notifications Link to App and Removal of Techgen
- f79656f | 2026-04-19 | [Olana][Feature] Add User Role Change in Details and Request, Added Rejection Reason in Request
- 07b25ab | 2026-04-17 | [Olana][Enhancement] Penetration Test
- a673c5b | 2026-04-17 | Merge branch 'performance-test-fix' into test-playwright-with-performance-fix
- 676882f | 2026-04-17 | Merge branch 'main' into playwright-tests
- 10bd5a4 | 2026-04-17 | [Olana][Fix] Hydration Error
- 7b1eb5c | 2026-04-17 | [Olana][Enhancement] Optimize auth pages and provider loading
- b0315ec | 2026-04-16 | [Olana][Enhancement] Image Delivery, Response Size, Restrict loading of components for public routes
- 2211b39 | 2026-04-16 | [Olana][Enhancement] Dynamic Imports, Lazy Load on Dashboard  and Saved role on cookie
- fdb7fc1 | 2026-04-16 | [Olana][Enhancement] SEO
- ad23665 | 2026-04-08 | [Olana][Enhancement] Added homepage link in full-width view, Added Homeroute helper, Flex-wrap buttons in App-Registry
- bab26da | 2026-04-07 | [Olana][Fix] Fixed unchanged layout pages from other branch - causes build errpr
- 1c855b0 | 2026-04-06 | [Olana][Test] Admin Use Case
- 431fea8 | 2026-04-06 | [Olana][Fix] Build Issues - Added suspense/props to those that use searchParams
- 8b5bccb | 2026-04-06 | [Olana][Clean] Clean up unused default pages/ui elements
- be5c637 | 2026-03-23 | [Olana][Enhancement] PR #75 Comments, Also changed loader icon in toasts
- a151f42 | 2026-03-22 | [Olana][Feature] Applicaiton Documents and Guide - UI and Docs
- 76a7f7c | 2026-03-22 | [Olana][Feature] New Application Relevant Files View and Download
- 29def4a | 2026-03-22 | [Olana][Feature] New App Files UI
- e407a7a | 2026-03-22 | Merge branch 'main' into dashboard-techgen
- 0c55993 | 2026-03-22 | [Olana][Enhancement] Recent Status Updates List and Techgen Metrics
- e6d0d40 | 2026-03-14 | [Olana][Feature] Fetch Users Details
- bbc248e | 2026-03-04 | [Olana][Feature] Ping - Connected to backend
- 905f07d | 2026-03-04 | [Olana][Feature] Pings Dropdown and View All - Enhanced Pings and View All UI
- 82d59ac | 2026-03-04 | Merge branch 'main' into ping
- 478bf13 | 2026-02-27 | [Olana][Feature] All Notifications Page
- d07d9ce | 2026-02-21 | [Olana][Enhancement] handles invite link expiration, better error message
- b472a6e | 2026-02-21 | [Olana][Enhancement] UX
- 4f9b2a9 | 2026-02-20 | [Olana][Fix] Fixed proxy and route inconsistency in handling invite link
- 6ea14dc | 2026-02-20 | [Olana][Enhancement] Used proxy (middleware) to handle routes instead of a hook
- a4bd551 | 2026-02-20 | [Olana][Feature] Stop unregistered from sign-in, Better error message for signin-errors, Used roleConfig for signin and middleware
- d519876 | 2026-02-19 | [Olana][Feature] Approval/rejection workflow
- d7fb02c | 2026-02-18 | [Olana][Revision] Removed verification link flow, UI for Registration Requests
- 630f08f | 2026-02-17 | [Olana][Enhancement] Added different fields for unlisted college_dept and external_institute - made db and system change
- c6754b1 | 2026-02-16 | [Olana][Feature] Sign-up Form UI with Validation
- 79221f7 | 2026-02-13 | Merge pull request #62 from jrolana/view-application
- 4c3fd5d | 2026-02-11 | [Olana][Fix] Techgen App View not showing every app details
- 92f6296 | 2026-02-10 | Revert "Merge branch 'new-application' into fix/start-application"
- be04ccd | 2026-02-01 | [Olana][Fix] UI Fetch and Render Error
- bb886d8 | 2026-02-01 | Merge with main
- 3850721 | 2026-02-01 | [Olana][Fix] Rendering and fetching of statuses
- 7105352 | 2026-02-01 | [Olana][Feature] Status UI
- 2b56bb1 | 2026-01-31 | [Olana][Feature] Get all status of an application
- 3ce71f5 | 2026-01-23 | [Olana][Feature] Added role type
- 8325223 | 2026-01-23 | [Olana][Feature] Email Validation, User Type
- cbf52fd | 2026-01-22 | [Olana][Fix] Invite link redirect to welcome page
- 43a4f9b | 2026-01-22 | Merge branch 'main' into user-management
- 34a961f | 2026-01-22 | [Olana][Feature] Inivte User backend, Welcome Page - WIP
- 225e1b9 | 2026-01-19 | Merge branch 'main' into database
- 4606c51 | 2026-01-18 | [Olana][Enhancement] UI on Other Pages
- 253130d | 2026-01-18 | Merge branch 'main' into database
- 0897512 | 2026-01-15 | [Olana][Fix] Authentication Redirect, Also moved table to a private schema, Added db scripts
- 8874157 | 2026-01-02 | [Olana][Paper] Chap4 - Audit Trail, Enhanced Audit Trail UI:
- f79b11e | 2025-12-31 | Merge branch 'main' into revisions/olana
- 1463bd9 | 2025-12-30 | [Olana][Enhancement] Pie Charts Colors and UI Constants
- 1d4cd69 | 2025-12-12 | Merge branch 'main' into paper/revisions
- aad7168 | 2025-12-12 | [Olana][Enhancement] Sigin In Page
- 49a7059 | 2025-12-05 | [Olana][Feature] Logo
- 1a6dcd1 | 2025-12-05 | [Olana][Enhancements] Refactor
- 59915cd | 2025-12-05 | [Olana][Feature] Application Documents - Techgen and Guest
- 22fbfed | 2025-12-05 | [Olana][Enhancements] Application Guide - Guest and TechGen
- 1fbe859 | 2025-12-05 | [Olana][Feature] Application Guide
- 79c649f | 2025-12-05 | [Olana][Enhancements] Guest Dashboard and Applications Registry
- 0c904e3 | 2025-12-05 | [Olana][Enhancements] Centralized Layout, Uniform UI, Added Consts
- 2370da1 | 2025-12-05 | Revert "Revert "[Olana][Enhancement] Added Add New User""
- 4fcdf0a | 2025-12-04 | Revert "[Olana][Feature] Guest Dashboard and Application Registry"
- dd5d16f | 2025-12-04 | Revert "[Olana][Enhancement] Added Add New User"
- 73c8f22 | 2025-12-04 | Merge branch 'main' into frontend/all-except-application-page
- 966d0e4 | 2025-12-04 | [Olana][Enhancement] Added Add New User
- ad9c824 | 2025-12-01 | [Olana][Feature] Guest Dashboard and Application Registry
- ef15c3c | 2025-12-01 | [Olana][Feature] UP Officials Page
- 0dfe9d2 | 2025-12-01 | [Olana][Feature] Applications Registry and User Management - Admin
- 9e56670 | 2025-12-01 | [Olana][Feature] Applications Table
- fbb9e67 | 2025-12-01 | [Olana][Feature] Export Reports Button
- 02efce6 | 2025-12-01 | [Olana][Enhancements] Donut Chart
- c9bdd13 | 2025-12-01 | [Olana][Feature] Dashboard Template
- a038dfb | 2025-11-30 | [Olana][Feature] Pie Chart
- 2ab565e | 2025-11-26 | Stop tracking .env

## All unique app files touched
- code/src/app/(full-width-pages)/(auth)/layout.tsx
- code/src/app/(full-width-pages)/(auth)/signin/SigninPageClient.tsx
- code/src/app/(full-width-pages)/(auth)/signin/callback/route.ts
- code/src/app/(full-width-pages)/(auth)/signin/page.tsx
- code/src/app/(full-width-pages)/(auth)/signup/layout.tsx
- code/src/app/(full-width-pages)/(auth)/signup/page.tsx
- code/src/app/(full-width-pages)/(error-pages)/error-404/page.tsx
- code/src/app/(full-width-pages)/layout.tsx
- code/src/app/(full-width-pages)/welcome/WelcomePageClient.tsx
- code/src/app/(full-width-pages)/welcome/page.tsx
- code/src/app/(guest)/_.tsx
- code/src/app/(guest)/application-document/page.tsx
- code/src/app/(guest)/application-guide/page.tsx
- code/src/app/(guest)/application-registry/page.tsx
- code/src/app/(guest)/layout.tsx
- code/src/app/(guest)/page.tsx
- code/src/app/(homepage)/_.tsx
- code/src/app/(homepage)/application-registry/page.tsx
- code/src/app/(homepage)/layout.tsx
- code/src/app/(homepage)/page.tsx
- code/src/app/actions/invite-user.ts
- code/src/app/actions/public-resources.ts
- code/src/app/admin/(full-width)/layout.tsx
- code/src/app/admin/(full-width)/new-application/page.tsx
- code/src/app/admin/(full-width)/notifications/page.tsx
- code/src/app/admin/(full-width)/pings/page.tsx
- code/src/app/admin/(full-width)/start-application/StartApplicationPageClient.tsx
- code/src/app/admin/(full-width)/start-application/layout.tsx
- code/src/app/admin/(full-width)/start-application/page.tsx
- code/src/app/admin/(full-width)/view-application/TtbdoViewApplicationPageClient.tsx
- code/src/app/admin/(full-width)/view-application/layout.tsx
- code/src/app/admin/(full-width)/view-application/page.tsx
- code/src/app/admin/(others-pages)/(chart)/bar-chart/page.tsx
- code/src/app/admin/(others-pages)/(chart)/line-chart/page.tsx
- code/src/app/admin/(others-pages)/(forms)/form-elements/page.tsx
- code/src/app/admin/(others-pages)/(tables)/basic-tables/page.tsx
- code/src/app/admin/(others-pages)/blank/page.tsx
- code/src/app/admin/(others-pages)/calendar/page.tsx
- code/src/app/admin/(others-pages)/dashboard.tsx
- code/src/app/admin/(others-pages)/profile/page.tsx
- code/src/app/admin/(ui-elements)/alerts/page.tsx
- code/src/app/admin/(ui-elements)/avatars/page.tsx
- code/src/app/admin/(ui-elements)/badge/page.tsx
- code/src/app/admin/(ui-elements)/buttons/page.tsx
- code/src/app/admin/(ui-elements)/images/page.tsx
- code/src/app/admin/(ui-elements)/modals/page.tsx
- code/src/app/admin/(ui-elements)/videos/page.tsx
- code/src/app/admin/(with-sidebar)/application-document/page.tsx
- code/src/app/admin/(with-sidebar)/application-registry/page.tsx
- code/src/app/admin/(with-sidebar)/audit-trail/page.tsx
- code/src/app/admin/(with-sidebar)/layout.tsx
- code/src/app/admin/(with-sidebar)/page.tsx
- code/src/app/admin/(with-sidebar)/user-management/page.tsx
- code/src/app/admin/application-document/page.tsx
- code/src/app/admin/application-registry/page.tsx
- code/src/app/admin/audit-trail/page.tsx
- code/src/app/admin/developer-settings/page.tsx
- code/src/app/admin/layout.tsx
- code/src/app/admin/new-application/page.tsx
- code/src/app/admin/notifications/page.tsx
- code/src/app/admin/page.tsx
- code/src/app/admin/pings/page.tsx
- code/src/app/admin/start-application/StartApplicationPageClient.tsx
- code/src/app/admin/start-application/page.tsx
- code/src/app/admin/user-management/page.tsx
- code/src/app/admin/view-application/TtbdoViewApplicationPageClient.tsx
- code/src/app/admin/view-application/page.tsx
- code/src/app/api/users/route.ts
- code/src/app/app/actions/invite-user.ts
- code/src/app/favicon.ico
- code/src/app/globals.css
- code/src/app/layout.tsx
- code/src/app/not-found.tsx
- code/src/app/techgen/(full-width)/layout.tsx
- code/src/app/techgen/(full-width)/new-application/page.tsx
- code/src/app/techgen/(full-width)/notifications/page.tsx
- code/src/app/techgen/(full-width)/start-application/StartApplicationPageClient.tsx
- code/src/app/techgen/(full-width)/start-application/layout.tsx
- code/src/app/techgen/(full-width)/start-application/page.tsx
- code/src/app/techgen/(full-width)/view-application/TechgenViewApplicationPageClient.tsx
- code/src/app/techgen/(full-width)/view-application/page.tsx
- code/src/app/techgen/(with-sidebar)/application-document/page.tsx
- code/src/app/techgen/(with-sidebar)/application-guide/page.tsx
- code/src/app/techgen/(with-sidebar)/layout.tsx
- code/src/app/techgen/(with-sidebar)/page.tsx
- code/src/app/techgen/application-document/page.tsx
- code/src/app/techgen/application-guide/page.tsx
- code/src/app/techgen/application-registry/page.tsx
- code/src/app/techgen/layout.tsx
- code/src/app/techgen/new-application/page.tsx
- code/src/app/techgen/notifications/page.tsx
- code/src/app/techgen/page.tsx
- code/src/app/techgen/start-application/StartApplicationPageClient.tsx
- code/src/app/techgen/start-application/page.tsx
- code/src/app/techgen/view-application/TechgenViewApplicationPageClient.tsx
- code/src/app/techgen/view-application/page.tsx
- code/src/app/up-official/application-registry/page.tsx
- code/src/app/up-official/layout.tsx
- code/src/app/up-official/page.tsx
