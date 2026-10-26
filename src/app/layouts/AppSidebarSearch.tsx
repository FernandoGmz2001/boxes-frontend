import type { KeyboardEvent, RefObject } from "react";
import { SearchIcon } from "lucide-react";
import SearchField from "@/components/features/SearchInput/SearchField.tsx";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar.tsx";
import { getShortcutModifierLabel } from "@/shared/helpers/keyboard-shortcuts.ts";
import { SIDEBAR_MENU_BUTTON_CLASS_NAME } from "./sidebar.constants.ts";

interface AppSidebarSearchProps {
  searchQuery: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  onSearchQueryChange: (query: string) => void;
  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onOpenSearch: () => void;
}

export default function AppSidebarSearch({
  searchQuery,
  searchInputRef,
  onSearchQueryChange,
  onSearchKeyDown,
  onOpenSearch,
}: AppSidebarSearchProps) {
  const commandKLabel = `${getShortcutModifierLabel()}K`;

  return (
    <div className="relative">
      <SearchField
        ref={searchInputRef}
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        onKeyDown={onSearchKeyDown}
        aria-label="Buscar en el menú"
        shortcutKeys={[commandKLabel, "/"]}
        className="h-10 bg-sidebar-accent transition-[opacity,visibility,background-color,border-color,box-shadow] duration-200 ease-out group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0 dark:bg-sidebar-accent dark:has-[[data-slot=input-group-control]:focus-visible]:bg-sidebar-accent [&>[data-align=inline-start]]:pl-[7px] [&>[data-align=inline-start]_svg]:size-5 [&>[data-align=inline-start]_svg]:text-sidebar-foreground/60"
      />
      <SidebarMenu className="invisible absolute inset-0 opacity-0 transition-[opacity,visibility] duration-200 ease-out group-data-[collapsible=icon]:visible group-data-[collapsible=icon]:opacity-100">
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={`Buscar (${commandKLabel})`}
            className={SIDEBAR_MENU_BUTTON_CLASS_NAME}
            onClick={onOpenSearch}
          >
            <SearchIcon />
            <span>Buscar</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
