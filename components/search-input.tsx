"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type Props = {
    paramKey?: string
    placeholder?: string
}

export function SearchInput({ paramKey = "search", placeholder = "Search..." }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(searchParams.get(paramKey) ?? "")

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) params.set(paramKey, value)
            else params.delete(paramKey)
            params.delete("page")
            router.push(`${pathname}?${params.toString()}`)
        }, 400)
        return () => clearTimeout(timeout)
    }, [value])

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={placeholder}
                className="pl-8 h-8 w-56 text-sm"
            />
        </div>
    )
}
