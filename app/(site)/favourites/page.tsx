import type { Metadata } from "next";
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFavouriteIds } from "@/lib/actions/favourites";
import { getListingById } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";

export const metadata: Metadata = {
  title: "My Favourites",
  description: "Your saved property listings.",
};

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export default async function FavouritesPage() {
  if (!IS_MOCK) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");
  }

  const favouriteIds = await getFavouriteIds();
  const listings = favouriteIds
    .map((id) => getListingById(id))
    .filter((l) => l !== undefined);

  return (
    <Box
      sx={{
        pt: { xs: 10, md: 12 },
        pb: 10,
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="overline"
            color="secondary.dark"
            display="block"
            mb={1}
          >
            Your Collection
          </Typography>
          <Typography variant="h2" mb={1}>
            Saved Properties
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {listings.length}{" "}
            {listings.length === 1 ? "property" : "properties"} saved
          </Typography>
        </Box>

        {listings.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <FavoriteBorderIcon sx={{ fontSize: 72, color: "divider" }} />
            <Typography variant="h5" color="text.secondary">
              You haven't saved any properties yet.
            </Typography>
            <Link href="/listings" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" size="large">
                Browse Listings
              </Button>
            </Link>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {listings.map((listing) => (
              <Grid key={listing!.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <ListingCard
                  listing={listing!}
                  isFavourited={true}
                  isLoggedIn={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
