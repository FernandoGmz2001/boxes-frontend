import type { ComponentProps } from "react";
import { SearchIcon } from "lucide-react";
import { cn } from "cn";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Kbd } from "@/components/ui/kbd.tsx";

interface SearchFieldProps extends Omit<ComponentProps<"input">, "type"> {
  shortcutKeys?: string[];
  inputClassName?: string;
}

export default function SearchField({
  shortcutKeys = [],
  className,
  inputClassName,
  placeholder = "Buscar",
  ...inputProps
}: SearchFieldProps) {
  return (
    <InputGroup
      className={cn(
        "h-11 rounded-xl border-transparent bg-muted transition-colors dark:bg-muted",
        "has-[[data-slot=input-group-control]:focus-visible]:border-border has-[[data-slot=input-group-control]:focus-visible]:bg-background has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30",
        "dark:has-[[data-slot=input-group-control]:focus-visible]:bg-muted",
        className,
      )}
    >
      <InputGroupAddon className="pl-3 text-foreground/70">
        <SearchIcon className="size-[1.125rem]" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        placeholder={placeholder}
        className={cn(
          "text-[0.9375rem] text-foreground placeholder:text-foreground/50 [&::-webkit-search-cancel-button]:hidden",
          inputClassName,
        )}
        {...inputProps}
      />
      {shortcutKeys.length > 0 && (
        <InputGroupAddon align="inline-end" className="gap-1 pr-2">
          {shortcutKeys.map((shortcutKey) => (
            <Kbd
              key={shortcutKey}
              className="h-6 min-w-6 rounded-md border border-border bg-background px-1.5 text-xs text-muted-foreground shadow-xs dark:bg-card"
            >
              {shortcutKey}
            </Kbd>
          ))}
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
