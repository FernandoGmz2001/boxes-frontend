import type { ICorteTurno } from './corte.interface.ts'
import type { ITurno } from './get.interface.ts'

export interface ICloseShift {
  efectivo_contado: number
  notas?: string
}

export interface ICierreTurno {
  turno: ITurno
  corte: ICorteTurno
}
