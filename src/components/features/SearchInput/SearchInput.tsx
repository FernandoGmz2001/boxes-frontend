import { useEffect, useEffectEvent, useRef, useState } from "react";
import { cn } from "cn";
import { getShortcutModifierLabel, isCommandKShortcut } from "@/shared/helpers/keyboard-shortcuts.ts";
import SearchField from "./SearchField.tsx";

const DEFAULT_DELAY = 300;

interface SearchInputProps {
  onDebouncedChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function SearchInput({
  onDebouncedChange,
  delay = DEFAULT_DELAY,
  placeholder = "Buscar...",
  label = "Buscar",
  className,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const skipInitialPublish = useRef(true);

  const publishQuery = useEffectEvent((value: string) => {
    onDebouncedChange(value);
  });

  const focusSearch = useEffectEvent(() => {
    searchInputRef.current?.focus();
  });

  useEffect(() => {
    if (skipInitialPublish.current) {
      skipInitialPublish.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      publishQuery(query.trim());
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [query, delay]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !isCommandKShortcut(event)) return;

      event.preventDefault();
      focusSearch();
    };

    // Fase de captura: el buscador de la página tiene prioridad sobre el del sidebar en ⌘K.
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);

  return (
    <SearchField
      ref={searchInputRef}
      value={query}
      placeholder={placeholder}
      aria-label={label}
      shortcutKeys={[`${getShortcutModifierLabel()}K`]}
      className={cn("w-full max-w-sm", className)}
      onChange={(event) => setQuery(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setQuery("");
      }}
    />
  );
}
