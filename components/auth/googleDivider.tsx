export function GoogleDivider() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
          Or Google
        </span>
      </div>
    </div>
  )
}