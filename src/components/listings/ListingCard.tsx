"use client";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Listing } from "@/types/schema";
import { cardHover } from "@/animations/variants";

interface ListingCardProps {
  listing: Listing;
  isFavourited?: boolean;
  isLoggedIn?: boolean;
  onToggleFavourite?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  "for-sale": "#1a6b3c",
  "for-rent": "#0d5c8c",
  "for-lease": "#6b4c1a",
  sold: "#7a1a1a",
};

function formatPrice(price: number, status: string): string {
  if (status === "for-rent") return `$${price.toLocaleString()}/mo`;
  if (status === "for-lease") return `$${price.toLocaleString()}/mo`;
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  return `$${price.toLocaleString()}`;
}

const MotionCard = motion.create(Card);

export default function ListingCard({
  listing,
  isFavourited = false,
  isLoggedIn = false,
  onToggleFavourite,
}: ListingCardProps) {
  return (
    <MotionCard
      initial="rest"
      whileHover="hover"
      variants={cardHover}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Image */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          height={220}
          image={listing.images[0]}
          alt={listing.title}
          sx={{
            objectFit: "cover",
            transition: "transform 0.5s ease",
            ".MuiCard-root:hover &": { transform: "scale(1.05)" },
          }}
        />
        {/* Status badge */}
        <Chip
          label={listing.status.replace("-", " ").toUpperCase()}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: statusColors[listing.status] ?? "#333",
            color: "white",
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            borderRadius: 1,
          }}
        />
        {/* Favourite button */}
        {onToggleFavourite && (
          <Tooltip
            title={
              isLoggedIn
                ? isFavourited
                  ? "Remove from favourites"
                  : "Save to favourites"
                : "Login to save"
            }
          >
            <IconButton
              size="small"
              onClick={() => isLoggedIn && onToggleFavourite(listing.id)}
              aria-label={
                isFavourited ? "Remove from favourites" : "Add to favourites"
              }
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(255,255,255,0.92)",
                "&:hover": { bgcolor: "white" },
                color: isFavourited ? "error.main" : "text.secondary",
              }}
            >
              {isFavourited ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Price */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            color: "secondary.dark",
            mb: 0.5,
          }}
        >
          {formatPrice(listing.price, listing.status)}
        </Typography>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, lineHeight: 1.3, mb: 0.5, fontSize: "1rem" }}
        >
          {listing.title}
        </Typography>

        {/* Address */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {listing.location.neighbourhood}, {listing.location.city}
        </Typography>

        {/* Stats row */}
        {listing.type !== "commercial" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <BedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {listing.bedrooms} bd
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <BathtubIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {listing.bathrooms} ba
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <SquareFootIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {listing.area.toLocaleString()} {listing.areaUnit}
              </Typography>
            </Box>
          </Box>
        )}
        {listing.type === "commercial" && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <SquareFootIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {listing.area.toLocaleString()} {listing.areaUnit}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Box
          component={Link}
          href={`/listings/${listing.id}`}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "primary.main",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            "&:hover": { color: "secondary.dark", gap: 1 },
            transition: "all 0.2s",
          }}
          aria-label={`View details for ${listing.title}`}
        >
          View Details
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </CardActions>
    </MotionCard>
  );
}
