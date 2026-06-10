"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ShoppingCart, EllipsisVertical, InspectionPanelIcon, LayoutDashboard, LogOut, Package, Truck, ClipboardList, BarChart2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "@/lib/action/auth"

const navData = [
  { title: "Dashboard",  url: "/",           icon: LayoutDashboard },
  { title: "Inventory",  url: "/inventory",  icon: Package },
  { title: "Suppliers",  url: "/suppliers",  icon: Truck },
  { title: "Orders",     url: "/orders",     icon: ShoppingCart },
  { title: "History",    url: "/history",    icon: ClipboardList },
  { title: "Reports",    url: "/reports",    icon: BarChart2 },
]

export function AppSidebar({ email }: { email: string }) {
  const initials = email.slice(0, 2).toUpperCase()
  const pathname = usePathname()
  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton               
              size="lg"
              className=" data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-orange-50">
                <div className="bg-orange-400 text-white text p-1.5 rounded-sm">
                    <InspectionPanelIcon className="w-4 h-4" />
                </div>
                <span className="text-base font-semibold text-orange-400">Inventory system</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup >
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {navData.map((nav) => {
                const isActive = nav.url === '/' ? pathname === '/' : pathname.startsWith(nav.url)
                return (
                  <SidebarMenuItem key={nav.title}>
                      <SidebarMenuButton
                          asChild
                          tooltip={nav.title}
                          isActive={isActive}
                          className="hover:bg-orange-50 hover:text-orange-400 data-[active=true]:bg-orange-50 data-[active=true]:text-orange-400"
                      >
                          <Link href={nav.url}>
                              {nav.icon && <nav.icon />}
                              <span>{nav.title}</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter >

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={email}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-orange-400 text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs text-muted-foreground">{email}</span>
                  </div>
                  <EllipsisVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="right">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-orange-400 text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs text-muted-foreground">{email}</span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-red-500 cursor-pointer">
                  <form action={logout}>
                    <button type="submit" className="flex items-center gap-2 w-full">
                      <LogOut className="size-4" /> Log out
                    </button>
                  </form>
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarFooter>
    </Sidebar>
  )
}