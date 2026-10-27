import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'

export interface ICashRegister {
  id: number
  nombre: string
  activa: boolean
}

export interface IGetAllCashRegistersParams extends IPaginationParams {
  activa?: boolean
}

export type IGetAllCashRegisters = IPage<ICashRegister>
