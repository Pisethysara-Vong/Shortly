"use client"

import { useState, useCallback, useEffect } from "react"
import { urlApi } from "@/services/api/url"
import { UrlResponse } from "@/types/shared"

type FilterMode = "all" | "user"

interface UseAdminUrlsOptions {
  enabled: boolean
}

export function useAdminUrls({ enabled }: UseAdminUrlsOptions) {
  const [urls, setUrls] = useState<UrlResponse[]>([])
  const [loadingUrls, setLoadingUrls] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [activeFilterEmail, setActiveFilterEmail] = useState("")

  const fetchUrls = useCallback(async () => {
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
    if (enabled) {
      fetchUrls()
    }
  }, [enabled, fetchUrls])

  const applyFilter = useCallback((email: string) => {
    const trimmed = email.trim()
    if (!trimmed) return
    setFilterMode("user")
    setActiveFilterEmail(trimmed)
  }, [])

  const clearFilter = useCallback(() => {
    setActiveFilterEmail("")
    setFilterMode("all")
  }, [])

  return {
    urls,
    loadingUrls,
    error,
    filterMode,
    fetchUrls,
    applyFilter,
    clearFilter,
  }
}