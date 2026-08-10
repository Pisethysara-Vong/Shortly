"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2, Calendar as CalendarIcon } from "lucide-react"

interface CreateUrlFormProps {
  creating: boolean
  onCreate: (originalUrl: string, expiresAtIso?: string) => Promise<boolean>
}

export function CreateUrlForm({ creating, onCreate }: CreateUrlFormProps) {
  const [originalUrl, setOriginalUrl] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const expiresAtRef = useRef<HTMLInputElement>(null)

  const openExpiryPicker = () => {
    const el = expiresAtRef.current
    if (!el) return
    try {
      el.showPicker()
    } catch {
      el.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originalUrl.trim()) return

    const isoExpiry = expiresAt ? new Date(expiresAt).toISOString() : undefined
    const success = await onCreate(originalUrl.trim(), isoExpiry)
    if (success) {
      setOriginalUrl("")
      setExpiresAt("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="original-url">Original URL</Label>
          <Input
            id="original-url"
            type="url"
            placeholder="https://example.com/my-long-link-path"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="expires-at">Expiration (Optional)</Label>
          <div className="relative cursor-pointer" onClick={openExpiryPicker}>
            <Input
              id="expires-at"
              type="datetime-local"
              ref={expiresAtRef}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="pr-9 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={creating || !originalUrl.trim()} className="gap-2 cursor-pointer">
        <Link2 className="h-4 w-4" />
        {creating ? "Shortening..." : "Shorten URL"}
      </Button>
    </form>
  )
}