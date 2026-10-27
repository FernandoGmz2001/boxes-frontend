import {
  HistoryIcon,
  PackageIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from 'lucide-react'

export const PERMISSIONS = ['productos', 'movimientos', 'ventas', 'cajas', 'usuarios', 'roles'] as const

export type Permission = (typeof PERMISSIONS)[number]

interface AppModule {
  label: string
  description: string
  icon: LucideIcon
}

export const APP_MODULES: Record<Permission, AppModule> = {
  productos: {
    label: 'Productos',
    description: 'Inventario, categorías e importación de productos.',
    icon: PackageIcon,
  },
  movimientos: {
    label: 'Movimientos',
    description: 'Entradas, salidas y ajustes de inventario.',
    icon: HistoryIcon,
  },
  ventas: {
    label: 'Punto de venta',
    description: 'Abrir turno, cobrar ventas y hacer el corte de caja.',
    icon: ShoppingCartIcon,
  },
  cajas: {
    label: 'Cajas',
    description: 'Supervisión de cajas, turnos y ventas de todos los usuarios.',
    icon: WalletIcon,
  },
  usuarios: {
    label: 'Usuarios',
    description: 'Alta, edición y baja de usuarios.',
    icon: UsersIcon,
  },
  roles: {
    label: 'Roles y permisos',
    description: 'Roles y los módulos a los que pueden entrar.',
    icon: ShieldCheckIcon,
  },
}

export function isPermission(value: unknown): value is Permission {
  return PERMISSIONS.some((permission) => permission === value)
}
