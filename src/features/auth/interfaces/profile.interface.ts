import type { Permission } from '@/shared/auth/permissions.ts'

export interface IGetProfileRole {
  id: number
  nombre: string
}

export interface IGetProfile {
  id: number
  nombre: string
  email: string
  rol: IGetProfileRole
  permisos: Permission[]
}
