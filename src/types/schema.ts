import { z } from "zod";

// ── Primitives ────────────────────────────────────────────────────────────────

export const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const SocialSchema = z.object({
  platform: z.string(),
  href: z.string().url(),
});

// ── Brand ─────────────────────────────────────────────────────────────────────

export const BrandSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  logo: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
});

// ── Hero ──────────────────────────────────────────────────────────────────────

export const HeroSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  cta: z.object({ label: z.string(), href: z.string() }),
  ctaSecondary: z.object({ label: z.string(), href: z.string() }),
  backgroundVideo: z.string().nullable(),
});

// ── Stat ──────────────────────────────────────────────────────────────────────

export const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

// ── Service ───────────────────────────────────────────────────────────────────

export const ServiceSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

// ── Testimonial ───────────────────────────────────────────────────────────────

export const TestimonialSchema = z.object({
  id: z.string(),
  author: z.string(),
  role: z.string(),
  avatar: z.string(),
  quote: z.string(),
  rating: z.number().min(1).max(5),
});

// ── FAQ ───────────────────────────────────────────────────────────────────────

export const FaqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

// ── About ─────────────────────────────────────────────────────────────────────

export const TimelineEventSchema = z.object({
  year: z.number(),
  event: z.string(),
});

export const AboutSchema = z.object({
  headline: z.string(),
  body: z.string(),
  mission: z.string(),
  timeline: z.array(TimelineEventSchema),
});

// ── Agent ─────────────────────────────────────────────────────────────────────

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  photo: z.string(),
  email: z.string().email(),
  phone: z.string(),
  bio: z.string(),
  specialties: z.array(z.string()),
  languages: z.array(z.string()),
  location: z.string(),
  salesCount: z.number(),
  listingIds: z.array(z.string()),
});

// ── Listing ───────────────────────────────────────────────────────────────────

export const ListingLocationSchema = z.object({
  city: z.string(),
  neighbourhood: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export const ListingSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  type: z.enum(["condo", "loft", "apartment", "house", "commercial"]),
  status: z.enum(["for-sale", "for-rent", "for-lease", "sold"]),
  price: z.number(),
  location: ListingLocationSchema,
  bedrooms: z.number(),
  bathrooms: z.number(),
  area: z.number(),
  areaUnit: z.string(),
  yearBuilt: z.number(),
  description: z.string(),
  features: z.array(z.string()),
  images: z.array(z.string()),
  agentId: z.string(),
  featured: z.boolean(),
});

// ── Footer ────────────────────────────────────────────────────────────────────

export const FooterSchema = z.object({
  quickLinks: z.array(NavItemSchema),
  legal: z.array(NavItemSchema),
  social: z.array(SocialSchema),
  copyright: z.string(),
});

// ── Policy Section ────────────────────────────────────────────────────────────

export const PolicySectionSchema = z.object({
  heading: z.string(),
  body: z.string(),
});

export const PolicyDocSchema = z.object({
  title: z.string(),
  lastUpdated: z.string(),
  sections: z.array(PolicySectionSchema),
});

// ── Root ──────────────────────────────────────────────────────────────────────

export const SiteContentSchema = z.object({
  brand: BrandSchema,
  navigation: z.array(NavItemSchema),
  hero: HeroSchema,
  stats: z.array(StatSchema),
  services: z.array(ServiceSchema),
  testimonials: z.array(TestimonialSchema),
  faq: z.array(FaqItemSchema),
  about: AboutSchema,
  agents: z.array(AgentSchema),
  listings: z.array(ListingSchema),
  featuredListingIds: z.array(z.string()),
  footer: FooterSchema,
  policies: z.object({
    privacy: PolicyDocSchema,
    terms: PolicyDocSchema,
  }),
});

// ── Inferred Types ────────────────────────────────────────────────────────────

export type Brand = z.infer<typeof BrandSchema>;
export type NavItem = z.infer<typeof NavItemSchema>;
export type Hero = z.infer<typeof HeroSchema>;
export type Stat = z.infer<typeof StatSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type FaqItem = z.infer<typeof FaqItemSchema>;
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
export type About = z.infer<typeof AboutSchema>;
export type Agent = z.infer<typeof AgentSchema>;
export type ListingLocation = z.infer<typeof ListingLocationSchema>;
export type Listing = z.infer<typeof ListingSchema>;
export type Footer = z.infer<typeof FooterSchema>;
export type PolicySection = z.infer<typeof PolicySectionSchema>;
export type PolicyDoc = z.infer<typeof PolicyDocSchema>;
export type SiteContent = z.infer<typeof SiteContentSchema>;
