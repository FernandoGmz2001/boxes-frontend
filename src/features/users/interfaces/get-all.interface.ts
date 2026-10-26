import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IGetUser } from './get.interface.ts'

export interface IGetAllUsersParams extends IPaginationParams {
  busqueda?: string
  activo?: boolean
}

export type IGetAllUsers = IPage<IGetUser>
