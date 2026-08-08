"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { accountApi } from "@/services/api/account"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link2, LogOut, Shield, User as UserIcon } from "lucide-react"

export function Navbar() {
  const router = useRouter()
  const { user, clear } = useAuthStore()

  const handleLogout = async () => {
    try {
      await accountApi.logout()
    } catch {
      // Ignore error on logout call and clear client state anyway
    } finally {
      clear()
      router.push("/login")
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Link2 className="h-4 w-4" />
          </div>
          <span className="font-bold text-zinc-900 dark:text-zinc-50 text-lg tracking-tight">
            Shortly
          </span>
        </Link>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
              {user.role === "ADMIN" ? (
                <Shield className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              ) : (
                <UserIcon className="h-4 w-4 text-zinc-500" />
              )}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{user.email}</span>
            </div>

            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
              {user.role}
            </Badge>

            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 cursor-pointer">
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
