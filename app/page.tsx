// app/page.tsx
"use client"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex items-center space-x-2 text-sm text-zinc-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        <span>Redirecting...</span>
      </div>
    </div>
  )
}