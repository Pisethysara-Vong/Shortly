import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/shared'

interface AuthStore {
  user: User | null
  accessToken: string | null
  _hydrated: boolean
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  setHydrated: (val: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      _hydrated: false,
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setHydrated: (val) => set({ _hydrated: val }),
      clear: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        // Called once localStorage data has been loaded into the store
        state?.setHydrated(true)
      },
    },
  ),
)

export const tokenStore = {
  get: () => useAuthStore.getState().accessToken,
  set: (token: string) => useAuthStore.getState().setAccessToken(token),
  clear: () => useAuthStore.getState().setAccessToken(null),
}