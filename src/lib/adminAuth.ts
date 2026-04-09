// Simple localStorage-based admin session.
// This is intentionally lightweight — suitable for a demo/mock admin panel only.

const KEY = "prestige_admin_session";

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}

export function adminLogin(username: string, password: string): boolean {
  if (username === "admin123" && password === "admin123") {
    localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
