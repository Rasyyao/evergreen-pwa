-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)
-- to create the table EverGreen uses to store detection/analysis results.

create table if not exists public.detections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  image_data_url text not null,
  summary text not null,
  detection_count integer not null default 0,
  top_species text,
  top_confidence numeric,
  top_severity text,
  detections jsonb not null default '[]'::jsonb
);

create index if not exists detections_created_at_idx
  on public.detections (created_at desc);

alter table public.detections enable row level security;

-- EverGreen has no real authentication backend yet (login is client-side only),
-- so the app talks to Supabase with the public anon key. These policies allow
-- that anon key to insert and read detection records. Tighten these once
-- Supabase Auth is wired up (e.g. restrict to `authenticated` + owner checks).
create policy "Anon can insert detections"
  on public.detections for insert
  to anon
  with check (true);

create policy "Anon can read detections"
  on public.detections for select
  to anon
  using (true);
