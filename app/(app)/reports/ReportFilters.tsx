"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function ReportFilters({ from, to }: { from: string; to: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [fromVal, setFromVal] = useState(from)
    const [toVal, setToVal] = useState(to)

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (fromVal) params.set("from", fromVal)
        if (toVal) params.set("to", toVal)
        router.push(`${pathname}?${params.toString()}`)
    }, [fromVal, toVal])

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500">Date range:</span>
            <input
                type="date"
                value={fromVal}
                onChange={e => setFromVal(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm text-black"
            />
            <span className="text-sm text-gray-400">to</span>
            <input
                type="date"
                value={toVal}
                onChange={e => setToVal(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm text-black"
            />
        </div>
    )
}
