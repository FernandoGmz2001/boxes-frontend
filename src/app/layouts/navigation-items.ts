import { HistoryIcon, PackageIcon, type LucideIcon } from "lucide-react";

export interface NavigationItem {
  label: string;
  to: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Productos",
    to: "/",
    icon: PackageIcon,
    isActive: (pathname) => pathname === "/" || pathname.startsWith("/productos"),
  },
  {
    label: "Movimientos",
    to: "/movimientos",
    icon: HistoryIcon,
    isActive: (pathname) => pathname.startsWith("/movimientos"),
  },
];
