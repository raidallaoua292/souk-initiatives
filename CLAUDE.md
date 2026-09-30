@AGENTS.md
# سوق المبادرات — Project Instructions

## 1. Project Overview

This repository contains the frontend of **سوق المبادرات (Souk Initiatives)**, an Algerian platform for discovering, publishing, joining, and supporting community initiatives.

The product connects:

* Initiative organizers
* Volunteers
* Experts
* Partners
* Supporters
* Community contributors

The current repository is intentionally being developed in a **frontend-first / mock-data phase**.

The current objective is to build a complete, coherent, production-quality frontend experience before introducing the real backend.

---

## 2. Current Development Phase

### Current phase: Frontend + Mock Data

The application currently has:

* No real authentication
* No PostgreSQL connection
* No Prisma integration
* No Supabase
* No real API/backend
* No WebSocket/realtime layer
* No persistent database state

Application state is currently held in the client-side mock store.

Do NOT introduce backend infrastructure unless the task explicitly requests moving to the backend phase.

### Future backend direction

The planned backend direction is:

* PostgreSQL
* Prisma ORM
* Server-side services / API
* Real authentication
* Persistent application/team/message/notification data

Frontend components should therefore be written in a way that makes the future transition possible without unnecessarily coupling UI components to the mock implementation.

---

# 3. Technology Stack

Current stack:

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* ESLint 9
* Lucide React
* `@fontsource/cairo`
* `@fontsource/tajawal`

Use the versions already installed in `package.json`.

Do not upgrade or replace framework versions as part of a normal feature task.

Do not introduce another CSS framework unless explicitly requested.

Do not introduce another component framework unless explicitly requested.

---

# 4. Next.js Rules

This is a Next.js 16 project.

Before making changes involving Next.js APIs, routing, rendering, configuration, or framework conventions:

1. Inspect the existing implementation.
2. Follow the repository's `AGENTS.md` Next.js instructions.
3. If the relevant local Next.js documentation exists under `node_modules/next/dist/docs/`, consult it when necessary.
4. Prefer current Next.js 16 conventions over older patterns from memory.

Use the App Router.

Do not introduce Pages Router patterns.

Do not create unnecessary API routes during the mock-data phase.

---

# 5. Repository Architecture

The current architecture intentionally separates UI, domain logic, mock data, services, and state.

Follow this separation.

High-level structure:

```text
app/
  public routes
  dashboard routes
  initiative routes

components/
  reusable UI
  layout
  feature components

lib/
  applications/
  forms/
  mock-data/
  services/
  store/
  utilities

types/
  domain models and shared TypeScript types

public/
  static assets
```

Do not collapse business logic into page components.

Do not move domain rules into React components.

Do not make components directly manipulate mock data arrays.

---

# 6. Data Flow

The preferred data flow is:

```text
Page
  ↓
Component
  ↓
Mock Store / Service
  ↓
Domain Rules
  ↓
Mock Data
```

For the current dashboard architecture:

```text
Server service
  ↓
Mock store seed
  ↓
MockStoreProvider
  ↓
useMockStore()
  ↓
Client UI
```

The root layout initializes the mock store.

The existing `MockStoreProvider` is the source of client-side mutable state.

Use:

```ts
useMockStore()
```

inside client components when interacting with dashboard mock state.

Do not bypass the store by importing and mutating mock arrays directly.

---

# 7. Mock Data Rules

Mock data currently lives under:

```text
lib/mock-data/
```

The mock-data index currently exposes:

* wilayas
* categories
* users
* initiatives
* applications

The current demo account is:

```ts
MOCK_CURRENT_USER_ID
```

Do not introduce hard-coded user IDs throughout components.

If the current user is needed, obtain it from the existing store/service architecture.

Mock data must look realistic enough to demonstrate the actual product.

Prefer realistic Algerian:

* names
* wilayas
* initiative titles
* categories
* participation roles
* descriptions
* skills
* dates

Avoid meaningless placeholders such as:

```text
John Doe
Test User
Lorem ipsum
Initiative 1
Example text
```

unless the task explicitly requires placeholders.

---

# 8. State Management

The current state mechanism is:

```text
lib/store/
```

with:

```text
MockStoreProvider
useMockStore
```

The state is temporary.

It survives client-side navigation but resets after a full page refresh.

This behavior is intentional in the current phase.

Do not add localStorage, IndexedDB, Zustand, Redux, or another state library simply to make mock data persistent.

If persistence is requested, discuss whether the request is actually a transition toward the backend phase before implementing a new persistence layer.

---

# 9. Services

Services are located under:

```text
lib/services/
```

Services provide a boundary between the UI and the current data source.

Examples include:

```text
dashboard-service
category-service
wilaya-service
user-service
initiative-service
application-service
```

The important architectural principle is:

> UI components should not care whether data comes from mock data, Prisma, or an API.

When adding a new feature:

1. Check whether an existing service already provides the required data.
2. Reuse it if possible.
3. Add a service method if necessary.
4. Keep data access outside presentation components.

Do not put data retrieval logic directly inside large page components.

---

# 10. Domain Logic

Business rules belong in domain modules.

Current application/team rules are located under:

```text
lib/applications/
```

Especially:

```text
lib/applications/domain.ts
```

This layer contains pure rules for:

* application eligibility
* submitting applications
* withdrawing applications
* accepting applications
* rejecting applications
* changing team roles
* removing members
* team membership
* filtering applications
* Arabic search normalization
* application status counts

These rules should remain framework-independent.

Do not move these rules into React components.

Do not duplicate these rules inside event handlers.

If a business rule already exists in the domain layer, reuse it.

---

# 11. Result Pattern

The current application/store architecture uses:

```ts
Result<T>
```

for operations that can succeed or fail.

Follow the existing pattern.

Prefer:

```ts
const result = someOperation();

if (!result.ok) {
  // handle error
}
```

instead of introducing unrelated error-handling conventions.

Do not silently ignore failed domain operations.

User-facing error messages should remain in Arabic where the existing feature uses Arabic UI.

---

# 12. Application Domain

Applications currently support:

```text
PENDING
ACCEPTED
REJECTED
WITHDRAWN
```

Participation roles:

```text
VOLUNTEER
EXPERT
PARTNER
SUPPORTER
```

Applications contain information such as:

* initiative
* applicant
* role
* skills
* availability
* commitment
* message
* supporting information
* status
* timestamps
* review information
* withdrawal information

Do not invent parallel status systems.

Reuse the existing types and constants.

---

# 13. Team Membership

Team membership is derived from accepted applications.

Conceptually:

```text
Application.status === ACCEPTED
        ↓
Team member
```

Do not create a second independent membership state that can drift away from applications.

When changing application/team behavior, preserve this invariant.

Removing an accepted member currently transitions the application to:

```text
WITHDRAWN
```

with:

```text
withdrawnBy = "OWNER"
```

unless the task explicitly changes the domain model.

---

# 14. Initiative Forms

Initiative form logic is located under:

```text
lib/forms/
```

Do not duplicate validation rules inside page components.

Existing initiative form logic includes validation and mapping between form values and initiative records.

Reuse:

```text
initiative-form.ts
validators
```

when working on initiative creation/editing.

The same principle applies to profile and application forms.

---

# 15. Routes

Existing important routes include:

```text
/
 /initiatives/[id]

/dashboard
/dashboard/initiatives/new
/dashboard/initiatives/[id]
/dashboard/initiatives/[id]/edit
/dashboard/initiatives/[id]/applications
/dashboard/initiatives/[id]/team
/dashboard/applications
/dashboard/profile
```

When adding routes:

* follow the existing App Router structure
* use meaningful route segments
* keep public and dashboard concerns separate
* do not create duplicate routes for the same concept

Before creating a new route, inspect whether an existing route can support the requested behavior.

---

# 16. Public vs Dashboard Data

There is an intentional distinction between:

### Public experience

Public initiative pages use the service/data layer.

### Dashboard experience

Dashboard mutations currently operate through the client-side mock store.

Do not assume that creating an initiative inside the dashboard automatically means it must appear in public server-rendered pages.

If changing this behavior, explicitly account for the current mock-state architecture.

---

# 17. Arabic RTL

The application is Arabic-first.

The root document currently uses:

```html
<html lang="ar" dir="rtl">
```

Preserve this.

Arabic UI is the default.

Use:

* Arabic labels
* Arabic validation messages
* RTL layouts
* correct Arabic typography
* culturally appropriate wording

Do not introduce English labels merely because they are easier to implement.

English may be used for:

* code
* TypeScript identifiers
* route names
* technical comments
* developer-facing messages

---

# 18. Typography

The project already uses self-hosted:

```text
Cairo
Tajawal
```

Do not replace these with remote Google font loading.

Use the existing font setup.

Recommended hierarchy:

* Cairo for headings and strong UI labels
* Tajawal where appropriate for readable body/interface text

Maintain visual consistency with the existing application.

---

# 19. Design System

Primary project identity:

```text
Primary Green:     #0D6B58
Background:        #F5EFE6
Accent Terracotta: #CB7938
Dark Text:         #24332E
```

The visual direction is:

* modern
* clean
* youthful
* professional
* Arabic-first
* community-oriented
* spacious
* accessible

Avoid:

* excessive gradients
* excessive shadows
* excessive rounded cards
* visual clutter
* unnecessary decorative icons
* noisy backgrounds
* excessive animations
* excessive colors

Do not redesign the entire application when implementing a single feature.

Reuse the existing design language.

---

# 20. Components

Before creating a component:

1. Search `components/`.
2. Check whether an existing component can be reused.
3. Extend an existing component when appropriate.
4. Create a new component only when it represents a meaningful reusable UI unit.

Avoid giant components.

Avoid duplicating:

* cards
* buttons
* badges
* dialogs
* form controls
* empty states
* loading states
* status labels

Feature-specific components may remain inside their feature area when they are not genuinely reusable.

---

# 21. Client vs Server Components

Use Server Components by default.

Use `"use client"` only when required by:

* React state
* event handlers
* browser APIs
* client-side store access
* interactive UI

Do not mark an entire route as client-side merely because one child component needs interactivity.

Keep interactive parts as small as practical.

---

# 22. TypeScript

TypeScript must remain strict and meaningful.

Prefer existing domain types.

Do not use:

```ts
any
```

unless there is a documented and unavoidable reason.

Prefer:

```ts
unknown
```

with proper narrowing when the type is genuinely unknown.

Avoid duplicated interfaces representing the same domain concept.

Keep shared domain types under:

```text
types/
```

---

# 23. Naming

Use:

* English for code identifiers
* Arabic for user-facing content

Examples:

```ts
initiative
application
applicant
organizer
participationRole
```

Avoid transliterated Arabic identifiers in code.

Use clear names rather than abbreviations.

---

# 24. Forms

Forms should have:

* clear labels
* useful validation
* meaningful error messages
* correct RTL alignment
* keyboard accessibility
* disabled/loading states when appropriate
* clear success feedback

Do not rely only on placeholder text as labels.

Do not duplicate domain validation inside UI if the domain/form layer already owns it.

---

# 25. Error, Empty and Loading States

Every meaningful data-driven screen should consider:

### Loading

Show an appropriate loading state where asynchronous work exists.

### Empty

Explain what is empty and what the user can do next.

### Error

Show a useful Arabic message and, where appropriate, a retry/action.

Avoid blank screens.

Avoid generic:

```text
Something went wrong
```

when a more useful message is available.

---

# 26. Accessibility

Use semantic HTML.

Interactive elements must be keyboard accessible.

Buttons should be buttons.

Links should be links.

Inputs need accessible labels.

Icons should not be the only way to communicate meaning.

Do not use color alone to represent status.

Maintain sufficient contrast.

---

# 27. Responsive Design

The application must work on:

* mobile
* tablet
* desktop

Do not design desktop-first layouts that become unusable on mobile.

For dashboard tables/lists, consider:

* responsive cards
* horizontal scrolling where appropriate
* stacked controls
* mobile-friendly actions

Do not simply shrink desktop UI.

---

# 28. Arabic Search

The application already contains Arabic search normalization.

Reuse the existing normalization behavior instead of implementing a second incompatible search function.

When filtering Arabic names/content, consider:

* أ / إ / آ → ا
* ة → ه
* ى → ي
* tashkeel
* tatweel
* whitespace normalization

Do not duplicate this logic in components.

---

# 29. Notifications and Messaging

When implementing notifications or messaging in the frontend phase:

Use mock data and the same architectural separation:

```text
types
  ↓
mock-data
  ↓
services
  ↓
store
  ↓
components
  ↓
pages
```

Do not introduce WebSockets.

Do not introduce a real messaging backend.

Do not introduce browser persistence unless explicitly requested.

Future backend compatibility matters more than simulating infrastructure.

---

# 30. Future Prisma Compatibility

The current TypeScript domain models should remain compatible with a future Prisma backend.

When defining a new domain entity:

Prefer:

```text
stable ID
foreign-key references
explicit status values
ISO date-time strings at the UI/domain boundary
clear relationships
```

Avoid frontend-only structures that would make a future database model unnecessarily difficult.

Do not add Prisma now unless explicitly instructed.

---

# 31. Do Not Over-Engineer

Do not introduce architecture merely because it is theoretically scalable.

Before adding:

* a state library
* a repository abstraction
* a new service layer
* a new dependency
* a generic framework
* a custom event bus
* a persistence layer

ask whether the current architecture already solves the problem.

Prefer the smallest change consistent with the existing architecture.

---

# 32. Preserve Existing Behavior

Before modifying an existing feature:

1. Read the relevant files.
2. Understand current behavior.
3. Identify existing business rules.
4. Reuse existing components.
5. Avoid unrelated refactors.

Do not rewrite working features merely to match a preferred coding style.

Do not rename public routes without an explicit reason.

Do not change domain semantics while implementing a UI request.

---

# 33. AI Agent Workflow

When working on a task:

### Step 1 — Inspect

Read the relevant:

* routes
* components
* types
* services
* store
* forms
* domain rules
* mock data

### Step 2 — Plan

Determine:

* what already exists
* what can be reused
* what needs to be added
* what files should change

### Step 3 — Implement

Make the smallest coherent change.

### Step 4 — Validate

Run:

```bash
npm run lint
npm run build
```

when practical.

If only a very small change was made, lint is still expected.

If a check cannot run, report why.

### Step 5 — Review

Check:

* TypeScript errors
* RTL behavior
* mobile layout
* accessibility
* broken routes
* duplicated logic
* accidental dependency changes

### Step 6 — Report

Summarize:

* files changed
* functionality added
* validation performed
* known limitations

---

# 34. Dependency Policy

Do not install a new npm package unless:

1. The requirement genuinely needs it.
2. Existing project dependencies cannot reasonably solve it.
3. The dependency is compatible with the current Next.js/React versions.
4. The change is explained.

Avoid dependency proliferation.

The current project already uses:

```text
lucide-react
@fontsource/cairo
@fontsource/tajawal
```

Reuse them.

---

# 35. Git Safety

Do not:

* delete unrelated files
* reset unrelated changes
* rewrite git history
* force-push
* overwrite user changes
* modify configuration unrelated to the task

Before large changes, inspect the working tree.

Preserve existing work.

---

# 36. Important Current Constraints

Until explicitly changed:

```text
NO PostgreSQL
NO Prisma
NO Supabase
NO real authentication
NO real API
NO WebSockets
NO real-time backend
NO persistent database
```

The current goal is a complete frontend product using realistic mock data.

---

# 37. Definition of Done

A feature is considered complete when:

* it fits the existing architecture
* it works with the current mock store where applicable
* business rules remain outside UI components
* TypeScript remains clean
* RTL is correct
* mobile behavior is considered
* loading/empty/error states are handled
* existing functionality is not broken
* `npm run lint` passes
* `npm run build` passes when applicable
* no unnecessary dependency was introduced
* no backend infrastructure was introduced accidentally
* the implementation remains compatible with the future PostgreSQL + Prisma direction

---

# 38. Priority Order

When making implementation decisions, use this priority:

1. Existing repository architecture
2. Correct product behavior
3. Domain/business rules
4. Type safety
5. Accessibility
6. RTL and Arabic UX
7. Responsive design
8. Visual consistency
9. Code simplicity
10. Future backend compatibility

Do not sacrifice current correctness merely for speculative future architecture.
