import type { Permission } from '@/shared/auth/permissions.ts'

export interface IUpdateRole {
  nombre?: string
  descripcion?: string | null
  permisos?: Permission[]
}
