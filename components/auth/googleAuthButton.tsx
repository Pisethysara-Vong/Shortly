"use client"

import { GoogleLogin } from "@react-oauth/google"
import { GoogleDivider } from "./googleDivider"
import { useGoogleAuth } from "@/hooks/useGoogleAuth"

interface GoogleAuthButtonProps {
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

export function GoogleAuthButton({ setError, setLoading }: GoogleAuthButtonProps) {
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth({ setError, setLoading })

  return (
    <>
      <GoogleDivider />
      <div className="flex justify-center">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
      </div>
    </>
  )
}