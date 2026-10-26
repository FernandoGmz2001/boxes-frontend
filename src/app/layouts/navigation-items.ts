import type { LucideIcon } from "lucide-react";
import { APP_MODULES, type Permission } from "@/shared/auth/permissions.ts";

export type NavigationSection = "main" | "admin";

export interface NavigationItem {
  label: string;
  to: string;
  icon: LucideIcon;
  permission: Permission;
  section: NavigationSection;
  isActive: (pathname: string) => boolean;
}

export const NAVIGATION_SECTIONS: { id: NavigationSection; label: string }[] = [
  { id: "main", label: "Menú principal" },
  { id: "admin", label: "Administración" },
];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: APP_MODULES.productos.label,
    to: "/",
    icon: APP_MODULES.productos.icon,
    permission: "productos",
    section: "main",
    isActive: (pathname) => pathname === "/" || pathname.startsWith("/productos"),
  },
  {
    label: APP_MODULES.movimientos.label,
    to: "/movimientos",
    icon: APP_MODULES.movimientos.icon,
    permission: "movimientos",
    section: "main",
    isActive: (pathname) => pathname.startsWith("/movimientos"),
  },
  {
    label: APP_MODULES.usuarios.label,
    to: "/usuarios",
    icon: APP_MODULES.usuarios.icon,
    permission: "usuarios",
    section: "admin",
    isActive: (pathname) => pathname.startsWith("/usuarios"),
  },
  {
    label: APP_MODULES.roles.label,
    to: "/roles",
    icon: APP_MODULES.roles.icon,
    permission: "roles",
    section: "admin",
    isActive: (pathname) => pathname.startsWith("/roles"),
  },
];
