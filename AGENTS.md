# Souk Initiatives — AI Agent Instructions

## Project

This is the frontend of **سوق المبادرات (Souk Initiatives)**, an Arabic RTL Algerian initiative marketplace.

The repository is currently in the:

> **Frontend + Mock Data phase**

Do not introduce backend infrastructure unless explicitly requested.

---

## Current Stack

* Next.js 16
* App Router
* React 19
* TypeScript
* Tailwind CSS 4
* ESLint
* Lucide React
* Cairo
* Tajawal

Use the versions already installed in `package.json`.

---

## Current Architecture

Follow the existing architecture:

```text
app/
components/
lib/
  applications/
  forms/
  mock-data/
  services/
  store/
types/
public/
```

Preferred flow:

```text
Page
→ Component
→ Store / Service
→ Domain / Form Rules
→ Mock Data
```

Do not bypass this architecture.

---

## Mock Phase Constraints

Do NOT add any of the following unless explicitly requested:

* PostgreSQL
* Prisma
* Supabase
* real authentication
* API/backend
* WebSockets
* realtime infrastructure
* persistent database
* Redux/Zustand or another state library

The current client state is intentionally temporary.

Use:

```ts
useMockStore()
```

for mutable dashboard/application state.

---

## Important Existing Modules

Before implementing a feature, inspect these when relevant:

```text
lib/store/
lib/mock-data/
lib/services/
lib/forms/
lib/applications/
types/
components/
```

Business rules for applications/team membership are already implemented in:

```text
lib/applications/domain.ts
```

Do not duplicate those rules inside React components.

---

## Application Rules

Existing application statuses:

```text
PENDING
ACCEPTED
REJECTED
WITHDRAWN
```

Existing participation roles:

```text
VOLUNTEER
EXPERT
PARTNER
SUPPORTER
```

Team membership is derived from:

```text
Application.status === ACCEPTED
```

Preserve this invariant.

Use the existing domain functions and `Result<T>` pattern.

---

## RTL / Arabic

The application is Arabic-first.

Preserve:

```html
<html lang="ar" dir="rtl">
```

Use Arabic for user-facing UI.

Use English for:

* code identifiers
* routes
* technical comments
* internal types

Do not introduce English UI unnecessarily.

---

## Design

Respect the existing visual identity:

```text
Primary:    #0D6B58
Background: #F5EFE6
Accent:     #CB7938
Text:       #24332E
```

Design direction:

* clean
* modern
* youthful
* professional
* spacious
* Arabic-first

Avoid excessive:

* gradients
* shadows
* colors
* icons
* animations
* decorative elements
* rounded cards

Reuse existing components before creating new ones.

---

## Components

Before creating a new component:

1. Search `components/`.
2. Check for an existing reusable component.
3. Reuse or extend it where appropriate.
4. Create a new component only when it has a clear responsibility.

Avoid giant page components and duplicated UI.

---

## Client Components

Use Server Components by default.

Use:

```ts
"use client";
```

only when needed for:

* React state
* event handlers
* browser APIs
* mock store access
* interactive behavior

Do not make an entire route client-side unnecessarily.

---

## Forms

Keep validation and mapping in:

```text
lib/forms/
```

Do not duplicate existing validation rules inside page components.

Forms should provide:

* labels
* validation
* Arabic error messages
* loading/disabled states
* success feedback
* keyboard accessibility

---

## Types

Reuse existing types from:

```text
types/
```

Do not create duplicate domain interfaces.

Avoid:

```ts
any
```

unless absolutely necessary.

Prefer strict, explicit types.

---

## Mock Data

Mock data lives under:

```text
lib/mock-data/
```

Use the existing mock services and store.

Do not directly mutate mock arrays from UI components.

Use realistic Algerian data when adding examples.

---

## Public vs Dashboard

Public pages and dashboard state have intentionally different data flows.

Dashboard mutations currently operate through:

```text
MockStoreProvider
```

Do not assume dashboard-created mock data is automatically available to public server-rendered pages.

Preserve the current architecture unless the task explicitly changes it.

---

## New Features

For every feature:

### 1. Inspect

Read existing relevant code first.

### 2. Reuse

Reuse existing:

* types
* services
* domain rules
* store actions
* components
* utilities

### 3. Implement

Make the smallest coherent change.

### 4. Validate

Run:

```bash
npm run lint
npm run build
```

when applicable.

### 5. Review

Check:

* TypeScript
* RTL
* mobile layout
* accessibility
* empty states
* error states
* loading states
* existing behavior

---

## Do Not Refactor Unnecessarily

Do not rewrite working code merely for style.

Do not rename routes without a reason.

Do not change business rules while implementing UI changes.

Do not introduce a new abstraction unless the existing architecture cannot reasonably support the feature.

---

## Dependency Policy

Do not install dependencies unless genuinely necessary.

Prefer the packages already installed.

If a dependency is required, explain why it is needed and ensure compatibility with the existing Next.js/React versions.

---

## Git Safety

Never:

* reset unrelated changes
* delete unrelated files
* overwrite user work
* rewrite git history
* force-push
* modify unrelated configuration

Inspect the repository before large changes.

---

## Completion Report

After implementation, report briefly:

```text
Changed:
- ...

Added:
- ...

Validated:
- npm run lint
- npm run build

Notes:
- ...
```

If a validation command fails, report the actual failure instead of claiming success.

---

## Next.js Generated Instructions

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
