"use client"

import * as React from "react"

import { NavMain } from "@/components/molecules/NavMain"
import { NavProjects } from "@/components/molecules/NavProjects"
import { NavUser } from "@/components/molecules/NavUser"
import { TeamSwitcher } from "@/components/molecules/TeamSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, LayoutDashboard, FileTextIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboard />
      ),
      isActive: true,
    },
    {
      title: "Artículos",
      url: "/dashboard/articles",
      icon: (
        <FileTextIcon />
      ),
      items: [
        {
          title: "Mis Artículos",
          url: "/dashboard/articles",
        },
        {
          title: "Crear Artículo",
          url: "/dashboard/articles/create",
        },
      ],
    },
    {
      title: "Configuración",
      url: "/dashboard/settings",
      icon: (
        <Settings2Icon />
      ),
      items: [
        {
          title: "Perfil",
          url: "/dashboard/settings/profile",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <FrameIcon
        />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <PieChartIcon
        />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
}

import { useEffect, useState } from "react"
import { userService } from "@/actions/user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userProfile, setUserProfile] = useState<{name: string, email: string, avatar: string}>(data.user)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await userService.getProfile();
        
        let avatarUrl = "";
        if (profile.author?.avatar?.url) {
          avatarUrl = profile.author.avatar.url.startsWith('http') 
            ? profile.author.avatar.url 
            : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${profile.author.avatar.url}`;
        }
        
        setUserProfile({
          name: profile.author?.name || profile.username,
          email: profile.email,
          avatar: avatarUrl || data.user.avatar,
        });
      } catch (error) {
        console.error("Error cargando el usuario en el sidebar:", error);
      }
    };
    
    fetchUser();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userProfile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
