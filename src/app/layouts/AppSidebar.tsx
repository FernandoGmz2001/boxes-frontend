import { BoxesIcon, LogOutIcon, PackageIcon, TagsIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { useAuth } from "@/shared/auth/useAuth.ts";

const menuButtonClassName =
  "h-10 rounded-xl px-2.5 font-medium text-muted-foreground hover:bg-accent hover:text-foreground data-active:bg-accent/40 data-active:text-primary data-active:dark:text-foreground data-active:dark:bg-foreground/4 group-data-[collapsible=icon]:rounded-xl";

export default function AppSidebar() {
  const { endSession } = useAuth();
  const { pathname } = useLocation();
  const productsActive = pathname === "/" || pathname.startsWith("/productos");
  const categoriesActive = pathname.startsWith("/categorias");

  return (
    <Sidebar
      collapsible="icon"
      className="[&_[data-slot=sidebar-inner]]:bg-background"
    >
      <SidebarHeader className="px-3 py-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground group-data-[collapsible=icon]:size-8">
          <BoxesIcon className="size-5" />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 pt-1 group-data-[collapsible=icon]:overflow-visible">
        <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              isActive={productsActive}
              tooltip="Productos"
              className={menuButtonClassName}
              render={<NavLink to="/" />}
            >
              <PackageIcon />
              <span>Productos</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              isActive={categoriesActive}
              tooltip="Categorías"
              className={menuButtonClassName}
              render={<NavLink to="/categorias" />}
            >
              <TagsIcon />
              <span>Categorías</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="gap-2 px-3 pt-2 pb-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center text-">
            <SidebarMenuButton
              tooltip="Cerrar sesión"
              className={
                "h-10 rounded-xl px-2.5 font-medium text-destructive hover:bg-red/50 hover:text-destructive data-active:bg-red/50 data-active:text-destructive group-data-[collapsible=icon]:rounded-xl"
              }
              onClick={endSession}
            >
              <LogOutIcon />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
