-- Prestige Realty — Admin Tables Migration
-- Run this in your Supabase SQL editor or via the Supabase CLI.
--
-- Required env vars in .env.local:
--   NEXT_PUBLIC_SUPABASE_URL=...
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
--   SUPABASE_SERVICE_ROLE_KEY=...   ← needed for admin panel writes

-- ── Listings ──────────────────────────────────────────────────────────────────
create table if not exists public.listings (
  id          text primary key,
  title       text    not null,
  slug        text    not null unique,
  type        text    not null check (type in ('condo','loft','apartment','house','commercial')),
  status      text    not null check (status in ('for-sale','for-rent','for-lease','sold')),
  price       numeric not null default 0,
  location    jsonb   not null default '{}',
  bedrooms    numeric not null default 0,
  bathrooms   numeric not null default 0,
  area        numeric not null default 0,
  area_unit   text    not null default 'sqft',
  year_built  integer,
  description text,
  features    jsonb   not null default '[]',
  images      jsonb   not null default '[]',
  agent_id    text,
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── Agents ────────────────────────────────────────────────────────────────────
create table if not exists public.agents (
  id          text primary key,
  name        text not null,
  title       text,
  photo       text,
  email       text not null,
  phone       text,
  bio         text,
  specialties jsonb not null default '[]',
  languages   jsonb not null default '[]',
  location    text,
  sales_count integer not null default 0,
  listing_ids jsonb   not null default '[]',
  created_at  timestamptz not null default now()
);

-- ── Site settings (single row, id = 1) ────────────────────────────────────────
create table if not exists public.site_settings (
  id                   integer primary key default 1,
  brand                jsonb not null default '{}',
  stats                jsonb not null default '[]',
  featured_listing_ids jsonb not null default '[]',
  updated_at           timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- The admin panel uses the service role key which bypasses RLS.
-- Public (anon) users may read listings and agents for the public site.

alter table public.listings      enable row level security;
alter table public.agents        enable row level security;
alter table public.site_settings enable row level security;

-- Allow anyone to read listings and agents (public site pages)
create policy "Public read listings"
  on public.listings for select using (true);

create policy "Public read agents"
  on public.agents for select using (true);

create policy "Public read site_settings"
  on public.site_settings for select using (true);

-- All writes go through the service role key (admin panel) → RLS is bypassed.
-- No additional write policies are needed for the admin panel.
