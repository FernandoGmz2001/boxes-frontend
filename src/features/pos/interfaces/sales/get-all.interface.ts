import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IVenta } from './get.interface.ts'

export interface IVentaResumen extends Omit<IVenta, 'detalles'> {
  articulos: number
}

export interface IGetAllSalesParams extends IPaginationParams {
  turno_id?: number
  folio?: string
  fecha_desde?: string
  fecha_hasta?: string
}

export type IGetAllSales = IPage<IVentaResumen>
