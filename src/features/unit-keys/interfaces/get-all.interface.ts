import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IGetUnitKey } from './get.interface.ts'

export interface IGetAllUnitKeysParams extends IPaginationParams {
  busqueda?: string
}

export type IGetAllUnitKeys = IPage<IGetUnitKey>
