"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Trash2, ExternalLink, Clock, MousePointerClick } from "lucide-react"
import { UrlResponse } from "@/types/shared"
import { getShortUrlString, formatDateTime, isExpired } from "@/lib/urlFormat"

interface UrlsTableProps {
    urls: UrlResponse[]
    deletingId: string | null
    onRequestDelete: (url: UrlResponse) => void
}

export function UrlsTable({ urls, deletingId, onRequestDelete }: UrlsTableProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Short Link</TableHead>
                    <TableHead>Original URL</TableHead>
                    <TableHead className="text-center">Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {urls.map((url) => {
                    const fullShortUrl = getShortUrlString(url.shortCode)
                    const expired = isExpired(url.expiresAt)

                    return (
                        <TableRow key={url.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center space-x-2">
                                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                        {url.shortCode}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 cursor-pointer"
                                        onClick={() => handleCopy(fullShortUrl, url.id)}
                                        title="Copy Short URL"
                                    >
                                        {copiedId === url.id ? (
                                            <Check className="h-3.5 w-3.5 text-green-600" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5 text-zinc-500" />
                                        )}
                                    </Button>
                                    <a
                                        href={fullShortUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                        title="Open Short Link"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </TableCell>

                            <TableCell className="max-w-xs truncate" title={url.originalUrl}>
                                <a
                                    href={url.originalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-zinc-600 hover:underline dark:text-zinc-400"
                                >
                                    {url.originalUrl}
                                </a>
                            </TableCell>

                            <TableCell className="text-center">
                                <Badge variant="secondary" className="gap-1 font-mono">
                                    <MousePointerClick className="h-3 w-3 text-zinc-500" />
                                    {url.clickCount}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-xs text-zinc-500">
                                {formatDateTime(url.createdAt)}
                            </TableCell>

                            <TableCell>
                                {url.expiresAt ? (
                                    expired ? (
                                        <Badge variant="destructive" className="gap-1">
                                            <Clock className="h-3 w-3" />
                                            Expired
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="gap-1 text-xs">
                                            <Clock className="h-3 w-3 text-zinc-500" />
                                            {formatDateTime(url.expiresAt)}
                                        </Badge>
                                    )
                                ) : (
                                    <Badge variant="secondary" className="text-xs">
                                        Never
                                    </Badge>
                                )}
                            </TableCell>

                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                                    onClick={() => onRequestDelete(url)}
                                    disabled={deletingId === url.id}
                                    title="Delete URL"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}