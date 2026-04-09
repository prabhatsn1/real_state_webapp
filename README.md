# Prestige Realty — Next.js Real Estate Website

A production-ready real estate agency website built with Next.js 16 App Router, MUI v7, Framer Motion, React Three Fiber, and Supabase.

---

## Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 App Router (TypeScript)            |
| UI         | MUI v7 + Emotion                              |
| Animation  | Framer Motion v12                             |
| 3D         | @react-three/fiber + @react-three/drei        |
| Backend    | Supabase (auth + database)                    |
| Validation | Zod v4                                        |
| Content    | `src/data/mock.json` (single source of truth) |

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **Mock mode:** Set `NEXT_PUBLIC_USE_MOCK_DATA=true` to run fully without Supabase — auth, favourites, and enquiries all use in-memory stubs.

### 3. Set up Supabase database

Run the SQL in the [Supabase Database Setup](#supabase-database-setup) section below in your project's SQL Editor.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pages

### `/` — Home

The landing page. Features:

- **3D animated hero** — an interactive Three.js scene (`HeroScene`) rendered via React Three Fiber with a floating particle/geometry animation.
- **Search bar** — quick property search that forwards to `/listings`.
- **Featured listings** — a curated grid of top properties pulled from `mock.json`.
- **Services overview** — brief cards linking to `/services`.
- **Agents spotlight** — a scrolling row of agent cards linking to `/agents`.
- Scroll-based Framer Motion entrance animations throughout.

---

### `/listings` — Property Listings

Browse the full catalogue of available properties.

- **Filters sidebar** — filter by type (apartment, house, villa…), price range, bedrooms, and location via URL search params so filters are shareable and bookmarkable.
- **Listings grid** — responsive card grid with thumbnail, price, beds/baths, and a favourite toggle.
- **Favourite toggle** — heart icon persists the listing to Supabase (or mock store) for authenticated users; redirects to `/login` otherwise.
- Framer Motion staggered card entrance on load.

---

### `/listings/[id]` — Listing Detail

Full detail view for a single property.

- **Image gallery** — full-width lightbox-style gallery (`ListingGallery`) with thumbnail navigation.
- **Property specs** — beds, baths, area, type, price, and description.
- **Enquiry form** — sends a message to the agent via a Server Action (writes to the `enquiries` table).
- **Agent card** — shows the assigned agent with a link to their profile.
- **Favourite button** — same toggle as the listing grid.

---

### `/agents` — Agents Directory

Grid of all agents at Prestige Realty.

- Agent cards showing name, title, avatar, and key stats (listings count, years experience).
- Click-through to individual agent profiles.

---

### `/agents/[id]` — Agent Profile

Dedicated page for a single agent.

- Full bio, contact details, and specialisations.
- Grid of that agent's active listings.
- Enquiry form pre-filled with the agent's ID.

---

### `/services` — Services

Marketing page describing what Prestige Realty offers.

- Tiered service cards (Buyer Representation, Seller Representation, Investment Advisory, Property Management, Relocation, Valuation).
- Scroll-triggered Framer Motion animations.
- CTA section linking to `/contact`.

---

### `/about` — About Us

Company story and history page.

- **Hero banner** — headline and company description with a `fadeUp` entrance animation.
- **Stats bar** — key metrics (properties sold, client satisfaction, years of excellence) in a gold highlight band.
- **Mission section** — mission statement in a styled blockquote with `fadeLeft` animation.
- **Timeline** — alternating left/right cards for milestones in the company's history, each animating in with `fadeLeft`/`fadeRight` as the user scrolls.

---

### `/contact` — Contact

Contact page with multiple touch-points.

- **Contact form** — name, email, phone, message fields; submitted via a Server Action to the `enquiries` table.
- **Office details** — address, phone, and email pulled from `mock.json`.
- **Map placeholder** — embeds office location context.

---

### `/faq` — FAQ

Accordion-style frequently asked questions page.

- Questions and answers sourced from `mock.json`.
- MUI Accordion components with smooth expand/collapse.

---

### `/favourites` — Saved Properties _(auth required)_

Displays all properties a logged-in user has saved.

- Redirects unauthenticated users to `/login`.
- Renders the same `ListingCard` components as `/listings`.
- Empty-state illustration and CTA to browse listings if no favourites exist.

---

### `/login` — Sign In

Split-panel authentication page.

- **Left panel** — dark branded panel with:
  - Animated gold skyline silhouette.
  - Staggered entrance for logo, tagline, headline, and agency stats.
  - Floating decorative circle accents.
- **Right panel** — clean form with:
  - Email + password fields.
  - Animated gold accent bar.
  - Link to `/signup`.
  - Terms & Privacy footer.
- Redirects to `/` if already authenticated.

---

### `/signup` — Create Account

Identical split-panel layout to `/login` with copy and form adjusted for new account creation.

- Password minimum 6 characters.
- Redirects to `/listings` on successful sign-up.
- Link to `/login` for existing users.

---

### `/privacy` — Privacy Policy

Static legal page detailing data collection and usage practices.

---

### `/terms` — Terms of Service

Static legal page covering terms of use for the platform.

---

## Project Structure

```
app/                         # Next.js App Router pages
├── layout.tsx               # Root layout — MUI Provider, NavBar, Footer
├── page.tsx                 # / Home
├── about/page.tsx           # /about
├── agents/page.tsx          # /agents
├── agents/[id]/page.tsx     # /agents/:id
├── contact/page.tsx         # /contact
├── faq/page.tsx             # /faq
├── favourites/page.tsx      # /favourites (auth-protected)
├── listings/page.tsx        # /listings
├── listings/[id]/page.tsx   # /listings/:id
├── login/page.tsx           # /login
├── privacy/page.tsx         # /privacy
├── services/page.tsx        # /services
├── signup/page.tsx          # /signup
└── terms/page.tsx           # /terms

src/
├── animations/
│   └── variants.ts          # Framer Motion reusable variants
├── components/
│   ├── AuthForm.tsx         # Shared login/signup form
│   ├── AuthPageLayout.tsx   # Split-panel auth page layout
│   ├── ContactForm.tsx      # Contact/enquiry form
│   ├── Footer.tsx
│   ├── HomeClient.tsx       # Client-side home page sections
│   ├── NavBar.tsx           # Sticky animated navigation bar
│   ├── agents/
│   │   └── AgentCard.tsx
│   ├── listings/
│   │   ├── FavouriteButton.tsx
│   │   ├── ListingCard.tsx
│   │   ├── ListingFilters.tsx
│   │   ├── ListingGallery.tsx
│   │   └── ListingsGrid.tsx
│   ├── motion/
│   │   └── MotionSection.tsx  # Scroll-triggered animation wrapper
│   └── three/
│       └── HeroScene.tsx      # Three.js hero canvas
├── data/
│   └── mock.json            # All site content — edit here
├── lib/
│   ├── data.ts              # Data access helpers
│   ├── actions/
│   │   ├── enquiry.ts       # Server Action: submit enquiry
│   │   └── favourites.ts    # Server Action: toggle favourite
│   ├── mock/
│   │   ├── auth.ts          # In-memory mock auth
│   │   └── favourites.ts    # In-memory mock favourites
│   └── supabase/
│       ├── browser.ts       # Supabase browser client
│       └── server.ts        # Supabase server client
├── theme/
│   ├── MuiProvider.tsx      # MUI theme provider + emotion cache
│   └── theme.ts             # Custom MUI theme (colours, typography)
└── types/
    └── schema.ts            # Zod schemas + inferred TypeScript types
```

---

## Supabase Database Setup

### Tables

Run the following SQL in the Supabase **SQL Editor**:

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
```

### RLS Policies

```sql
-- Enable RLS
ALTER TABLE enquiries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- enquiries: allow anonymous insert only
CREATE POLICY "anon insert enquiries"
  ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- favourites: authenticated users manage their own rows
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

---

## Editing Content

All site copy lives in **`src/data/mock.json`**. Edit that file to update any text, listings, agents, stats, FAQ entries, or navigation items — no code changes needed.

---

## Deployment

Deploy to Vercel and set the three environment variables in project settings:

| Variable                        | Value                     |
| ------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key    |
| `SUPABASE_SERVICE_ROLE_KEY`     | Your Supabase service key |

Add your Vercel domain to Supabase **Authentication › URL Configuration › Redirect URLs**.
