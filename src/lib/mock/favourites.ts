// Server-side mock favourites backed by a browser cookie.
// Reading is allowed in Server Components; writing MUST happen inside Server Actions.

import { cookies } from "next/headers";

const COOKIE = "prestige_mock_favs";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function getMockFavouriteIds(): Promise<string[]> {
  const store = await cookies();
  const val = store.get(COOKIE)?.value;
  if (!val) return [];
  try {
    return JSON.parse(val) as string[];
  } catch {
    return [];
  }
}

/** Call only from a Server Action (cookie writes require mutation context). */
export async function addMockFavourite(listingId: string): Promise<void> {
  const store = await cookies();
  const ids = await getMockFavouriteIds();
  if (!ids.includes(listingId)) {
    store.set(COOKIE, JSON.stringify([...ids, listingId]), {
      path: "/",
      maxAge: MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
    });
  }
}

/** Call only from a Server Action. */
export async function removeMockFavourite(listingId: string): Promise<void> {
  const store = await cookies();
  const ids = await getMockFavouriteIds();
  store.set(COOKIE, JSON.stringify(ids.filter((id) => id !== listingId)), {
    path: "/",
    maxAge: MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
  });
}
