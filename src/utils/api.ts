/// <reference types="vite/client" />

/**
 * Helper function to generate complete API URLs.
 * When running as a Capacitor native app on Android or iOS,
 * VITE_API_BASE_URL can be set to point to the production backend deployment
 * (e.g. "https://my-app.vercel.app"), while on web standard relative paths are used.
 */
export function apiUrl(path: string): string {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (baseUrl) {
    const cleanBase = baseUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  }
  return path;
}
