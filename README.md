This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Dashboard (mock, client-side)
Routes: `/dashboard`, `/dashboard/initiatives/new`, `/dashboard/initiatives/[id]` (preview),
`/dashboard/initiatives/[id]/edit`, `/dashboard/profile`.

- **No auth, no backend.** The dashboard acts as a fixed demo user (`MOCK_CURRENT_USER_ID` in `lib/mock-data`).
- **State is temporary.** `lib/store/` keeps the user's initiatives and profile in memory
  (`MockStoreProvider`, mounted in the root layout). It survives client-side navigation and resets on a full refresh.
- **Data flow:** server services (`lib/services/dashboard-service.ts`) seed the store; UI only talks to `useMockStore()`.
  Swap the seed/actions for real API or Prisma calls later without touching components.
- **Form logic** (validation, mapping to `Initiative`) is pure and lives in `lib/forms/`.
- New initiatives are not visible on public pages (those are server-rendered from the service layer); use the dashboard preview route.

## Applications & team management (mock, client-side)

Everything below runs on the in-memory store (`lib/store`). **Data is temporary demo data**: it survives in-app navigation and resets on a full page reload. There is no backend, database, API route or authentication.

- **Mock user:** `usr-01` (أمينة بلحاج), labelled "حساب تجريبي". She owns `init-06` and `init-13`, so she is both an applicant and an owner.
- **Join an initiative** — `/initiatives/[id]` lists opportunities (volunteer / expert / partner / supporter, skills, commitment) and an "انضم إلى المبادرة" card. `/initiatives/[id]/apply` holds the form. A second active (pending/accepted) application is blocked; rejected or withdrawn ones can re-apply.
- **My applications** — `/dashboard/applications`: status tabs, details, withdraw (pending only).
- **Review applications (owner)** — `/dashboard/initiatives/[id]/applications`: filter by status/role, Arabic-normalised search, accept or reject with a note (a reason is required to reject). A decided application cannot be decided again.
- **Team** — `/dashboard/initiatives/[id]/team`: accepted members, change role, remove with confirmation. Team membership is derived from ACCEPTED applications, so both pages always agree; removing a member sets the application to WITHDRAWN (by owner).
- **Layers:** types in `types/application.ts`, `types/participation.ts`; pure rules in `lib/applications/domain.ts`; store actions return `Result<T>`.
