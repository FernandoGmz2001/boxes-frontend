import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IGetRole } from './get.interface.ts'

export interface IGetAllRolesParams extends IPaginationParams {
  busqueda?: string
}

export type IGetAllRoles = IPage<IGetRole>
