import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Stack,
  Divider,
  Button,
  Paper,
  Avatar,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckIcon from "@mui/icons-material/Check";
import Link from "next/link";
import { getListingById, getAgentById, getListings } from "@/lib/data";
import { getFavouriteIds } from "@/lib/actions/favourites";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ListingGallery from "@/components/listings/ListingGallery";
import FavouriteButton from "@/components/listings/FavouriteButton";
import ContactForm from "@/components/ContactForm";
import ListingCard from "@/components/listings/ListingCard";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const listings = getListings();
  return listings.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: "Listing Not Found" };
  return {
    title: listing.title,
    description: listing.description,
    openGraph: { images: [listing.images[0]] },
  };
}

function formatPrice(price: number, status: string): string {
  if (status === "for-rent" || status === "for-lease")
    return `$${price.toLocaleString()}/mo`;
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  return `$${price.toLocaleString()}`;
}

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  const agent = getAgentById(listing.agentId);
  const favouriteIds = await getFavouriteIds();
  const isFavourited = favouriteIds.includes(listing.id);

  let isLoggedIn = IS_MOCK;
  if (!IS_MOCK) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
  }

  // Related listings (same type/neighbourhood, exclude self)
  const related = getListings()
    .filter(
      (l) =>
        l.id !== listing.id &&
        (l.type === listing.type || l.location.city === listing.location.city),
    )
    .slice(0, 3);

  return (
    <Box
      sx={{
        pt: { xs: 10, md: 12 },
        pb: 10,
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        {/* Gallery */}
        <Box sx={{ mb: 4 }}>
          <ListingGallery images={listing.images} title={listing.title} />
        </Box>

        <Grid container spacing={5}>
          {/* Main info */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="overline" color="secondary.dark">
                  {listing.location.neighbourhood}, {listing.location.city}
                </Typography>
                <Typography variant="h2" sx={{ mt: 0.5 }}>
                  {listing.title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    color: "secondary.dark",
                    fontWeight: 700,
                  }}
                >
                  {formatPrice(listing.price, listing.status)}
                </Typography>
                <FavouriteButton
                  listingId={listing.id}
                  initialFavourited={isFavourited}
                  isLoggedIn={isLoggedIn}
                />
              </Box>
            </Box>

            {/* Status + type */}
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Chip
                label={listing.status.replace("-", " ").toUpperCase()}
                size="small"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 700,
                }}
              />
              <Chip label={listing.type} size="small" variant="outlined" />
            </Stack>

            {/* Quick facts */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {listing.type !== "commercial" && (
                <>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BedIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Bedrooms
                        </Typography>
                        <Typography variant="h6">{listing.bedrooms}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BathtubIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Bathrooms
                        </Typography>
                        <Typography variant="h6">
                          {listing.bathrooms}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </>
              )}
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SquareFootIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Area
                    </Typography>
                    <Typography variant="h6">
                      {listing.area.toLocaleString()} {listing.areaUnit}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Year Built
                    </Typography>
                    <Typography variant="h6">{listing.yearBuilt}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 4 }} />

            {/* Description */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              About This Property
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.8 }}
            >
              {listing.description}
            </Typography>

            {/* Features */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Features & Amenities
            </Typography>
            <Grid container spacing={1} sx={{ mb: 4 }}>
              {listing.features.map((f) => (
                <Grid key={f} size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckIcon sx={{ color: "secondary.main", fontSize: 18 }} />
                    <Typography variant="body2">{f}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Location */}
            <Divider sx={{ mb: 4 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Location
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                color: "text.secondary",
              }}
            >
              <LocationOnIcon color="primary" />
              <Typography>{listing.location.address}</Typography>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: "sticky", top: 90 }}>
              {/* Agent card */}
              {agent && (
                <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    Listed by
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Avatar
                      src={agent.photo}
                      alt={agent.name}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {agent.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {agent.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Link
                    href={`/agents/${agent.id}`}
                    style={{
                      textDecoration: "none",
                      display: "block",
                      width: "100%",
                    }}
                  >
                    <Button variant="outlined" fullWidth size="small">
                      View Agent Profile
                    </Button>
                  </Link>
                </Paper>
              )}

              {/* Contact form */}
              <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Enquire About This Property
                </Typography>
                <ContactForm
                  listingId={listing.id}
                  agentId={listing.agentId}
                  sourcePage={`/listings/${listing.id}`}
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Related listings */}
        {related.length > 0 && (
          <Box sx={{ mt: 10 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              You Might Also Like
            </Typography>
            <Grid container spacing={3}>
              {related.map((l) => (
                <Grid key={l.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ListingCard listing={l} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
