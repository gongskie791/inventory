"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center">
            <div className="bg-red-50 p-6 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-black">Something went wrong</h1>
                <p className="text-gray-500 mt-1 text-sm">{error.message ?? "An unexpected error occurred."}</p>
            </div>
            <Button onClick={reset} className="bg-orange-400 hover:bg-orange-500">Try again</Button>
        </div>
    )
}
