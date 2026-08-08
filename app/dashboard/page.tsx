// app/dashboard/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function DashboardIndexPage() {
  const router = useRouter()
  const { user, hydrated, checking } = useAuth()

  useEffect(() => {
    if (!user) return

    if (user.role === "ADMIN") {
      router.replace("/dashboard/admin")
    } else {
      router.replace("/dashboard/user")
    }
  }, [user, router])

  if (!hydrated || checking || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex items-center space-x-2 text-sm text-zinc-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
          <span>Navigating to dashboard...</span>
        </div>
      </div>
    )
  }

  return null
}