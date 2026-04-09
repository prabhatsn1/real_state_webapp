"use client";
import rawData from "@/data/mock.json";
import type { Listing, Agent, SiteContent } from "@/types/schema";

const STORE_KEY = "prestige_admin_store";

export interface AdminStore {
  listings: Listing[];
  agents: Agent[];
  brand: SiteContent["brand"];
  stats: SiteContent["stats"];
  featuredListingIds: string[];
}

function defaultStore(): AdminStore {
  return {
    listings: rawData.listings as Listing[],
    agents: rawData.agents as Agent[],
    brand: rawData.brand as SiteContent["brand"],
    stats: rawData.stats as SiteContent["stats"],
    featuredListingIds: rawData.featuredListingIds,
  };
}

export function loadAdminStore(): AdminStore {
  if (typeof window === "undefined") return defaultStore();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultStore();
    return JSON.parse(raw) as AdminStore;
  } catch {
    return defaultStore();
  }
}

export function saveAdminStore(store: AdminStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function resetAdminStore(): AdminStore {
  if (typeof window !== "undefined") localStorage.removeItem(STORE_KEY);
  return defaultStore();
}
