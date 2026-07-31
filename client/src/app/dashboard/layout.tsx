import { AppSidebar } from "@/components/organisms/AppSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Cpu } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-white/5 bg-[#060609]">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <Cpu className="w-4 h-4 text-[#72004c]" />
              <span className="font-heading">Dashboard SOCITEC</span>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-[#060609]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
