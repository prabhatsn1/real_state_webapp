import type { Metadata } from "next";
import { Container, Typography, Box } from "@mui/material";
import { getListings } from "@/lib/data";
import { getFavouriteIds } from "@/lib/actions/favourites";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ListingsGrid from "@/components/listings/ListingsGrid";

export const metadata: Metadata = {
  title: "Browse Listings",
  description:
    "Search and filter premium real estate listings across New York.",
};

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export default async function ListingsPage() {
  const listings = getListings();
  const favouriteIds = await getFavouriteIds();

  let isLoggedIn = IS_MOCK;
  if (!IS_MOCK) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
  }

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
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="overline"
            color="secondary.dark"
            display="block"
            mb={1}
          >
            Our Portfolio
          </Typography>
          <Typography variant="h2" mb={1}>
            All Properties
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {listings.length} properties across New York and the Hamptons
          </Typography>
        </Box>
        <ListingsGrid
          listings={listings}
          initialFavouriteIds={favouriteIds}
          isLoggedIn={isLoggedIn}
        />
      </Container>
    </Box>
  );
}
