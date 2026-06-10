import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
    page: number
    totalPages: number
    basePath: string
    paramName?: string
    extraParams?: Record<string, string>
}

function buildUrl(basePath: string, paramName: string, p: number, extraParams?: Record<string, string>) {
    const params = new URLSearchParams({ ...extraParams, [paramName]: String(p) })
    return `${basePath}?${params.toString()}`
}

function getPageNumbers(page: number, totalPages: number): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const pages: (number | '...')[] = [1]

    if (page > 3) pages.push('...')

    const start = Math.max(2, page - 1)
    const end   = Math.min(totalPages - 1, page + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    if (page < totalPages - 2) pages.push('...')

    pages.push(totalPages)
    return pages
}

export function Pagination({ page, totalPages, basePath, paramName = 'page', extraParams }: Props) {
    const pageNumbers = getPageNumbers(page, totalPages)

    return (
        <div className="flex items-center gap-1">
            {page > 1 ? (
                <Link href={buildUrl(basePath, paramName, page - 1, extraParams)}>
                    <Button size="sm" variant="outline" className="gap-1 px-3">
                        <ChevronLeft className="w-4 h-4" /> Prev
                    </Button>
                </Link>
            ) : (
                <Button size="sm" variant="outline" disabled className="gap-1 px-3">
                    <ChevronLeft className="w-4 h-4" /> Prev
                </Button>
            )}

            {pageNumbers.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">...</span>
                ) : (
                    <Link key={p} href={buildUrl(basePath, paramName, p, extraParams)}>
                        <Button
                            size="xs"
                            variant={p === page ? "default" : "outline"}
                            className={`w-8 h-8 p-0 ${p === page ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500" : ""}`}
                        >
                            {p}
                        </Button>
                    </Link>
                )
            )}

            {page < totalPages ? (
                <Link href={buildUrl(basePath, paramName, page + 1, extraParams)}>
                    <Button size="sm" variant="outline" className="gap-1 px-3">
                        Next <ChevronRight className="w-4 h-4" />
                    </Button>
                </Link>
            ) : (
                <Button size="sm" variant="outline" disabled className="gap-1 px-3">
                    Next <ChevronRight className="w-4 h-4" />
                </Button>
            )}
        </div>
    )
}
