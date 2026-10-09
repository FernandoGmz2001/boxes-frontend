import { useEffect, useEffectEvent, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { cn } from "cn";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Kbd, KbdGroup } from "@/components/ui/kbd.tsx";

const DEFAULT_DELAY = 300;

interface SearchInputProps {
  onDebouncedChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
  label?: string;
  className?: string;
}

function shortcutModifier() {
  if (typeof navigator === "undefined") return "Ctrl";
  return /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl";
}

function isSearchShortcut(event: KeyboardEvent) {
  return (
    event.code === "KeyK" &&
    !event.repeat &&
    !event.altKey &&
    !event.shiftKey &&
    (event.ctrlKey || event.metaKey) &&
    !(event.ctrlKey && event.metaKey)
  );
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
      if (event.defaultPrevented || !isSearchShortcut(event)) return;

      event.preventDefault();
      focusSearch();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <InputGroup className={cn("h-10 w-full max-w-sm", className)}>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        ref={searchInputRef}
        value={query}
        placeholder={placeholder}
        aria-label={label}
        onChange={(event) => setQuery(event.target.value)}
      />
      <InputGroupAddon align="inline-end">
        <KbdGroup>
          <Kbd>{shortcutModifier()}</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  );
}
