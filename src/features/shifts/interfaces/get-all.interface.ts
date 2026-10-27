import type { ITurno, ShiftStatus } from '@/features/pos/interfaces/shifts/get.interface.ts'
import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'

export interface ITurnoResumen extends ITurno {
  usuario: {
    id: number
    nombre: string
  }
  caja: {
    id: number
    nombre: string
  }
}

export interface IGetAllShiftsParams extends IPaginationParams {
  caja_id?: number
  usuario_id?: number
  estado?: ShiftStatus
  fecha_desde?: string
  fecha_hasta?: string
}

export type IGetAllShifts = IPage<ITurnoResumen>
