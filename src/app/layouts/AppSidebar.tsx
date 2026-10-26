import { cn } from "cn";
import { BoxesIcon, LogOutIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
import { useAuth } from "@/shared/auth/useAuth.ts";
import AppSidebarSearch from "./AppSidebarSearch.tsx";
import { useSidebarSearch } from "./hooks/useSidebarSearch.ts";

const menuButtonClassName =
  "h-10 gap-3 rounded-xl px-3 text-[0.9375rem] font-normal text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground data-active:bg-background data-active:font-medium data-active:text-sidebar-foreground data-active:shadow-[0_1px_2px_rgb(0_0_0/0.06)] data-active:ring-1 data-active:ring-sidebar-border dark:data-active:bg-sidebar-accent [&_svg]:size-[1.125rem] [&_svg]:text-sidebar-foreground/60 data-active:[&_svg]:text-sidebar-foreground group-data-[collapsible=icon]:rounded-xl";

export default function AppSidebar() {
  const { endSession } = useAuth();
  const { pathname } = useLocation();
  const { searchQuery, setSearchQuery, searchInputRef, filteredItems, openSearch, handleSearchKeyDown } =
    useSidebarSearch();

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="flex-row items-center gap-3 px-4 pt-5 pb-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:hidden">
          <BoxesIcon className="size-5" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
          <span className="truncate text-base font-semibold tracking-tight text-sidebar-foreground">
            Boxes
          </span>
          <span className="truncate text-sm text-sidebar-foreground/55">
            Control de inventario
          </span>
        </div>
        <SidebarTrigger className="shrink-0 text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground" />
      </SidebarHeader>
      <div className="px-3 pb-1 group-data-[collapsible=icon]:px-2">
        <AppSidebarSearch
          searchQuery={searchQuery}
          searchInputRef={searchInputRef}
          onSearchQueryChange={setSearchQuery}
          onSearchKeyDown={handleSearchKeyDown}
          onOpenSearch={openSearch}
        />
      </div>
      <SidebarContent className="group-data-[collapsible=icon]:overflow-visible">
        <SidebarGroup className="px-3">
          <SidebarGroupLabel className="px-1 text-sm font-normal text-sidebar-foreground/55">
            Menú principal
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  isActive={item.isActive(pathname)}
                  tooltip={item.label}
                  className={menuButtonClassName}
                  render={<NavLink to={item.to} />}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {filteredItems.length === 0 && (
            <p className="px-1 py-2 text-sm text-sidebar-foreground/55 group-data-[collapsible=icon]:hidden">
              Sin resultados para “{searchQuery.trim()}”
            </p>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="mx-4 group-data-[collapsible=icon]:mx-2" />
      <SidebarFooter className="px-3 pt-2 pb-4 group-data-[collapsible=icon]:items-center">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Cerrar sesión"
              className={cn(
                menuButtonClassName,
                "text-destructive hover:bg-destructive/10 hover:text-destructive [&_svg]:text-destructive",
              )}
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
