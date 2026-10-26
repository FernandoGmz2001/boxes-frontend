import { useEffect, useEffectEvent, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { usePermissions } from "@/features/auth/hooks/usePermissions.ts";
import { isCommandKShortcut, isEditableElement } from "@/shared/helpers/keyboard-shortcuts.ts";
import { NAVIGATION_ITEMS } from "../navigation-items.ts";

function normalizeSearchText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function useSidebarSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const { can } = usePermissions();

  const allowedItems = NAVIGATION_ITEMS.filter((item) => can(item.permission));
  const normalizedQuery = normalizeSearchText(searchQuery);
  const filteredItems = normalizedQuery
    ? allowedItems.filter((item) => normalizeSearchText(item.label).includes(normalizedQuery))
    : allowedItems;

  const openSearch = () => {
    if (isMobile) setOpenMobile(true);
    else setOpen(true);
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && filteredItems[0]) {
      navigate(filteredItems[0].to);
      setSearchQuery("");
      event.currentTarget.blur();
    }
    if (event.key === "Escape") {
      setSearchQuery("");
      event.currentTarget.blur();
    }
  };

  const openSearchFromShortcut = useEffectEvent(() => {
    openSearch();
  });

  useEffect(() => {
    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const isSlash = event.key === "/" && !isEditableElement(event.target);
      if (!isCommandKShortcut(event) && !isSlash) return;

      event.preventDefault();
      openSearchFromShortcut();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return { searchQuery, setSearchQuery, searchInputRef, filteredItems, openSearch, handleSearchKeyDown };
}
