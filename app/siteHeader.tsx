"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function SiteHeader() {
    const pathname = usePathname()
    const title = pathname.split("/").filter(Boolean).pop() ?? "Dashboard"
    const formatted = title.charAt(0).toUpperCase() + title.slice(1)

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) p-1">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" />
                <h1 className="text-base font-medium">{formatted}</h1>
            </div>
        </header>
    )
}
