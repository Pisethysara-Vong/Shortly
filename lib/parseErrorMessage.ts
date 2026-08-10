export function parseErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const res = (err as { response?: { data?: { message?: string | string[] } } }).response
    if (res?.data?.message) {
      return Array.isArray(res.data.message) ? res.data.message.join(", ") : res.data.message
    }
  }
  return fallback
}