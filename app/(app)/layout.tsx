import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../appsidebar"
import { SiteHeader } from "../siteHeader"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getSession } from "@/lib/auth"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession()

    return (
        <TooltipProvider>
            <SidebarProvider className="flex-1">
                <AppSidebar email={session?.email ?? ''} />
                <SidebarInset className="bg-[#fafafa]">
                    <div className="flex flex-col flex-1 bg-white m-1 h-full">
                        <SiteHeader />
                        <div className="p-4 flex flex-col flex-1">
                            {children}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
