import type { KeyboardEvent, RefObject } from "react";
import { SearchIcon } from "lucide-react";
import SearchField from "@/components/features/SearchInput/SearchField.tsx";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar.tsx";
import { getShortcutModifierLabel } from "@/shared/helpers/keyboard-shortcuts.ts";

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
    <>
      <SearchField
        ref={searchInputRef}
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        onKeyDown={onSearchKeyDown}
        aria-label="Buscar en el menú"
        shortcutKeys={[commandKLabel, "/"]}
        className="bg-sidebar-accent group-data-[collapsible=icon]:hidden dark:bg-sidebar-accent dark:has-[[data-slot=input-group-control]:focus-visible]:bg-sidebar-accent"
      />
      <SidebarMenu className="hidden items-center group-data-[collapsible=icon]:flex">
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={`Buscar (${commandKLabel})`}
            className="rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={onOpenSearch}
          >
            <SearchIcon />
            <span>Buscar</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
