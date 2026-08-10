"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface UserEmailFilterProps {
  filterMode: "all" | "user"
  onApply: (email: string) => void
  onClear: () => void
}

export function UserEmailFilter({ filterMode, onApply, onClear }: UserEmailFilterProps) {
  const emailInputRef = useRef<HTMLInputElement>(null)

  const handleApply = () => {
    const value = emailInputRef.current?.value.trim() ?? ""
    if (!value) return
    onApply(value)
  }

  const handleClear = () => {
    if (emailInputRef.current) {
      emailInputRef.current.value = ""
    }
    onClear()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleApply()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="w-full sm:w-80 space-y-2.5">
        <Label htmlFor="target-user-email">Filter by Target User Email</Label>
        <Input
          id="target-user-email"
          type="email"
          placeholder="Enter user email..."
          ref={emailInputRef}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="default" onClick={handleApply} className="cursor-pointer">
          Filter User
        </Button>
        {filterMode === "user" && (
          <Button variant="outline" onClick={handleClear} className="gap-1.5 cursor-pointer">
            <X className="h-3.5 w-3.5" />
            Clear Filter
          </Button>
        )}
      </div>
    </div>
  )
}