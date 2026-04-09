"use client";
import { useState, useTransition } from "react";
import { Grid, Typography, Box, Pagination } from "@mui/material";
import ListingFilters from "@/components/listings/ListingFilters";
import ListingCard from "@/components/listings/ListingCard";
import { addFavourite, removeFavourite } from "@/lib/actions/favourites";
import type { Listing } from "@/types/schema";

const PAGE_SIZE = 9;

interface ListingsGridProps {
  listings: Listing[];
  initialFavouriteIds: string[];
  isLoggedIn: boolean;
}

export default function ListingsGrid({
  listings,
  initialFavouriteIds,
  isLoggedIn,
}: ListingsGridProps) {
  const [filtered, setFiltered] = useState<Listing[]>(listings);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(
    new Set(initialFavouriteIds),
  );
  const [page, setPage] = useState(1);
  const [, startTransition] = useTransition();

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFiltered(results: Listing[]) {
    setFiltered(results);
    setPage(1);
  }

  function handleToggleFavourite(id: string) {
    const isFav = favouriteIds.has(id);
    const next = new Set(favouriteIds);
    if (isFav) next.delete(id);
    else next.add(id);
    setFavouriteIds(next);

    startTransition(async () => {
      const result = isFav ? await removeFavourite(id) : await addFavourite(id);
      if (result.error) {
        // Revert
        const reverted = new Set(favouriteIds);
        setFavouriteIds(reverted);
      }
    });
  }

  return (
    <>
      <ListingFilters listings={listings} onFiltered={handleFiltered} />

      {paginated.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography variant="h5">No listings found</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Try adjusting your filters.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {paginated.length} of {filtered.length} properties
          </Typography>
          <Grid container spacing={3}>
            {paginated.map((listing) => (
              <Grid key={listing.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <ListingCard
                  listing={listing}
                  isFavourited={favouriteIds.has(listing.id)}
                  isLoggedIn={isLoggedIn}
                  onToggleFavourite={
                    isLoggedIn ? handleToggleFavourite : undefined
                  }
                />
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, v) => {
                  setPage(v);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}
