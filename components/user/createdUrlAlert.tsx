"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, CheckCircle2 } from "lucide-react"
import { UrlResponse } from "@/types/shared"
import { getShortUrlString } from "@/lib/urlFormat"

interface CreatedUrlAlertProps {
    createdUrl: UrlResponse
}

export function CreatedUrlAlert({ createdUrl }: CreatedUrlAlertProps) {
    const [copied, setCopied] = useState(false)
    const shortUrl = getShortUrlString(createdUrl.shortCode)

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Alert variant="success" className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                        <p className="text-xs font-medium opacity-80">Short URL Generated:</p>
                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold underline hover:opacity-80 truncate block"
                        >
                            {shortUrl}
                        </a>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 shrink-0">
                        {copied ? (
                            <>
                                <Check className="h-3.5 w-3.5 text-green-600" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Link</span>
                            </>
                        )}
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    )
}