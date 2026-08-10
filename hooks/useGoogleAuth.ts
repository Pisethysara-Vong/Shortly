"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { accountApi } from "@/services/api/account"
import { parseErrorMessage } from "@/lib/parseErrorMessage"
import type { CredentialResponse } from "@react-oauth/google"

interface UseGoogleAuthOptions {
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

export function useGoogleAuth({ setError, setLoading }: UseGoogleAuthOptions) {
  const router = useRouter()
  const { setUser, setAccessToken } = useAuth()

  const handleGoogleSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) return
      setError(null)
      setLoading(true)

      try {
        const { data } = await accountApi.googleAuth(credentialResponse.credential)
        setAccessToken(data.accessToken)
        setUser(data.user)
        router.push("/dashboard")
      } catch (err) {
        setError(parseErrorMessage(err, "Google authentication failed. Please try again."))
      } finally {
        setLoading(false)
      }
    },
    [router, setUser, setAccessToken, setError, setLoading],
  )

  const handleGoogleError = useCallback(() => {
    setError("Google sign-in failed. Please try again.")
  }, [setError])

  return { handleGoogleSuccess, handleGoogleError }
}