import type { CSSProperties } from 'react'
import { Outlet } from 'react-router'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx'
import AppBreadcrumb from './AppBreadcrumb.tsx'
import AppSidebar from './AppSidebar.tsx'

export default function AppShell() {
  return (
    <SidebarProvider
      className="h-svh overflow-hidden bg-background"
      style={{ '--sidebar-width': '18rem', '--sidebar-width-icon': '3.25rem' } as CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="min-h-0 overflow-hidden bg-background">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <AppBreadcrumb />
        </header>
        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
