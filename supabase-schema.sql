-- Run in Supabase SQL Editor.
-- Educational prototype only. Do not use this as an official donor registry.
create table if not exists public.donor_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  contact_email text not null,
  interest_status text not null default 'submitted'
    check (interest_status in ('submitted', 'withdrawn')),
  prototype_acknowledged boolean not null default false check (prototype_acknowledged = true),
  created_at timestamptz not null default now()
);

alter table public.donor_registrations enable row level security;

-- Users may read only their own records.
create policy "Users read own registrations"
on public.donor_registrations for select
to authenticated
using (auth.uid() = user_id);

-- Users may insert only records associated with their own authenticated user ID.
create policy "Users insert own registrations"
on public.donor_registrations for insert
to authenticated
with check (
  auth.uid() = user_id
  and prototype_acknowledged = true
  and interest_status = 'submitted'
);

-- No user update/delete policy is created by default. This is intentional.
-- Admin access requires a separately designed and tested trusted role policy.
