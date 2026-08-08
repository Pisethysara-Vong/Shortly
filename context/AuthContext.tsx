// context/AuthContext.tsx
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore, tokenStore } from '@/stores/authStore'
import { accountApi } from '@/services/api/account'
import { User } from '@/types/shared'

interface AuthContextValue {
  user: User | null
  accessToken: string | null
  hydrated: boolean
  checking: boolean
  pendingEmail: string | null
  setPendingEmail: (email: string | null) => void
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const PROTECTED_PREFIXES = ['/dashboard']
const AUTH_PAGES = ['/login', '/register']

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, accessToken, _hydrated, setUser, setAccessToken, clear } = useAuthStore()
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  const logout = useCallback(() => {
    tokenStore.clear()
    clear()
    window.location.href = '/login'
  }, [clear])

  // One-time session verification, right after the store rehydrates.
  // Lives here (not per-page) so it runs once per full page load.
  useEffect(() => {
    if (!_hydrated) return

    let cancelled = false

    const verifySession = async () => {
      if (!useAuthStore.getState().user) {
        if (!cancelled) setChecking(false)
        return
      }

      try {
        const { data } = await accountApi.me()
        if (!cancelled && data) setUser(data)
      } catch {
        if (!cancelled) clear()
      } finally {
        if (!cancelled) setChecking(false)
      }
    }

    verifySession()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hydrated])

  // Single source of truth for all auth-based routing decisions.
  useEffect(() => {
    if (!_hydrated || checking) return

    const isAuthed = Boolean(user && accessToken)
    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
    const isAuthPage = AUTH_PAGES.includes(pathname)

    if (pathname === '/') {
      router.replace(isAuthed ? '/dashboard' : '/login')
    } else if (!isAuthed && isProtected) {
      router.replace('/login')
    } else if (isAuthed && isAuthPage) {
      router.replace('/dashboard')
    }
  }, [_hydrated, checking, user, accessToken, pathname, router])

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        hydrated: _hydrated,
        checking,
        pendingEmail,
        setPendingEmail,
        setUser,
        setAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}