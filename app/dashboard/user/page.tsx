// app/dashboard/user/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { urlApi } from "@/services/api/url"
import { UrlResponse } from "@/types/shared"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Link2,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  RefreshCw,
  Clock,
  MousePointerClick,
  AlertCircle,
  Plus
} from "lucide-react"

export default function UserDashboardPage() {
  const router = useRouter()
  const { user, hydrated, checking } = useAuth()

  // Ensure admins visiting /dashboard/user get redirected to /dashboard/admin
  useEffect(() => {
    if (user && user.role === "ADMIN") {
      router.push("/dashboard/admin")
    }
  }, [user, router])

  const [originalUrl, setOriginalUrl] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [creating, setCreating] = useState(false)
  const [createdUrl, setCreatedUrl] = useState<UrlResponse | null>(null)

  const [urls, setUrls] = useState<UrlResponse[]>([])
  const [loadingUrls, setLoadingUrls] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getShortUrlString = (shortCode: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444/api"
    return `${apiBase}/redirect/${shortCode}`
  }

  const fetchMyUrls = useCallback(async () => {
    setLoadingUrls(true)
    setError(null)
    try {
      const { data } = await urlApi.getMyUrls()
      setUrls(Array.isArray(data) ? data : [])
    } catch {
      setError("Failed to load your URLs. Please try again.")
    } finally {
      setLoadingUrls(false)
    }
  }, [])

  useEffect(() => {
    if (user?.role === "USER") {
      fetchMyUrls()
    }
  }, [user, fetchMyUrls])

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originalUrl.trim()) return

    setCreating(true)
    setError(null)
    setCreatedUrl(null)

    try {
      const isoExpiry = expiresAt ? new Date(expiresAt).toISOString() : undefined
      const { data } = await urlApi.create(originalUrl.trim(), isoExpiry)
      setCreatedUrl(data)
      setOriginalUrl("")
      setExpiresAt("")
      fetchMyUrls()
    } catch {
      setError("Failed to create short URL. Please check the URL format.")
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteUrl = async (id: string) => {
    setDeletingId(id)
    try {
      await urlApi.delete(id)
      setUrls((prev) => prev.filter((u) => u.id !== id))
      if (createdUrl?.id === id) {
        setCreatedUrl(null)
      }
    } catch {
      setError("Failed to delete URL.")
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const isExpired = (expiryStr: string | null) => {
    if (!expiryStr) return false
    return new Date(expiryStr) < new Date()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
    // Unauthenticated: AuthProvider is already redirecting to /login.
    // Admin: the effect above is already redirecting to /dashboard/admin.
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
            <form onSubmit={handleCreateUrl} className="space-y-4">
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
                  <Input
                    id="expires-at"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" disabled={creating || !originalUrl.trim()} className="gap-2 cursor-pointer">
                <Link2 className="h-4 w-4" />
                {creating ? "Shortening..." : "Shorten URL"}
              </Button>
            </form>

            {createdUrl && (
              <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-100/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Short URL Generated:
                    </p>
                    <a
                      href={getShortUrlString(createdUrl.shortCode)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-zinc-900 underline hover:text-zinc-700 dark:text-zinc-100 truncate block"
                    >
                      {getShortUrlString(createdUrl.shortCode)}
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(getShortUrlString(createdUrl.shortCode), "new-url")}
                    className="gap-1.5 shrink-0"
                  >
                    {copiedId === "new-url" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                My Shortened URLs
              </CardTitle>
              <CardDescription>
                Manage your generated links and monitor total clicks.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchMyUrls} disabled={loadingUrls} className="gap-1.5 cursor-pointer">
              <RefreshCw className={`h-3.5 w-3.5 ${loadingUrls ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </CardHeader>

          <CardContent className="p-0 sm:p-6 sm:pt-0">
            {loadingUrls ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                Loading your URLs...
              </div>
            ) : urls.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                You haven&apos;t created any short URLs yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short Link</TableHead>
                    <TableHead>Original URL</TableHead>
                    <TableHead className="text-center">Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => {
                    const fullShortUrl = getShortUrlString(url.shortCode)
                    const expired = isExpired(url.expiresAt)

                    return (
                      <TableRow key={url.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {url.shortCode}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleCopy(fullShortUrl, url.id)}
                              title="Copy Short URL"
                            >
                              {copiedId === url.id ? (
                                <Check className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-zinc-500" />
                              )}
                            </Button>
                            <a
                              href={fullShortUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                              title="Open Short Link"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-xs truncate" title={url.originalUrl}>
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-600 hover:underline dark:text-zinc-400"
                          >
                            {url.originalUrl}
                          </a>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge variant="secondary" className="gap-1 font-mono">
                            <MousePointerClick className="h-3 w-3 text-zinc-500" />
                            {url.clickCount}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-xs text-zinc-500">
                          {formatDate(url.createdAt)}
                        </TableCell>

                        <TableCell>
                          {url.expiresAt ? (
                            expired ? (
                              <Badge variant="destructive" className="gap-1">
                                <Clock className="h-3 w-3" />
                                Expired
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1 text-xs">
                                <Clock className="h-3 w-3 text-zinc-500" />
                                {formatDate(url.expiresAt)}
                              </Badge>
                            )
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Never
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                            onClick={() => handleDeleteUrl(url.id)}
                            disabled={deletingId === url.id}
                            title="Delete URL"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}