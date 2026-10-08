import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IGetTax } from './get.interface.ts'

export type IGetAllTaxesParams = IPaginationParams

export type IGetAllTaxes = IPage<IGetTax>
