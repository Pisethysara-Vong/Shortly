// app/register/page.tsx
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
import { Link2, AlertCircle, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { hydrated, setUser, setAccessToken } = useAuth()

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const parseErrorMessage = (err: unknown): string => {
    if (typeof err === "object" && err !== null && "response" in err) {
      const res = (err as { response?: { data?: { message?: string | string[] } } }).response
      if (res?.data?.message) {
        return Array.isArray(res.data.message) ? res.data.message.join(", ") : res.data.message
      }
    }
    return "Registration failed. Please check your information."
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data } = await accountApi.register(email, password, username)
      if (data.accessToken && data.user) {
        setAccessToken(data.accessToken)
        setUser(data.user)
        router.push("/dashboard")
      } else {
        const loginRes = await accountApi.login(email, password)
        setAccessToken(loginRes.data.accessToken)
        setUser(loginRes.data.user)
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
            Create your new Shortly account
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
            <CardTitle className="text-xl">Create Account</CardTitle>
            <CardDescription>
              Enter your details below to get started with Shortly
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-900 pt-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-zinc-900 underline dark:text-zinc-100">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}