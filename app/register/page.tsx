"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { accountApi } from "@/services/api/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import { AuthShell } from "@/components/auth/authShell"
import { GoogleAuthButton } from "@/components/auth/googleAuthButton"
import { parseErrorMessage } from "@/lib/parseErrorMessage"

export default function RegisterPage() {
  const router = useRouter()
  const { hydrated, setUser, setAccessToken } = useAuth()

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data } = await accountApi.register(email, password, username)
      setAccessToken(data.accessToken)
      setUser(data.user)
      router.push("/dashboard")
    } catch (err) {
      setError(parseErrorMessage(err, "Registration failed. Please check your information."))
    } finally {
      setLoading(false)
    }
  }

  if (!hydrated) {
    return null
  }

  return (
    <AuthShell
      subtitle="Create your new Shortly account"
      cardTitle="Create Account"
      cardDescription="Enter your details below to get started with Shortly"
      error={error}
      footer={
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-zinc-900 underline dark:text-zinc-100">
            Sign In
          </Link>
        </p>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="reg-email">Email address</Label>
          <Input
            id="reg-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reg-username">Username</Label>
          <Input
            id="reg-username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reg-password">Password</Label>
          <Input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full gap-2 cursor-pointer" disabled={loading}>
          <UserPlus className="h-4 w-4" />
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <GoogleAuthButton setError={setError} setLoading={setLoading} />
    </AuthShell>
  )
}