"use client"

import { useState, useCallback, useEffect } from "react"
import { urlApi } from "@/services/api/url"
import { UrlResponse } from "@/types/shared"

interface UseUserUrlsOptions {
  enabled: boolean
}

export function useUserUrls({ enabled }: UseUserUrlsOptions) {
  const [urls, setUrls] = useState<UrlResponse[]>([])
  const [loadingUrls, setLoadingUrls] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [creating, setCreating] = useState(false)
  const [createdUrl, setCreatedUrl] = useState<UrlResponse | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchUrls = useCallback(async () => {
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
    if (enabled) {
      fetchUrls()
    }
  }, [enabled, fetchUrls])

  const createUrl = useCallback(
    async (originalUrl: string, expiresAtIso?: string): Promise<boolean> => {
      setCreating(true)
      setError(null)
      setCreatedUrl(null)
      try {
        const { data } = await urlApi.create(originalUrl, expiresAtIso)
        setCreatedUrl(data)
        fetchUrls()
        return true
      } catch {
        setError("Failed to create short URL. Please check the URL format.")
        return false
      } finally {
        setCreating(false)
      }
    },
    [fetchUrls],
  )

  const deleteUrl = useCallback(async (id: string) => {
    setDeletingId(id)
    try {
      await urlApi.delete(id)
      setUrls((prev) => prev.filter((u) => u.id !== id))
      setCreatedUrl((prev) => (prev?.id === id ? null : prev))
    } catch {
      setError("Failed to delete URL.")
    } finally {
      setDeletingId(null)
    }
  }, [])

  return {
    urls,
    loadingUrls,
    error,
    creating,
    createdUrl,
    deletingId,
    fetchUrls,
    createUrl,
    deleteUrl,
  }
}