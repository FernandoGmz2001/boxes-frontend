import type { CashMovementType } from './get.interface.ts'

export interface ICreateCashMovement {
  tipo: CashMovementType
  monto: number
  motivo: string
}
