"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

export function HistoryFilters({ current }: { current: { search: string; issuedTo: string; from: string; to: string } }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [search,   setSearch]   = useState(current.search)
    const [issuedTo, setIssuedTo] = useState(current.issuedTo)
    const [from,     setFrom]     = useState(current.from)
    const [to,       setTo]       = useState(current.to)

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (search)   params.set("search",   search);   else params.delete("search")
            if (issuedTo) params.set("issuedTo", issuedTo); else params.delete("issuedTo")
            if (from)     params.set("from",     from);     else params.delete("from")
            if (to)       params.set("to",       to);       else params.delete("to")
            params.delete("page")
            router.push(`${pathname}?${params.toString()}`)
        }, 400)
        return () => clearTimeout(timeout)
    }, [search, issuedTo, from, to])

    return (
        <div className="flex flex-wrap gap-2 mb-3">
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search item..." className="pl-8 h-8 w-44 text-sm" />
            </div>
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input value={issuedTo} onChange={e => setIssuedTo(e.target.value)}
                    placeholder="Issued to..." className="pl-8 h-8 w-44 text-sm" />
            </div>
            <Input type="date" value={from} onChange={e => setFrom(e.target.value)}
                className="h-8 w-36 text-sm" />
            <Input type="date" value={to} onChange={e => setTo(e.target.value)}
                className="h-8 w-36 text-sm" />
        </div>
    )
}
