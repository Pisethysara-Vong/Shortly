// apiBuilder.ts

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { tokenStore, useAuthStore } from '@/stores/authStore'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends httpOnly cookie on every request
})

// ============================================================================
// REQUEST INTERCEPTOR — attach access token to every request
// ============================================================================
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ============================================================================
// RESPONSE INTERCEPTOR — silent token refresh on 401
// Prevents race conditions using a refresh lock + queue
// ============================================================================
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token!)
  })
  failedQueue = []
}

// Endpoints that must never trigger a refresh attempt on 401 — hitting
// refresh from any of these would either loop or make no sense
// (there's no session yet to refresh).
const AUTH_BYPASS_PATHS = [
  '/account/refresh',
  '/account/login',
  '/account/register',
  '/account/google',
]

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    const isBypassed = AUTH_BYPASS_PATHS.some((path) =>
      originalRequest.url?.includes(path),
    )

    if (error.response?.status === 401 && !originalRequest._retry && !isBypassed) {
      if (isRefreshing) {
        // Queue this request until the ongoing refresh completes
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (originalRequest.headers) {
            (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${token}`
          }
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await api.post('/account/refresh')
        const newToken: string = data.accessToken
        tokenStore.set(newToken)
        processQueue(null, newToken)
        if (originalRequest.headers) {
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().clear()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)