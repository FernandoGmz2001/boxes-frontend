import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IGetMovement } from './get.interface.ts'

export interface IGetAllMovementsParams extends IPaginationParams {
  producto_id?: number
  usuario_id?: number
}

export type IGetAllMovements = IPage<IGetMovement>
