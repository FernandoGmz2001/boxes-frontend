import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IGetProductTax } from './get.interface.ts'

export type IGetAllProductTaxesParams = IPaginationParams

export type IGetAllProductTaxes = IPage<IGetProductTax>
