# Prospect Data and Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the existing Catalyx application shell to Supabase so Daniel can sign in, create prospects, view saved prospect profiles, change pipeline status, and see dashboard counts update from real data.

**Architecture:** Keep Next.js App Router as the application layer. Use Supabase Auth with cookie-based SSR, Supabase Postgres with Row Level Security, Server Components for reads, and Server Actions for mutations. Keep all business logic in small modules that can be tested without a live database; use one manual integration checkpoint against Daniel's Supabase project after the automated tests pass.

**Tech Stack:** Next.js 16, React, TypeScript, Supabase Postgres, Supabase Auth, `@supabase/ssr`, `@supabase/supabase-js`, Zod, Vitest, React Testing Library, npm.

## Global Constraints

- Repository: `cfa-cape-coral/catalyx-prospect-intelligence`.
- Repository visibility: private.
- Primary user: Daniel only.
- Keep the existing Next.js App Router structure.
- Use Server Components where practical.
- Use Server Actions for login, logout, prospect creation, and pipeline-status updates.
- Use `proxy.ts`, not `middleware.ts`, because the project is on Next.js 16.
- Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Never commit `.env.local`, API keys, passwords, or service-role keys.
- Do not use the Supabase service-role key in this milestone.
- Public account sign-up is not part of the application. Daniel's account is created manually in the Supabase dashboard.
- Row Level Security must be enabled on every public table.
- Every database query must be scoped to the authenticated user even though RLS also enforces ownership.
- Do not add AI, OCR, web research, business-card upload, background jobs, or external search.
- Do not add automatic email or SMS sending.
- Preserve the approved visual style unless a task explicitly changes it.
- All tests, linting, type checking, production build, and manual browser checks must pass before the milestone is complete.

---

## Human Setup Checkpoint Before Task 1

Daniel completes this once in the Supabase website. Codex must not guess these values.

1. Open `https://supabase.com/dashboard` and create a project named `catalyx-prospect-intelligence`.
2. Choose a strong database password and save it in a password manager.
3. Wait until the project finishes provisioning.
4. Open **Project Settings → API** or the project's **Connect** dialog.
5. Copy:
   - Project URL
   - Publishable key
6. Open **Authentication → Providers → Email**.
7. Keep email/password authentication enabled.
8. Disable public sign-ups if the dashboard offers that switch. If not, the application still exposes no sign-up page.
9. Open **Authentication → Users → Add user** and create Daniel's single login account.
10. Do not send the credentials to Codex or commit them anywhere.

The repository work can begin before the project exists, but Task 7's live integration check requires these values.

---

## Planned File Structure

```text
catalyx-prospect-intelligence/
├── app/
│   ├── auth/
│   │   └── actions.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   ├── login-form.tsx
│   │   └── page.tsx
│   ├── prospects/
│   │   ├── actions.ts
│   │   ├── new/
│   │   │   ├── new-prospect-form.tsx
│   │   │   └── page.tsx
│   │   └── [prospectId]/
│   │       ├── pipeline-status-form.tsx
│   │       └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── app-header.tsx
│   ├── dashboard-metric.tsx
│   ├── page-shell.tsx
│   ├── prospect-list.tsx
│   └── submit-button.tsx
├── lib/
│   ├── auth/
│   │   └── require-user.ts
│   ├── dashboard/
│   │   ├── metrics.test.ts
│   │   └── metrics.ts
│   ├── prospects/
│   │   ├── constants.ts
│   │   ├── queries.ts
│   │   ├── schema.test.ts
│   │   ├── schema.ts
│   │   └── types.ts
│   └── supabase/
│       ├── client.ts
│       ├── env.test.ts
│       ├── env.ts
│       ├── proxy.ts
│       └── server.ts
├── supabase/
│   └── migrations/
│       └── 20260802_create_prospect_foundation.sql
├── tests/
│   ├── dashboard-data.test.tsx
│   ├── login-form.test.tsx
│   ├── new-prospect-form.test.tsx
│   ├── prospect-profile-data.test.tsx
│   └── pipeline-status-form.test.tsx
├── .env.example
├── .gitignore
├── proxy.ts
├── README.md
└── package.json
```

### File responsibilities

- `lib/supabase/env.ts`: validates that public Supabase environment variables exist.
- `lib/supabase/client.ts`: browser Supabase client factory.
- `lib/supabase/server.ts`: cookie-aware server Supabase client factory.
- `lib/supabase/proxy.ts`: refreshes auth cookies for requests.
- `proxy.ts`: applies Supabase session refresh to application routes.
- `lib/auth/require-user.ts`: returns the authenticated user or redirects to `/login`.
- `supabase/migrations/*`: source-controlled database schema, indexes, triggers, and RLS policies.
- `lib/prospects/schema.ts`: input validation and normalized form values.
- `lib/prospects/types.ts`: TypeScript contracts used by pages and components.
- `lib/prospects/queries.ts`: authenticated prospect reads and dashboard data reads.
- `app/auth/actions.ts`: login and logout server actions.
- `app/prospects/actions.ts`: prospect creation and status-update server actions.
- `components/submit-button.tsx`: reusable pending-state submit control.
- `components/dashboard-metric.tsx`: one dashboard metric card.
- `components/prospect-list.tsx`: recent/priority prospect list.

---

## Database Contract

### Relationship types

```text
prospect
partner
referral
supplier
```

### Pipeline statuses

```text
new
researching
research_complete
ready_to_contact
contacted
replied
meeting_booked
audit_complete
proposal_sent
won
lost
partner
```

### Timeline event types used in this milestone

```text
prospect_created
pipeline_status_changed
```

---

### Task 1: Install Supabase and validation dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `.env.example`
- Modify: `.gitignore`
- Create: `lib/supabase/env.test.ts`
- Create: `lib/supabase/env.ts`

**Interfaces:**
- Produces: `getSupabasePublicEnv(): { url: string; publishableKey: string }`.
- Produces: dependencies `@supabase/ssr`, `@supabase/supabase-js`, and `zod`.

- [ ] **Step 1: Confirm the repository is clean and Foundation is pushed**

Run:

```bash
git status --short
git log --oneline --max-count=6
```

Expected: clean working tree and the six Foundation commits are present.

- [ ] **Step 2: Install dependencies**

Run:

```bash
npm install @supabase/ssr @supabase/supabase-js zod
```

Expected: installation completes without `--force`.

- [ ] **Step 3: Write the failing environment test**

Create `lib/supabase/env.test.ts`:

```ts
import { afterEach, describe, expect, it } from "vitest";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

afterEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalKey;
});

describe("getSupabasePublicEnv", () => {
  it("returns configured public values", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_example";

    expect(getSupabasePublicEnv()).toEqual({
      url: "https://example.supabase.co",
      publishableKey: "sb_publishable_example",
    });
  });

  it("throws a clear error when configuration is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(() => getSupabasePublicEnv()).toThrow(
      "Missing Supabase public environment variables",
    );
  });
});
```

- [ ] **Step 4: Run the focused test and verify red**

Run:

```bash
npm test -- lib/supabase/env.test.ts
```

Expected: FAIL because `@/lib/supabase/env` does not exist.

- [ ] **Step 5: Implement the environment contract**

Create `lib/supabase/env.ts`:

```ts
export type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Missing Supabase public environment variables");
  }

  return { url, publishableKey };
}
```

Create `.env.example`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Confirm `.gitignore` contains `.env*` while allowing `.env.example`:

```gitignore
.env*
!.env.example
```

- [ ] **Step 6: Verify green**

Run:

```bash
npm test -- lib/supabase/env.test.ts
npm run lint
npm run typecheck
git diff --check
```

Expected: all pass.

- [ ] **Step 7: Commit Task 1**

```bash
git add package.json package-lock.json .env.example .gitignore lib/supabase/env.ts lib/supabase/env.test.ts
git commit -m "chore: add Supabase dependencies and environment contract"
```

---

### Task 2: Add the database migration with Row Level Security

**Files:**
- Create: `supabase/migrations/20260802_create_prospect_foundation.sql`
- Create: `lib/prospects/constants.ts`
- Create: `lib/prospects/types.ts`
- Create: `lib/prospects/schema.test.ts`
- Create: `lib/prospects/schema.ts`

**Interfaces:**
- Produces: database tables `prospects` and `timeline_events`.
- Produces: `relationshipTypes`, `pipelineStatuses`, `Prospect`, `ProspectSummary`, and `createProspectSchema`.

- [ ] **Step 1: Write the SQL migration**

Create `supabase/migrations/20260802_create_prospect_foundation.sql`:

```sql
create extension if not exists pgcrypto;

create type public.relationship_type as enum (
  'prospect',
  'partner',
  'referral',
  'supplier'
);

create type public.pipeline_status as enum (
  'new',
  'researching',
  'research_complete',
  'ready_to_contact',
  'contacted',
  'replied',
  'meeting_booked',
  'audit_complete',
  'proposal_sent',
  'won',
  'lost',
  'partner'
);

create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_name text not null,
  company_name text not null,
  role text,
  phone text,
  email text,
  website text,
  linkedin_url text,
  notes text,
  relationship_type public.relationship_type not null default 'prospect',
  pipeline_status public.pipeline_status not null default 'new',
  opportunity_score integer check (
    opportunity_score is null or opportunity_score between 0 and 100
  ),
  last_contact_at timestamptz,
  next_action text,
  follow_up_at timestamptz,
  business_card_image_path text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (
    event_type in ('prospect_created', 'pipeline_status_changed')
  ),
  title text not null,
  details jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create index prospects_user_id_idx on public.prospects(user_id);
create index prospects_user_status_idx on public.prospects(user_id, pipeline_status);
create index prospects_user_follow_up_idx on public.prospects(user_id, follow_up_at);
create index prospects_user_created_idx on public.prospects(user_id, created_at desc);
create index timeline_events_user_idx on public.timeline_events(user_id, occurred_at desc);
create index timeline_events_prospect_idx on public.timeline_events(prospect_id, occurred_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger prospects_set_updated_at
before update on public.prospects
for each row execute function public.set_updated_at();

alter table public.prospects enable row level security;
alter table public.timeline_events enable row level security;

create policy "Users can view their own prospects"
on public.prospects
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own prospects"
on public.prospects
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own prospects"
on public.prospects
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own prospects"
on public.prospects
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can view their own timeline events"
on public.timeline_events
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own timeline events"
on public.timeline_events
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.prospects
    where prospects.id = timeline_events.prospect_id
      and prospects.user_id = (select auth.uid())
  )
);
```

- [ ] **Step 2: Add constants**

Create `lib/prospects/constants.ts`:

```ts
export const relationshipTypes = [
  "prospect",
  "partner",
  "referral",
  "supplier",
] as const;

export const pipelineStatuses = [
  "new",
  "researching",
  "research_complete",
  "ready_to_contact",
  "contacted",
  "replied",
  "meeting_booked",
  "audit_complete",
  "proposal_sent",
  "won",
  "lost",
  "partner",
] as const;

export const pipelineStatusLabels: Record<PipelineStatus, string> = {
  new: "New",
  researching: "Researching",
  research_complete: "Research complete",
  ready_to_contact: "Ready to contact",
  contacted: "Contacted",
  replied: "Replied",
  meeting_booked: "Meeting booked",
  audit_complete: "Audit complete",
  proposal_sent: "Proposal sent",
  won: "Won",
  lost: "Lost",
  partner: "Partner",
};

export type RelationshipType = (typeof relationshipTypes)[number];
export type PipelineStatus = (typeof pipelineStatuses)[number];
```

- [ ] **Step 3: Add TypeScript contracts**

Create `lib/prospects/types.ts`:

```ts
import type { PipelineStatus, RelationshipType } from "./constants";

export type Prospect = {
  id: string;
  userId: string;
  contactName: string;
  companyName: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  linkedinUrl: string | null;
  notes: string | null;
  relationshipType: RelationshipType;
  pipelineStatus: PipelineStatus;
  opportunityScore: number | null;
  lastContactAt: string | null;
  nextAction: string | null;
  followUpAt: string | null;
  businessCardImagePath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProspectSummary = Pick<
  Prospect,
  | "id"
  | "contactName"
  | "companyName"
  | "role"
  | "pipelineStatus"
  | "opportunityScore"
  | "nextAction"
  | "followUpAt"
  | "createdAt"
>;
```

- [ ] **Step 4: Write failing prospect-schema tests**

Create `lib/prospects/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createProspectSchema } from "@/lib/prospects/schema";

describe("createProspectSchema", () => {
  it("requires contact and company names", () => {
    const result = createProspectSchema.safeParse({
      contactName: "",
      companyName: "",
      role: "",
      phone: "",
      email: "",
      website: "",
      linkedinUrl: "",
      notes: "",
      relationshipType: "prospect",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes optional empty strings to null", () => {
    const result = createProspectSchema.parse({
      contactName: " Amanda Shepherd ",
      companyName: " Voda Cleaning ",
      role: "",
      phone: "",
      email: "",
      website: "",
      linkedinUrl: "",
      notes: "",
      relationshipType: "prospect",
    });

    expect(result).toEqual({
      contactName: "Amanda Shepherd",
      companyName: "Voda Cleaning",
      role: null,
      phone: null,
      email: null,
      website: null,
      linkedinUrl: null,
      notes: null,
      relationshipType: "prospect",
    });
  });
});
```

- [ ] **Step 5: Run focused tests and verify red**

```bash
npm test -- lib/prospects/schema.test.ts
```

Expected: FAIL because `schema.ts` does not exist.

- [ ] **Step 6: Implement the schema**

Create `lib/prospects/schema.ts`:

```ts
import { z } from "zod";
import { relationshipTypes } from "./constants";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value));

export const createProspectSchema = z.object({
  contactName: z.string().trim().min(1, "Contact name is required"),
  companyName: z.string().trim().min(1, "Company name is required"),
  role: optionalText,
  phone: optionalText,
  email: z
    .union([z.literal(""), z.string().trim().email("Enter a valid email")])
    .transform((value) => (value.length === 0 ? null : value)),
  website: optionalText,
  linkedinUrl: optionalText,
  notes: optionalText,
  relationshipType: z.enum(relationshipTypes),
});

export type CreateProspectInput = z.infer<typeof createProspectSchema>;
```

- [ ] **Step 7: Verify and commit**

```bash
npm test -- lib/prospects/schema.test.ts
npm test
npm run lint
npm run typecheck
git diff --check
git add supabase/migrations/20260802_create_prospect_foundation.sql lib/prospects
git commit -m "feat: add prospect database schema and validation"
```

---

### Task 3: Add cookie-based Supabase clients and request proxy

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/proxy.ts`
- Create: `proxy.ts`
- Create: `lib/auth/require-user.ts`

**Interfaces:**
- Produces: `createClient()` in browser and server modules.
- Produces: `updateSession(request: NextRequest): Promise<NextResponse>`.
- Produces: `requireUser()` returning a verified Supabase `User`.

- [ ] **Step 1: Create browser client**

Create `lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./env";

export function createClient() {
  const { url, publishableKey } = getSupabasePublicEnv();
  return createBrowserClient(url, publishableKey);
}
```

- [ ] **Step 2: Create server client**

Create `lib/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabasePublicEnv();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies.
          // proxy.ts refreshes the session for matching requests.
        }
      },
    },
  });
}
```

- [ ] **Step 3: Create session-refresh helper**

Create `lib/supabase/proxy.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv } from "./env";

export async function updateSession(request: NextRequest) {
  const { url, publishableKey } = getSupabasePublicEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}
```

Create root `proxy.ts`:

```ts
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 4: Add authenticated-user guard**

Create `lib/auth/require-user.ts`:

```ts
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
```

- [ ] **Step 5: Verify compilation and commit**

```bash
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
git add lib/supabase/client.ts lib/supabase/server.ts lib/supabase/proxy.ts lib/auth/require-user.ts proxy.ts
git commit -m "feat: configure Supabase SSR clients"
```

---

### Task 4: Replace the placeholder login with real authentication

**Files:**
- Create: `app/auth/actions.ts`
- Create: `components/submit-button.tsx`
- Create: `app/login/login-form.tsx`
- Modify: `app/login/page.tsx`
- Modify: `components/app-header.tsx`
- Create: `tests/login-form.test.tsx`

**Interfaces:**
- Produces: `login(_: LoginState, formData: FormData): Promise<LoginState>`.
- Produces: `logout(): Promise<void>`.
- Produces: `LoginForm` client component.
- Produces: `SubmitButton` client component.

- [ ] **Step 1: Write the failing login-form test**

Create `tests/login-form.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/app/login/login-form";

vi.mock("@/app/auth/actions", () => ({
  login: vi.fn(),
}));

describe("LoginForm", () => {
  it("renders enabled email, password, and submit controls", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeEnabled();
    expect(screen.getByLabelText("Password")).toBeEnabled();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });
});
```

- [ ] **Step 2: Verify red**

```bash
npm test -- tests/login-form.test.tsx
```

Expected: FAIL because `login-form.tsx` does not exist.

- [ ] **Step 3: Add auth actions**

Create `app/auth/actions.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error: string | null;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Unable to sign in with those credentials." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
```

- [ ] **Step 4: Add reusable pending submit button**

Create `components/submit-button.tsx`:

```tsx
"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
};

export function SubmitButton({ idleLabel, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
```

- [ ] **Step 5: Implement login form**

Create `app/login/login-form.tsx`:

```tsx
"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/auth/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, action] = useActionState(login, initialState);

  return (
    <form action={action} className="form-card">
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {state.error ? <p role="alert">{state.error}</p> : null}
      <SubmitButton idleLabel="Sign in" pendingLabel="Signing in…" />
    </form>
  );
}
```

Replace `app/login/page.tsx` with:

```tsx
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <PageShell
      title="Sign in"
      description="Use your private Catalyx account to access prospect intelligence."
    >
      <LoginForm />
    </PageShell>
  );
}
```

- [ ] **Step 6: Add logout control to the header without breaking public login**

Change `components/app-header.tsx` into an async Server Component. Query the authenticated user using the server Supabase client. When a user exists, show Dashboard, New Prospect, and a small form whose action is `logout`. When no user exists, show only Login.

The rendered labels must be exactly:

```text
Dashboard
New Prospect
Sign out
Login
```

Update `tests/app-header.test.tsx` by mocking the server client and testing both authenticated and unauthenticated states. Do not call a live Supabase project in unit tests.

- [ ] **Step 7: Verify and commit**

```bash
npm test -- tests/login-form.test.tsx tests/app-header.test.tsx
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
git add app/auth/actions.ts app/login components/app-header.tsx components/submit-button.tsx tests/login-form.test.tsx tests/app-header.test.tsx
git commit -m "feat: add private Supabase authentication"
```

---

### Task 5: Add authenticated prospect queries and row mapping

**Files:**
- Create: `lib/prospects/queries.ts`
- Create: `lib/prospects/queries.test.ts`

**Interfaces:**
- Produces: `mapProspectRow(row): Prospect`.
- Produces: `getProspectById(prospectId): Promise<Prospect | null>`.
- Produces: `getRecentProspects(limit?): Promise<ProspectSummary[]>`.
- Produces: `getAllProspectStatuses(): Promise<PipelineStatus[]>`.

- [ ] **Step 1: Write row-mapping tests first**

Create `lib/prospects/queries.test.ts` with one fixture using snake_case database fields and assert the returned object uses the exact camelCase fields in `Prospect`.

Required fixture fields:

```ts
{
  id: "prospect-1",
  user_id: "user-1",
  contact_name: "Amanda Shepherd",
  company_name: "Voda Cleaning",
  role: "Owner",
  phone: null,
  email: "amanda@example.com",
  website: null,
  linkedin_url: null,
  notes: null,
  relationship_type: "prospect",
  pipeline_status: "new",
  opportunity_score: null,
  last_contact_at: null,
  next_action: null,
  follow_up_at: null,
  business_card_image_path: null,
  created_at: "2026-08-02T12:00:00.000Z",
  updated_at: "2026-08-02T12:00:00.000Z"
}
```

- [ ] **Step 2: Verify red**

```bash
npm test -- lib/prospects/queries.test.ts
```

Expected: FAIL because `queries.ts` does not exist.

- [ ] **Step 3: Implement mapping and authenticated queries**

In `lib/prospects/queries.ts`:

- Export a `ProspectRow` type matching the migration.
- Export `mapProspectRow`.
- Every query must call `requireUser()` first.
- Every query must add `.eq("user_id", user.id)` even though RLS is enabled.
- `getProspectById` must also add `.eq("id", prospectId)` and use `.maybeSingle()`.
- `getRecentProspects` must order by `created_at` descending and default to `limit = 10`.
- Throw `new Error("Unable to load prospects")` for unexpected Supabase errors.

Do not use a service-role client.

- [ ] **Step 4: Verify and commit**

```bash
npm test -- lib/prospects/queries.test.ts
npm test
npm run lint
npm run typecheck
git diff --check
git add lib/prospects/queries.ts lib/prospects/queries.test.ts
git commit -m "feat: add authenticated prospect queries"
```

---

### Task 6: Make the new-prospect form save real data

**Files:**
- Create: `app/prospects/actions.ts`
- Create: `app/prospects/new/new-prospect-form.tsx`
- Modify: `app/prospects/new/page.tsx`
- Create: `tests/new-prospect-form.test.tsx`

**Interfaces:**
- Produces: `createProspect(_: CreateProspectState, formData: FormData): Promise<CreateProspectState>`.
- Produces: `NewProspectForm`.

- [ ] **Step 1: Write failing form test**

The test must render `NewProspectForm`, verify all nine existing labels remain, verify controls are enabled, and verify both buttons exist:

```text
Save Draft
Save and Analyze
```

`Save and Analyze` remains disabled in this milestone with an explanatory title: `Research automation arrives in a later milestone.` `Save Draft` submits the form.

- [ ] **Step 2: Verify red**

```bash
npm test -- tests/new-prospect-form.test.tsx
```

Expected: FAIL because `new-prospect-form.tsx` does not exist.

- [ ] **Step 3: Implement create action**

Create `app/prospects/actions.ts` with `"use server"`.

The action must:

1. Call `requireUser()`.
2. Build an object from these form names:
   - `contactName`
   - `companyName`
   - `role`
   - `phone`
   - `email`
   - `website`
   - `linkedinUrl`
   - `notes`
   - `relationshipType`
3. Validate using `createProspectSchema.safeParse`.
4. Return field errors without inserting when validation fails.
5. Insert into `prospects` with `user_id: user.id` and `pipeline_status: "new"`.
6. Insert `prospect_created` into `timeline_events` using the returned prospect ID.
7. If the timeline insert fails, keep the created prospect and log the error server-side; do not delete the prospect.
8. Revalidate `/dashboard`.
9. Redirect to `/prospects/<new-id>`.

Return shape:

```ts
export type CreateProspectState = {
  formError: string | null;
  fieldErrors: Partial<Record<"contactName" | "companyName" | "email", string>>;
};
```

For a prospect insert error, return `formError: "Unable to save the prospect. Try again."`.

- [ ] **Step 4: Implement enabled client form**

Create `new-prospect-form.tsx` as a Client Component using `useActionState`. Preserve the original nine fields and relationship options. Display field errors next to their fields and a form error using `role="alert"`.

Replace the placeholder form in `app/prospects/new/page.tsx` with `NewProspectForm` and call `requireUser()` at the top of the page.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- tests/new-prospect-form.test.tsx
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
git add app/prospects/actions.ts app/prospects/new tests/new-prospect-form.test.tsx
git commit -m "feat: persist new prospects"
```

---

### Task 7: Load the real prospect profile and update pipeline status

**Files:**
- Modify: `app/prospects/[prospectId]/page.tsx`
- Create: `app/prospects/[prospectId]/pipeline-status-form.tsx`
- Modify: `app/prospects/actions.ts`
- Create: `tests/prospect-profile-data.test.tsx`
- Create: `tests/pipeline-status-form.test.tsx`

**Interfaces:**
- Produces: `updatePipelineStatus(formData: FormData): Promise<void>`.
- Produces: `PipelineStatusForm`.

- [ ] **Step 1: Write failing profile-data test**

Mock `getProspectById` to return a prospect fixture. Render the route page with `params: Promise.resolve({ prospectId: "prospect-1" })`. Assert the page shows:

```text
Amanda Shepherd
Voda Cleaning
Owner
New
```

Also test `getProspectById` returning `null`; mock `notFound` and assert it is called.

- [ ] **Step 2: Write failing status-form test**

Render `PipelineStatusForm` with `prospectId="prospect-1"` and `currentStatus="new"`. Assert the select contains all approved pipeline labels and `New` is selected.

- [ ] **Step 3: Verify red**

```bash
npm test -- tests/prospect-profile-data.test.tsx tests/pipeline-status-form.test.tsx
```

- [ ] **Step 4: Implement status action**

Add `updatePipelineStatus` to `app/prospects/actions.ts`.

It must:

1. Call `requireUser()`.
2. Read `prospectId` and `pipelineStatus` from `FormData`.
3. Validate ID is non-empty and status is included in `pipelineStatuses`.
4. Load the existing prospect row scoped by both `id` and `user_id`.
5. If not found, call `notFound()`.
6. Update `pipeline_status` scoped by both `id` and `user_id`.
7. Insert a `pipeline_status_changed` timeline event containing:

```json
{
  "from": "old_status",
  "to": "new_status"
}
```

8. Revalidate `/dashboard` and `/prospects/<id>`.

No timeline event should be inserted when the status is unchanged.

- [ ] **Step 5: Implement profile page**

The profile page must:

- Call `getProspectById`.
- Call `notFound()` when null.
- Render the contact name as the main heading.
- Render company, role, pipeline label, relationship type, email, phone, website, LinkedIn, notes, opportunity score, next action, and follow-up date.
- Render `Unknown` for missing values.
- Keep the nine approved future report sections as placeholders below the real overview.
- Include `PipelineStatusForm`.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- tests/prospect-profile-data.test.tsx tests/pipeline-status-form.test.tsx
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
git add app/prospects/actions.ts app/prospects/[prospectId] tests/prospect-profile-data.test.tsx tests/pipeline-status-form.test.tsx
git commit -m "feat: load prospects and update pipeline status"
```

---

### Task 8: Replace dashboard placeholders with automatic metrics and recent prospects

**Files:**
- Create: `lib/dashboard/metrics.test.ts`
- Create: `lib/dashboard/metrics.ts`
- Create: `components/dashboard-metric.tsx`
- Create: `components/prospect-list.tsx`
- Modify: `app/dashboard/page.tsx`
- Create: `tests/dashboard-data.test.tsx`

**Interfaces:**
- Produces: `calculateDashboardMetrics(statuses: PipelineStatus[]): DashboardMetrics`.
- Produces: `DashboardMetric` and `ProspectList`.

- [ ] **Step 1: Write failing metric tests**

Create `lib/dashboard/metrics.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculateDashboardMetrics } from "@/lib/dashboard/metrics";

describe("calculateDashboardMetrics", () => {
  it("calculates the approved dashboard groups", () => {
    const metrics = calculateDashboardMetrics([
      "new",
      "researching",
      "ready_to_contact",
      "contacted",
      "meeting_booked",
      "proposal_sent",
      "won",
    ]);

    expect(metrics).toEqual({
      total: 7,
      researching: 1,
      readyToContact: 1,
      waitingForReply: 1,
      meetingsBooked: 1,
      proposalsSent: 1,
      wonClients: 1,
    });
  });
});
```

- [ ] **Step 2: Verify red**

```bash
npm test -- lib/dashboard/metrics.test.ts
```

- [ ] **Step 3: Implement metric logic**

Create `lib/dashboard/metrics.ts`:

```ts
import type { PipelineStatus } from "@/lib/prospects/constants";

export type DashboardMetrics = {
  total: number;
  researching: number;
  readyToContact: number;
  waitingForReply: number;
  meetingsBooked: number;
  proposalsSent: number;
  wonClients: number;
};

export function calculateDashboardMetrics(
  statuses: PipelineStatus[],
): DashboardMetrics {
  const count = (status: PipelineStatus) =>
    statuses.filter((value) => value === status).length;

  return {
    total: statuses.length,
    researching: count("researching"),
    readyToContact: count("ready_to_contact"),
    waitingForReply: count("contacted"),
    meetingsBooked: count("meeting_booked"),
    proposalsSent: count("proposal_sent"),
    wonClients: count("won"),
  };
}
```

- [ ] **Step 4: Write dashboard page test**

Mock `getAllProspectStatuses` and `getRecentProspects`. Assert seven metric labels and a prospect link appear.

Required labels:

```text
Total prospects
Researching
Ready to contact
Waiting for reply
Meetings booked
Proposals sent
Won clients
```

- [ ] **Step 5: Implement dashboard UI**

`app/dashboard/page.tsx` must:

1. Call `requireUser()`.
2. Fetch statuses and recent prospects in parallel using `Promise.all`.
3. Calculate metrics with the pure function.
4. Render seven `DashboardMetric` cards.
5. Render `ProspectList` with links to `/prospects/<id>`.
6. Show `No prospects yet.` and a link to `/prospects/new` when empty.

`ProspectList` must show company, contact, pipeline label, and next action or `No next action set.`

- [ ] **Step 6: Verify and commit**

```bash
npm test -- lib/dashboard/metrics.test.ts tests/dashboard-data.test.tsx
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
git add lib/dashboard components/dashboard-metric.tsx components/prospect-list.tsx app/dashboard/page.tsx tests/dashboard-data.test.tsx
git commit -m "feat: add live prospect dashboard"
```

---

### Task 9: Apply the migration and perform live Supabase integration checks

**Files:**
- Create locally only: `.env.local` (never commit)
- Modify: `README.md`

**Interfaces:**
- Validates the complete milestone against Daniel's real Supabase project.

- [ ] **Step 1: Add local environment values**

Create `.env.local` locally:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=<Daniel copies Project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<Daniel copies Publishable key>
```

Run:

```bash
git status --short
```

Expected: `.env.local` does not appear.

- [ ] **Step 2: Apply the migration through Supabase SQL Editor**

Daniel opens **Supabase → SQL Editor → New query**, pastes the entire migration file, and runs it once.

Verify in **Table Editor**:

- `prospects` exists.
- `timeline_events` exists.
- RLS is enabled on both.

Do not rerun the migration after it succeeds; enum creation is intentionally one-time.

- [ ] **Step 3: Start the app and test authentication**

Run:

```bash
npm run dev
```

Manual checks:

1. Open `/dashboard` while signed out; expect redirect to `/login`.
2. Enter an incorrect password; expect `Unable to sign in with those credentials.`
3. Enter Daniel's valid credentials; expect redirect to `/dashboard`.
4. Click **Sign out**; expect redirect to `/login`.
5. Sign back in.

- [ ] **Step 4: Test prospect creation**

1. Open `/prospects/new`.
2. Submit empty required fields; expect field errors and no database row.
3. Create a test prospect:
   - Contact: `Test Prospect`
   - Company: `Catalyx Test Company`
   - Relationship: `Prospect`
4. Expect redirect to its profile.
5. Refresh the profile; data must persist.
6. Open Supabase Table Editor and confirm one row with Daniel's `user_id`.
7. Confirm one `prospect_created` timeline row.

- [ ] **Step 5: Test pipeline and dashboard updates**

1. Change the test prospect from `New` to `Contacted`.
2. Confirm the profile shows `Contacted` after refresh.
3. Confirm one `pipeline_status_changed` event with `from: new` and `to: contacted`.
4. Open `/dashboard`.
5. Confirm Total prospects is at least 1.
6. Confirm Waiting for reply is at least 1.
7. Confirm the recent-prospect list links to the profile.

- [ ] **Step 6: Verify RLS using a signed-out request**

After signing out, directly open the test prospect URL. Expect redirect to `/login`, not prospect data.

Do not expose the anonymous publishable key as a substitute for authentication. The publishable key is safe in the browser only because RLS controls row access.

- [ ] **Step 7: Update README**

Add sections:

```text
Supabase project setup
Environment variables
Applying migrations
Creating the single authorized user
Running the app locally
Current milestone capabilities
```

State clearly that `.env.local` must never be committed.

- [ ] **Step 8: Stop the server and commit documentation**

```bash
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
git status --short
git add README.md
git commit -m "docs: add Supabase setup instructions"
```

---

### Task 10: Final milestone verification

**Files:**
- No planned source changes.

- [ ] **Step 1: Run the complete automated suite**

```bash
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
```

Expected: all pass.

- [ ] **Step 2: Confirm no secrets are tracked**

```bash
git ls-files | grep -E '(^|/)\.env($|\.)' || true
git status --short
```

Expected:

- `.env.example` is tracked.
- `.env.local` is not tracked.
- Working tree is clean.

- [ ] **Step 3: Verify migration security contract**

Review `supabase/migrations/20260802_create_prospect_foundation.sql` and confirm:

- RLS is enabled on both tables.
- Policies use `to authenticated`.
- Policies compare `(select auth.uid())` with `user_id`.
- `user_id` indexes exist.
- No service-role key exists in the repository.

- [ ] **Step 4: Final manual browser regression**

At desktop 1280 px and mobile 390 px, verify:

- `/login`
- `/dashboard`
- `/prospects/new`
- one saved prospect profile

Confirm:

- Navigation works.
- No horizontal overflow.
- No browser console errors.
- Sign-in and sign-out work.
- Prospect creation persists.
- Status changes persist.
- Dashboard metrics update after changes.

- [ ] **Step 5: Show milestone evidence**

Run:

```bash
git log --oneline --max-count=12
git status --short
```

Report:

- Test count and result.
- Lint result.
- Typecheck result.
- Build result.
- Live auth result.
- Prospect persistence result.
- RLS signed-out result.
- Dashboard update result.
- Latest commit SHAs.

Do not begin Business Card Intake until Daniel approves this milestone.

---

## Milestone Definition of Done

This milestone is complete only when:

1. Daniel can sign in using his single private Supabase account.
2. Unauthenticated users are redirected to `/login`.
3. Daniel can create a prospect using the existing form.
4. The prospect remains after a page refresh.
5. The profile route loads the saved prospect.
6. Daniel can change pipeline status.
7. The status change creates a timeline event.
8. Dashboard counts are calculated from saved prospects.
9. The dashboard's recent-prospect list links to saved profiles.
10. RLS prevents unauthenticated access to prospect rows.
11. No secret is committed.
12. Tests, linting, type checking, and build all pass.

## Explicitly Deferred

The following remain outside this milestone:

- Business-card image upload
- Supabase Storage bucket
- OCR
- Public web research
- Research jobs
- AI reports
- Bottleneck generation
- Opportunity scoring logic
- Outreach generation
- Automated follow-up reminders
- Gmail or SMS integrations

## Official References Used

- Supabase Auth with Next.js App Router and publishable environment keys.
- Supabase `@supabase/ssr` browser/server client separation.
- Supabase Row Level Security policies with `auth.uid()` and authenticated roles.
- Next.js 16 `proxy.ts` convention.
