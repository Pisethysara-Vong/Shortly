"use client"

import { Link2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthShellProps {
  subtitle: string
  cardTitle: string
  cardDescription: string
  error: string | null
  footer: React.ReactNode
  children: React.ReactNode
}

export function AuthShell({ subtitle, cardTitle, cardDescription, error, footer, children }: AuthShellProps) {
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
            {subtitle}
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
            <CardTitle className="text-xl">{cardTitle}</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
          <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-900 pt-4">
            {footer}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}