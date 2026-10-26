import type { CSSProperties } from "react";
import { cn } from "cn";
import { BoxesIcon, LogOutIcon, PanelLeftCloseIcon, PinIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useGetProfile } from "@/features/auth/services/queries.ts";
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
  useSidebar,
} from "@/components/ui/sidebar.tsx";
import { useAuth } from "@/shared/auth/useAuth.ts";
import AppSidebarSearch from "./AppSidebarSearch.tsx";
import { useSidebarSearch } from "./hooks/useSidebarSearch.ts";
import { NAVIGATION_SECTIONS } from "./navigation-items.ts";
import { SIDEBAR_MENU_BUTTON_CLASS_NAME, SIDEBAR_REVEAL_CLASS_NAME } from "./sidebar.constants.ts";

export default function AppSidebar() {
  const { session, endSession } = useAuth();
  const profileQuery = useGetProfile(session?.userId ?? 0);
  const { pathname } = useLocation();
  const { state, isMobile, toggleSidebar } = useSidebar();
  const { searchQuery, setSearchQuery, searchInputRef, filteredItems, openSearch, handleSearchKeyDown } =
    useSidebarSearch();
  const isCollapsed = state === "collapsed" && !isMobile;
  const toggleLabel = isCollapsed ? "Fijar menú" : "Colapsar menú";

  return (
    <Sidebar collapsible="icon" className="overflow-hidden border-sidebar-border">
      <SidebarHeader className="h-16 flex-row items-center gap-3 px-2 py-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm transition-transform duration-300 ease-out hover:-rotate-6">
          <BoxesIcon className="size-5" />
        </div>
        <div className={cn("flex min-w-0 flex-1 flex-col", SIDEBAR_REVEAL_CLASS_NAME)}>
          {profileQuery.data ? (
            <>
              <span className="truncate text-base font-semibold tracking-tight text-sidebar-foreground">
                {profileQuery.data.nombre}
              </span>
              <span className="truncate text-sm text-sidebar-foreground/55">
                {profileQuery.data.email}
              </span>
            </>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-28 bg-sidebar-accent" />
              <Skeleton className="h-3.5 w-36 bg-sidebar-accent" />
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={toggleLabel}
          title={toggleLabel}
          onClick={toggleSidebar}
          className="shrink-0 text-sidebar-foreground/55 transition-[opacity,transform,visibility,background-color,color] duration-200 ease-out hover:bg-sidebar-accent hover:text-sidebar-foreground active:scale-90 group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:scale-75 group-data-[collapsible=icon]:opacity-0 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:-rotate-12"
        >
          {isCollapsed ? (
            <PinIcon key="pin" className="animate-in duration-200 fade-in zoom-in-50 spin-in-45" />
          ) : (
            <PanelLeftCloseIcon key="collapse" className="animate-in duration-200 fade-in zoom-in-75" />
          )}
        </Button>
      </SidebarHeader>
      <div className="px-2">
        <AppSidebarSearch
          searchQuery={searchQuery}
          searchInputRef={searchInputRef}
          onSearchQueryChange={setSearchQuery}
          onSearchKeyDown={handleSearchKeyDown}
          onOpenSearch={openSearch}
        />
      </div>
      <SidebarContent>
        {NAVIGATION_SECTIONS.map((section) => {
          const sectionItems = filteredItems.filter((item) => item.section === section.id);
          if (sectionItems.length === 0) return null;

          return (
            <SidebarGroup key={section.id} className="px-2 py-1">
              <SidebarGroupLabel className="relative h-7 px-2 text-sm font-normal text-sidebar-foreground/55 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:opacity-100">
                <span className={cn("whitespace-nowrap", SIDEBAR_REVEAL_CLASS_NAME)}>{section.label}</span>
                <SidebarSeparator className="absolute inset-x-2 top-1/2 mx-0 opacity-0 transition-opacity duration-200 group-data-[collapsible=icon]:opacity-100" />
              </SidebarGroupLabel>
              <SidebarMenu className="gap-1.5">
                {sectionItems.map((item) => (
                  <SidebarMenuItem
                    key={item.to}
                    className="animate-in duration-200 fade-in slide-in-from-left-1"
                  >
                    <SidebarMenuButton
                      isActive={item.isActive(pathname)}
                      tooltip={item.label}
                      style={{ "--item-index": filteredItems.indexOf(item) + 1 } as CSSProperties}
                      className={SIDEBAR_MENU_BUTTON_CLASS_NAME}
                      render={<NavLink to={item.to} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          );
        })}
        {filteredItems.length === 0 && searchQuery.trim() ? (
          <p className="px-4 py-2 text-sm text-sidebar-foreground/55 group-data-[collapsible=icon]:hidden">
            Sin resultados para “{searchQuery.trim()}”
          </p>
        ) : null}
      </SidebarContent>
      <SidebarSeparator className="mx-2" />
      <SidebarFooter className="px-2 pt-1 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Cerrar sesión"
              className={cn(
                SIDEBAR_MENU_BUTTON_CLASS_NAME,
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
