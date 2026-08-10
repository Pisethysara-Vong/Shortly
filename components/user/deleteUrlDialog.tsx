"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UrlResponse } from "@/types/shared"

interface DeleteUrlDialogProps {
  url: UrlResponse | null
  deleting: boolean
  onCancel: () => void
  onConfirm: (id: string) => void
}

export function DeleteUrlDialog({ url, deleting, onCancel, onConfirm }: DeleteUrlDialogProps) {
  return (
    <AlertDialog open={!!url} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this short URL?</AlertDialogTitle>
          <AlertDialogDescription>
            {url && (
              <>
                This will permanently delete{" "}
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  {url.shortCode}
                </span>{" "}
                and its click history. This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => url && onConfirm(url.id)}
            disabled={deleting}
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}