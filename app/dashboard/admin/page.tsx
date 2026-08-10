"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useAdminUrls } from "@/hooks/useAdminUrls"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserEmailFilter } from "@/components/admin/userEmailFilter"
import { AdminUrlsTable } from "@/components/admin/adminUrlsTable"
import { ShieldAlert, Search, RefreshCw, AlertCircle } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, hydrated, checking } = useAuth()

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/dashboard/user")
    }
  }, [user, router])

  const {
    urls,
    loadingUrls,
    error,
    filterMode,
    fetchUrls,
    applyFilter,
    clearFilter,
  } = useAdminUrls({ enabled: user?.role === "ADMIN" })

  if (!hydrated || checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex items-center space-x-2 text-sm text-zinc-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
          <span>Loading session...</span>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-12">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 space-y-6">
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="font-semibold">Admin Mode — Read Only Access</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm text-amber-800 dark:text-amber-400">
            You are logged in as an Administrator. You can view all URLs across the platform and filter by user email, but URL creation and deletion operations are disabled for admin roles.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              Filter & Search System URLs
            </CardTitle>
            <CardDescription>
              Filter URLs associated with a specific user or browse all URLs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserEmailFilter filterMode={filterMode} onApply={applyFilter} onClear={clearFilter} />
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">System URLs Overview</CardTitle>
              <CardDescription>System-wide database of all shortened URLs.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchUrls} disabled={loadingUrls} className="gap-1.5 cursor-pointer">
              <RefreshCw className={`h-3.5 w-3.5 ${loadingUrls ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </CardHeader>

          <CardContent className="p-0 sm:p-6 sm:pt-0">
            {loadingUrls ? (
              <div className="py-12 text-center text-sm text-zinc-500">Loading system URLs...</div>
            ) : urls.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">No URLs found.</div>
            ) : (
              <AdminUrlsTable urls={urls} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}