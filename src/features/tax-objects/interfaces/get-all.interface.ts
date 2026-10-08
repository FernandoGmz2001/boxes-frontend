import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IGetTaxObject } from './get.interface.ts'

export interface IGetAllTaxObjectsParams extends IPaginationParams {
  busqueda?: string
}

export type IGetAllTaxObjects = IPage<IGetTaxObject>
