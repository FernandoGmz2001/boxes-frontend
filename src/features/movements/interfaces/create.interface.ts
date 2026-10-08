import type { MovementType } from './get.interface.ts'

export interface ICreateMovement {
  producto_id: number
  tipo_movimiento: MovementType
  cantidad: number
  motivo?: string
}
