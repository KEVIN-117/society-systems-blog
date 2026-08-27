"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  FileTextIcon,
  BookOpenIcon,
  Settings2Icon,
  PenToolIcon,
  Command,
} from "lucide-react"

import { NavUser } from "@/components/molecules/NavUser"
import { useEffect, useState } from "react"
import { userService } from "@/actions/user"

// Nav configuration without nested structures (Flat Design)
const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    exact: true,
  },
  {
    title: "Mis Artículos",
    url: "/dashboard/articles",
    icon: <FileTextIcon className="w-5 h-5" />,
    exact: true,
  },
  {
    title: "Explorar",
    url: "/dashboard/articles/explore",
    icon: <BookOpenIcon className="w-5 h-5" />,
    exact: false,
  },
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: <Settings2Icon className="w-5 h-5" />,
    exact: false,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; avatar: string }>({
    name: "Cargando...",
    email: "",
    avatar: "",
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await userService.getProfile()

        let avatarUrl = ""
        if (profile.author?.avatar?.url) {
          avatarUrl = profile.author.avatar.url.startsWith("http")
            ? profile.author.avatar.url
            : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${profile.author.avatar.url}`
        }

        setUserProfile({
          name: profile.author?.name || profile.username,
          email: profile.email,
          avatar: avatarUrl || "/avatars/shadcn.jpg", // Fallback avatar if needed
        })
      } catch (error) {
        console.error("Error cargando el usuario en el sidebar:", error)
      }
    }

    fetchUser()
  }, [])

  return (
    <Sidebar collapsible="icon" {...props} className="bg-[#050509] border-r border-white/10">
      <SidebarHeader className="py-4 pt-6 px-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pt-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 overflow-hidden rounded-md text-sidebar-foreground outline-none transition-transform hover:opacity-80 focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#00b4db] text-black">
            <Command className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm text-white tracking-tight">Society</span>
            <span className="text-xs text-gray-400 font-medium">Systems</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="bg-white/5 mx-2 my-2 group-data-[collapsible=icon]:mx-2" />

      <SidebarContent className="px-2 py-2 flex flex-col gap-6 group-data-[collapsible=icon]:px-0">
        {/* Acciones Rápidas (Principal Action) */}
        <SidebarGroup className="p-2 pt-0 pb-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard/articles/create" />}
                className="group relative flex w-full items-center gap-3 rounded-xl p-3 h-12 bg-gradient-to-r from-[#00b4db]/10 to-transparent hover:from-[#00b4db]/20 hover:to-[#00b4db]/5 border border-[#00b4db]/20 text-[#00b4db] transition-all hover:shadow-lg hover:shadow-[#00b4db]/10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-md"
              >
                <PenToolIcon className="w-5 h-5 shrink-0" />
                <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">Crear Artículo</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Navegación General */}
        <SidebarGroup className="p-2">
          <SidebarMenu className="gap-2">
            {navMain.map((item) => {
              const isActive = item.exact
                ? pathname === item.url
                : pathname.startsWith(item.url)

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    className={`flex items-center gap-3 rounded-lg p-3 h-11 transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 ${isActive
                      ? "bg-white/10 text-white font-medium shadow-sm border border-white/5"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <div className="shrink-0">{item.icon}</div>
                    <span className="text-sm group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 group-data-[collapsible=icon]:p-2">
        <NavUser user={userProfile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
