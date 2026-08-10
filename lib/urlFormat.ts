export function getShortUrlString(shortCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4444"
  return `${baseUrl}/${shortCode}`
}

// Admin views link through the API's redirect route directly, distinct
// from the public-facing short link format above.
export function getAdminShortUrlString(shortCode: string): string {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444/api"
  return `${apiBase}/redirect/${shortCode}`
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function isExpired(expiry: string | Date | null): boolean {
  if (!expiry) return false
  return new Date(expiry) < new Date()
}