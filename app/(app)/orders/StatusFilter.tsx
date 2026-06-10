"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const STATUSES = [
    { label: "All",       value: "",           style: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
    { label: "Pending",   value: "pending",    style: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
    { label: "Approved",  value: "approved",   style: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
    { label: "Received",  value: "received",   style: "bg-green-100 text-green-800 hover:bg-green-200" },
    { label: "Cancelled", value: "cancelled",  style: "bg-red-100 text-red-800 hover:bg-red-200" },
]

export function StatusFilter({ current }: { current: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function handleClick(value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) params.set('status', value)
        else params.delete('status')
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex gap-2 mb-2">
            {STATUSES.map(s => (
                <Button
                    key={s.value}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleClick(s.value)}
                    className={`rounded-full border text-xs font-medium px-3 ${s.style} ${current === s.value ? "ring-2 ring-offset-1 ring-gray-400" : ""}`}
                >
                    {s.label}
                </Button>
            ))}
        </div>
    )
}
