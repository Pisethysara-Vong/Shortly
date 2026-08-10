export function getShortUrlString(shortCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4444"
  return `${baseUrl}/${shortCode}`
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