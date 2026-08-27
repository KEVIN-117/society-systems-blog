"use client"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, Settings2Icon, LogOutIcon } from "lucide-react"
import { authService } from "@/actions/auth"
import { cn } from "@/lib/utils"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const avatarInitials = user.name ? user.name.slice(0, 2).toUpperCase() : "US"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="w-full justify-start gap-3 hover:bg-white/5 data-[state=open]:bg-white/5 transition-colors border border-transparent rounded-xl p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
              >
                <Avatar className="h-9 w-9 border border-white/10 rounded-lg group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                  <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                  <AvatarFallback className="bg-[#72004c]/30 text-white rounded-lg font-medium group-data-[collapsible=icon]:text-xs">{avatarInitials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-white tracking-tight">{user.name}</span>
                  <span className="truncate text-xs text-gray-400">{user.email}</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4 text-gray-500 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-56 rounded-xl border border-white/10 bg-[#060609] text-white shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 text-left text-sm">
                <Avatar className="h-10 w-10 border border-white/10 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                  <AvatarFallback className="bg-[#72004c]/30 text-white rounded-lg">{avatarInitials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-gray-400">{user.email}</span>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuGroup className="p-1">
              <DropdownMenuItem
                render={<Link href="/dashboard/settings" />}
                className="cursor-pointer focus:bg-white/10 focus:text-white rounded-md"
              >
                <div className="flex items-center w-full gap-2 px-2 py-1">
                  <Settings2Icon className="size-4 text-gray-400" />
                  <span>Configuración</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/10" />
            <div className="p-1">
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors font-medium text-left"
                onClick={authService.logout}
              >
                <LogOutIcon className="size-4" />
                Cerrar sesión
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
