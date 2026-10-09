import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IGetProduct } from './get.interface.ts'

export interface IGetAllProductsParams extends IPaginationParams {
  activo?: boolean
  busqueda?: string
}

export type IGetAllProducts = IPage<IGetProduct>
