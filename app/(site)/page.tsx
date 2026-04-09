import { getSiteContent, getFeaturedListings } from "@/lib/data";
import HomeClient from "@/components/HomeClient";

export default function HomePage() {
  const content = getSiteContent();
  const featuredListings = getFeaturedListings();

  return <HomeClient content={content} featuredListings={featuredListings} />;
}
