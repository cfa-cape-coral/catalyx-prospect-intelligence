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
