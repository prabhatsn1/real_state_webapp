"use client";
import { useState, useTransition } from "react";
import { IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { addFavourite, removeFavourite } from "@/lib/actions/favourites";
import { useRouter } from "next/navigation";

interface FavouriteButtonProps {
  listingId: string;
  initialFavourited: boolean;
  isLoggedIn: boolean;
}

export default function FavouriteButton({
  listingId,
  initialFavourited,
  isLoggedIn,
}: FavouriteButtonProps) {
  const [favourited, setFavourited] = useState(initialFavourited);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggle() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    const newState = !favourited;
    setFavourited(newState);
    startTransition(async () => {
      const result = newState
        ? await addFavourite(listingId)
        : await removeFavourite(listingId);
      if (result.error) setFavourited(!newState);
    });
  }

  return (
    <Tooltip
      title={
        isLoggedIn
          ? favourited
            ? "Remove from favourites"
            : "Save to favourites"
          : "Login to save"
      }
    >
      <IconButton
        onClick={toggle}
        disabled={isPending}
        aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
        aria-pressed={favourited}
        sx={{
          color: favourited ? "error.main" : "text.secondary",
          bgcolor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          "&:hover": { bgcolor: "white", transform: "scale(1.1)" },
          transition: "transform 0.2s",
        }}
      >
        {favourited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
}
