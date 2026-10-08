import { LogOutIcon, PackageIcon } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar.tsx'
import { useAuth } from '@/shared/auth/useAuth.ts'

export default function AppSidebar() {
  const { endSession } = useAuth()
  const { pathname } = useLocation()
  const productsActive = pathname === '/' || pathname.startsWith('/productos')

  return (
    <Sidebar>
      <SidebarHeader>
        <p className="px-2 font-heading text-sm font-medium">Boxes</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Inventario</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={productsActive} render={<NavLink to="/" />}>
                  <PackageIcon />
                  Productos
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={endSession}>
              <LogOutIcon />
              Cerrar sesión
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
