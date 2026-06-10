"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function CategoryFilter({ categories, current }: { categories: string[]; current: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function handleChange(category: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (category) params.set("category", category)
        else params.delete("category")
        params.delete("page")
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2 flex-wrap pt-2">
            <button
                onClick={() => handleChange("")}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    !current ? "bg-orange-400 text-white border-orange-400" : "bg-white text-gray-500 border-gray-200 hover:border-orange-300"
                }`}
            >
                All
            </button>
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => handleChange(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        current === cat ? "bg-orange-400 text-white border-orange-400" : "bg-white text-gray-500 border-gray-200 hover:border-orange-300"
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    )
}
