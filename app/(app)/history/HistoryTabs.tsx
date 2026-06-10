"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ClipboardList, PackageCheck, SlidersHorizontal } from "lucide-react"

export function HistoryTabs({ activeTab, outbound, inbound, adjustments }: {
    activeTab: string
    outbound: React.ReactNode
    inbound: React.ReactNode
    adjustments: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function handleTabChange(value: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("tab", value)
        params.delete("page")
        params.delete("ipage")
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
            <TabsList>
                <TabsTrigger value="outbound">
                    <ClipboardList className="w-4 h-4 text-orange-400" />
                    Stock Issues (Outbound)
                </TabsTrigger>
                <TabsTrigger value="inbound">
                    <PackageCheck className="w-4 h-4 text-green-500" />
                    Order Receipts (Inbound)
                </TabsTrigger>
                <TabsTrigger value="adjustments">
                    <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                    Stock Adjustments
                </TabsTrigger>
            </TabsList>
            <TabsContent value="outbound" className="flex flex-col flex-1">{outbound}</TabsContent>
            <TabsContent value="inbound" className="flex flex-col flex-1">{inbound}</TabsContent>
            <TabsContent value="adjustments" className="flex flex-col flex-1">{adjustments}</TabsContent>
        </Tabs>
    )
}
