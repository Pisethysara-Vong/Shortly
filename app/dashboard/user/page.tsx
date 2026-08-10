"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useUserUrls } from "@/hooks/useUserUrls"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreateUrlForm } from "@/components/user/createUrlForm"
import { CreatedUrlAlert } from "@/components/user/createdUrlAlert"
import { UrlsTable } from "@/components/user/urlsTable"
import { DeleteUrlDialog } from "@/components/user/deleteUrlDialog"
import { AlertCircle, Plus, RefreshCw } from "lucide-react"
import { UrlResponse } from "@/types/shared"

export default function UserDashboardPage() {
  const router = useRouter()
  const { user, hydrated, checking } = useAuth()

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      router.push("/dashboard/admin")
    }
  }, [user, router])

  const {
    urls,
    loadingUrls,
    error,
    creating,
    createdUrl,
    deletingId,
    fetchUrls,
    createUrl,
    deleteUrl,
  } = useUserUrls({ enabled: user?.role === "USER" })

  const [urlToDelete, setUrlToDelete] = useState<UrlResponse | null>(null)

  const handleConfirmDelete = async (id: string) => {
    await deleteUrl(id)
    setUrlToDelete(null)
  }

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

  if (!user || user.role === "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-12">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              Shorten a Long URL
            </CardTitle>
            <CardDescription>
              Paste your original URL below to generate a short link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CreateUrlForm creating={creating} onCreate={createUrl} />
            {createdUrl && <CreatedUrlAlert createdUrl={createdUrl} />}
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">My Shortened URLs</CardTitle>
              <CardDescription>
                Manage your generated links and monitor total clicks.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchUrls} disabled={loadingUrls} className="gap-1.5 cursor-pointer">
              <RefreshCw className={`h-3.5 w-3.5 ${loadingUrls ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </CardHeader>

          <CardContent className="p-0 sm:p-6 sm:pt-0">
            {loadingUrls ? (
              <div className="py-12 text-center text-sm text-zinc-500">Loading your URLs...</div>
            ) : urls.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                You haven&apos;t created any short URLs yet.
              </div>
            ) : (
              <UrlsTable urls={urls} deletingId={deletingId} onRequestDelete={setUrlToDelete} />
            )}
          </CardContent>
        </Card>
      </main>

      <DeleteUrlDialog
        url={urlToDelete}
        deleting={deletingId === urlToDelete?.id}
        onCancel={() => setUrlToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}