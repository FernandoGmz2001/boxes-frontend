import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

interface DataTableColumnHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export default function DataTableColumnHeader({
  icon: Icon,
  title,
  className,
}: DataTableColumnHeaderProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {title}
    </span>
  );
}
