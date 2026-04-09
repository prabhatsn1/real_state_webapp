# Supabase Setup (First Time)

This guide sets up Supabase for this project from scratch.

## 1. Create a Supabase Project

1. Go to https://supabase.com and create a new project.
2. Wait until the project status is ready.
3. In Project Settings -> API, copy:
   - Project URL
   - anon public key
   - service_role key

## 2. Configure Environment Variables

Create a `.env.local` in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Notes:

- `service_role` is required for admin panel write operations.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## 3. SQL Editor: Run Initial Schema

Open Supabase Dashboard -> SQL Editor -> New query, then run the SQL below.

### 3.1 Core app tables (enquiries + favourites)

```sql
-- enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz DEFAULT now() NOT NULL,
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  message     text NOT NULL,
  listing_id  text,
  agent_id    text,
  source_page text
);

-- favourites table
CREATE TABLE IF NOT EXISTS favourites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz DEFAULT now() NOT NULL,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id  text NOT NULL,
  UNIQUE (user_id, listing_id)
);

-- Enable RLS
ALTER TABLE enquiries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- enquiries: allow anonymous/authenticated inserts
CREATE POLICY "anon insert enquiries"
  ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- favourites: authenticated users manage only their own rows
CREATE POLICY "users select own favourites"
  ON favourites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own favourites"
  ON favourites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users delete own favourites"
  ON favourites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

### 3.2 Admin tables (listings + agents + site settings)

```sql
-- Listings
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

-- Agents
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

-- Site settings (single row, id=1)
create table if not exists public.site_settings (
  id                   integer primary key default 1,
  brand                jsonb not null default '{}',
  stats                jsonb not null default '[]',
  featured_listing_ids jsonb not null default '[]',
  updated_at           timestamptz not null default now()
);

-- Enable RLS
alter table public.listings      enable row level security;
alter table public.agents        enable row level security;
alter table public.site_settings enable row level security;

-- Public read for site pages
create policy "Public read listings"
  on public.listings for select using (true);

create policy "Public read agents"
  on public.agents for select using (true);

create policy "Public read site_settings"
  on public.site_settings for select using (true);

-- Admin writes use service role key (RLS bypassed)
```

## 4. Seed / Insert Site Settings Row

Run once to guarantee the settings row exists:

```sql
insert into public.site_settings (id, brand, stats, featured_listing_ids)
values (1, '{}'::jsonb, '[]'::jsonb, '[]'::jsonb)
on conflict (id) do nothing;
```

## 5. Verify Locally

1. Install and start app:

```bash
npm install
npm run dev
```

2. Keep mock mode OFF (or unset):

```env
NEXT_PUBLIC_USE_MOCK_DATA=false
```

3. Test flows:

- Submit contact form (writes to `enquiries`)
- Sign in and toggle favourites (writes to `favourites`)
- Admin panel CRUD (writes via service role to `listings`, `agents`, `site_settings`)

## 6. Troubleshooting

- Empty admin data:
  - Confirm `SUPABASE_SERVICE_ROLE_KEY` exists in `.env.local`.
  - Confirm admin tables/policies were created successfully.
- Favourites insert fails:
  - Confirm user is authenticated.
  - Confirm favourites RLS policies exist.
- If you only want local demo data without Supabase:
  - Set `NEXT_PUBLIC_USE_MOCK_DATA=true`.
