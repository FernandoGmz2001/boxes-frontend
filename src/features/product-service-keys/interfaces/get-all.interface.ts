import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IGetProductServiceKey } from './get.interface.ts'

export interface IGetAllProductServiceKeysParams extends IPaginationParams {
  busqueda?: string
}

export type IGetAllProductServiceKeys = IPage<IGetProductServiceKey>
