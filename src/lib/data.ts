import rawData from "@/data/mock.json";
import {
  SiteContentSchema,
  type Agent,
  type Listing,
  type SiteContent,
} from "@/types/schema";

// Validate once at module load time — throws if mock.json is malformed
const data: SiteContent = SiteContentSchema.parse(rawData);

export function getSiteContent(): SiteContent {
  return data;
}

export function getListings(): Listing[] {
  return data.listings;
}

export function getListingById(id: string): Listing | undefined {
  return data.listings.find((l) => l.id === id);
}

export function getFeaturedListings(): Listing[] {
  return data.featuredListingIds
    .map((id) => data.listings.find((l) => l.id === id))
    .filter((l): l is Listing => l !== undefined);
}

export function getAgents(): Agent[] {
  return data.agents;
}

export function getAgentById(id: string): Agent | undefined {
  return data.agents.find((a) => a.id === id);
}

export function getListingsByAgent(agentId: string): Listing[] {
  return data.listings.filter((l) => l.agentId === agentId);
}
