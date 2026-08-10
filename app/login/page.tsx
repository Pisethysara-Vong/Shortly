"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { accountApi } from "@/services/api/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"
import { AuthShell } from "@/components/auth/authShell"
import { GoogleAuthButton } from "@/components/auth/googleAuthButton"
import { parseErrorMessage } from "@/lib/parseErrorMessage"

export default function LoginPage() {
  const router = useRouter()
  const { hydrated, setUser, setAccessToken } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data } = await accountApi.login(email, password)
      setAccessToken(data.accessToken)
      setUser(data.user)
      router.push("/dashboard")
    } catch (err) {
      setError(parseErrorMessage(err, "Invalid email or password. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  if (!hydrated) {
    return null
  }

  return (
    <AuthShell
      subtitle="Sign in to your account"
      cardTitle="Sign In"
      cardDescription="Enter your email and password to access Shortly"
      error={error}
      footer={
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-zinc-900 underline dark:text-zinc-100">
            Register
          </Link>
        </p>
      }
    >
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

      <GoogleAuthButton setError={setError} setLoading={setLoading} />
    </AuthShell>
  )
}