// app/login/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { accountApi } from "@/services/api/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link2, AlertCircle, LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { hydrated, setUser, setAccessToken } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [googleIdToken, setGoogleIdToken] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const parseErrorMessage = (err: unknown): string => {
    if (typeof err === "object" && err !== null && "response" in err) {
      const res = (err as { response?: { data?: { message?: string | string[] } } }).response
      if (res?.data?.message) {
        return Array.isArray(res.data.message) ? res.data.message.join(", ") : res.data.message
      }
    }
    return "Invalid email or password. Please try again."
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data } = await accountApi.login(email, password)
      if (data.accessToken && data.user) {
        setAccessToken(data.accessToken)
        setUser(data.user)
        router.push("/dashboard")
      } else {
        const meRes = await accountApi.me()
        setUser(meRes.data)
        router.push("/dashboard")
      }
    } catch (err) {
      setError(parseErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!googleIdToken.trim()) return
    setError(null)
    setLoading(true)

    try {
      const { data } = await accountApi.googleAuth(googleIdToken.trim())
      if (data.accessToken && data.user) {
        setAccessToken(data.accessToken)
        setUser(data.user)
        router.push("/dashboard")
      }
    } catch (err) {
      setError(parseErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!hydrated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Link2 className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Shortly
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your account
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xs">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access Shortly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email address</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2 cursor-pointer" disabled={loading}>
                <LogIn className="h-4 w-4" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                  Or Google OAuth
                </span>
              </div>
            </div>

            <form onSubmit={handleGoogleAuth} className="space-y-2">
              <div className="space-y-1.5">
                <Label htmlFor="google-token">Google ID Token</Label>
                <div className="flex gap-2">
                  <Input
                    id="google-token"
                    type="text"
                    placeholder="Paste Google ID Token..."
                    value={googleIdToken}
                    onChange={(e) => setGoogleIdToken(e.target.value)}
                  />
                  <Button type="submit" variant="outline" disabled={loading || !googleIdToken.trim()}>
                    Auth
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-900 pt-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-zinc-900 underline dark:text-zinc-100">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}