// app/dashboard/admin/page.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Search,
  RefreshCw,
  Clock,
  MousePointerClick,
  AlertCircle,
  X
} from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, hydrated, checking } = useAuth()

  // Ensure regular users visiting /dashboard/admin get redirected to /dashboard/user
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/dashboard/user")
    }
  }, [user, router])

  const [urls, setUrls] = useState<UrlResponse[]>([])
  const [loadingUrls, setLoadingUrls] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [activeFilterEmail, setActiveFilterEmail] = useState("")
  const [filterMode, setFilterMode] = useState<"all" | "user">("all")
  const emailInputRef = useRef<HTMLInputElement>(null)

  const getShortUrlString = (shortCode: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444/api"
    return `${apiBase}/redirect/${shortCode}`
  }

  const fetchAdminUrls = useCallback(async () => {
    setLoadingUrls(true)
    setError(null)
    try {
      if (filterMode === "user" && activeFilterEmail) {
        const { data } = await urlApi.admin.getUserUrls(activeFilterEmail)
        setUrls(Array.isArray(data) ? data : [])
      } else {
        const { data } = await urlApi.admin.getAll()
        setUrls(Array.isArray(data) ? data : [])
      }
    } catch {
      setError("Failed to load system URLs. Please verify your admin credentials.")
    } finally {
      setLoadingUrls(false)
    }
  }, [filterMode, activeFilterEmail])

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchAdminUrls()
    }
  }, [user?.role, fetchAdminUrls])

  const handleApplyFilter = () => {
    const value = emailInputRef.current?.value.trim() ?? ""
    if (!value) return
    setFilterMode("user")
    setActiveFilterEmail(value)
  }

  const handleClearFilter = () => {
    if (emailInputRef.current) {
      emailInputRef.current.value = ""
    }
    setActiveFilterEmail("")
    setFilterMode("all")
  }

  const handleFilterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleApplyFilter()
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
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="w-full sm:w-80 space-y-2.5">
                <Label htmlFor="target-user-email">Filter by Target User Email</Label>
                <Input
                  id="target-user-email"
                  type="email"
                  placeholder="Enter user email..."
                  ref={emailInputRef}
                  onKeyDown={handleFilterKeyDown}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={handleApplyFilter}
                  className="cursor-pointer"
                >
                  Filter User
                </Button>
                {filterMode === "user" && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilter}
                    className="gap-1.5 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear Filter
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                System URLs Overview
              </CardTitle>
              <CardDescription>
                System-wide database of all shortened URLs.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchAdminUrls} disabled={loadingUrls} className="gap-1.5 cursor-pointer">
              <RefreshCw className={`h-3.5 w-3.5 ${loadingUrls ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </CardHeader>

          <CardContent className="p-0 sm:p-6 sm:pt-0">
            {loadingUrls ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                Loading system URLs...
              </div>
            ) : urls.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                No URLs found.
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