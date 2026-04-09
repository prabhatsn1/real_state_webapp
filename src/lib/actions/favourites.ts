"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  getMockFavouriteIds,
  addMockFavourite,
  removeMockFavourite,
} from "@/lib/mock/favourites";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function addFavourite(
  listingId: string,
): Promise<{ error?: string }> {
  if (IS_MOCK) {
    await addMockFavourite(listingId);
    revalidatePath("/favourites");
    revalidatePath(`/listings/${listingId}`);
    return {};
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in to save favourites." };

  const { error } = await supabase
    .from("favourites")
    .insert({ user_id: user.id, listing_id: listingId });

  if (error && error.code !== "23505") {
    return { error: error.message };
  }

  revalidatePath("/favourites");
  revalidatePath(`/listings/${listingId}`);
  return {};
}

export async function removeFavourite(
  listingId: string,
): Promise<{ error?: string }> {
  if (IS_MOCK) {
    await removeMockFavourite(listingId);
    revalidatePath("/favourites");
    revalidatePath(`/listings/${listingId}`);
    return {};
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("favourites")
    .delete()
    .eq("user_id", user.id)
    .eq("listing_id", listingId);

  if (error) return { error: error.message };

  revalidatePath("/favourites");
  revalidatePath(`/listings/${listingId}`);
  return {};
}

export async function getFavouriteIds(): Promise<string[]> {
  if (IS_MOCK) return getMockFavouriteIds();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("favourites")
    .select("listing_id")
    .eq("user_id", user.id);

  return data?.map((r) => r.listing_id) ?? [];
}
