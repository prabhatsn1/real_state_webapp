"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import type { Listing, Agent, SiteContent } from "@/types/schema";
import type { AdminStore } from "@/lib/adminStore";
import rawData from "@/data/mock.json";

// ── DB row ↔ TypeScript mappers ───────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToListing(row: Record<string, any>): Listing {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type,
    status: row.status,
    price: row.price,
    location: row.location,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    areaUnit: row.area_unit,
    yearBuilt: row.year_built,
    description: row.description ?? "",
    features: row.features ?? [],
    images: row.images ?? [],
    agentId: row.agent_id ?? "",
    featured: row.featured ?? false,
  };
}

function listingToDb(l: Listing) {
  return {
    id: l.id,
    title: l.title,
    slug: l.slug,
    type: l.type,
    status: l.status,
    price: l.price,
    location: l.location,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    area: l.area,
    area_unit: l.areaUnit,
    year_built: l.yearBuilt,
    description: l.description,
    features: l.features,
    images: l.images,
    agent_id: l.agentId,
    featured: l.featured,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToAgent(row: Record<string, any>): Agent {
  return {
    id: row.id,
    name: row.name,
    title: row.title ?? "",
    photo: row.photo ?? "",
    email: row.email,
    phone: row.phone ?? "",
    bio: row.bio ?? "",
    specialties: row.specialties ?? [],
    languages: row.languages ?? [],
    location: row.location ?? "",
    salesCount: row.sales_count ?? 0,
    listingIds: row.listing_ids ?? [],
  };
}

function agentToDb(a: Agent) {
  return {
    id: a.id,
    name: a.name,
    title: a.title,
    photo: a.photo,
    email: a.email,
    phone: a.phone,
    bio: a.bio,
    specialties: a.specialties,
    languages: a.languages,
    location: a.location,
    sales_count: a.salesCount,
    listing_ids: a.listingIds,
  };
}

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getAdminData(): Promise<AdminStore> {
  const supabase = createSupabaseAdminClient();

  const [listingsRes, agentsRes, settingsRes] = await Promise.all([
    supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: true }),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  // Fall back to mock data if the tables are empty (first-time setup)
  const listings: Listing[] =
    listingsRes.data && listingsRes.data.length > 0
      ? listingsRes.data.map(dbToListing)
      : (rawData.listings as Listing[]);

  const agents: Agent[] =
    agentsRes.data && agentsRes.data.length > 0
      ? agentsRes.data.map(dbToAgent)
      : (rawData.agents as Agent[]);

  const s = settingsRes.data;
  return {
    listings,
    agents,
    brand:
      (s?.brand as SiteContent["brand"]) ??
      (rawData.brand as SiteContent["brand"]),
    stats:
      (s?.stats as SiteContent["stats"]) ??
      (rawData.stats as SiteContent["stats"]),
    featuredListingIds:
      (s?.featured_listing_ids as string[]) ?? rawData.featuredListingIds,
  };
}

// ── Listings ──────────────────────────────────────────────────────────────────

export async function upsertListingAction(
  listing: Listing,
): Promise<{ error?: string }> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("listings")
    .upsert(listingToDb(listing), { onConflict: "id" });
  if (error) return { error: error.message };
  revalidatePath("/listings");
  revalidatePath(`/listings/${listing.slug}`);
  revalidatePath("/");
  return {};
}

export async function deleteListingAction(
  id: string,
): Promise<{ error?: string }> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/listings");
  revalidatePath("/");
  return {};
}

export async function updateFeaturedListingsAction(
  featuredListingIds: string[],
): Promise<{ error?: string }> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { id: 1, featured_listing_ids: featuredListingIds },
      { onConflict: "id" },
    );
  if (error) return { error: error.message };
  revalidatePath("/");
  return {};
}

// ── Agents ────────────────────────────────────────────────────────────────────

export async function upsertAgentAction(
  agent: Agent,
): Promise<{ error?: string }> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("agents")
    .upsert(agentToDb(agent), { onConflict: "id" });
  if (error) return { error: error.message };
  revalidatePath("/agents");
  revalidatePath(`/agents/${agent.id}`);
  return {};
}

export async function deleteAgentAction(
  id: string,
): Promise<{ error?: string }> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("agents").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/agents");
  return {};
}

// ── Site settings ─────────────────────────────────────────────────────────────

export async function updateSiteSettingsAction(settings: {
  brand: SiteContent["brand"];
  stats: SiteContent["stats"];
  featuredListingIds: string[];
}): Promise<{ error?: string }> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      id: 1,
      brand: settings.brand,
      stats: settings.stats,
      featured_listing_ids: settings.featuredListingIds,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) return { error: error.message };
  revalidatePath("/");
  return {};
}
