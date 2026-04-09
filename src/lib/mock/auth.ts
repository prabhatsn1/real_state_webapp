// Client-only: mock auth using localStorage + custom events.
// Only imported in client components guarded by NEXT_PUBLIC_USE_MOCK_DATA.

export interface MockUser {
  id: string;
  email: string;
  created_at: string;
}

const KEY = "prestige_mock_user";
const EVENT = "mock-auth-change";

export function getMockUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function signInMock(email: string): MockUser {
  const user: MockUser = {
    id: "mock-" + Math.random().toString(36).slice(2, 8),
    email,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(EVENT));
  return user;
}

export function signOutMock(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function onMockAuthChange(
  cb: (user: MockUser | null) => void,
): () => void {
  const handler = () => cb(getMockUser());
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
