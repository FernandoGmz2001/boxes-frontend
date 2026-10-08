export const MOVEMENT_TYPES = ['Entrada', 'Salida', 'Ajuste'] as const

export type MovementType = (typeof MOVEMENT_TYPES)[number]

export interface IGetMovement {
  id: number
  producto_id: number
  tipo_movimiento: MovementType
  cantidad: number
  stock_previo: number
  stock_nuevo: number
  motivo: string | null
  usuario_id: number
  created_at: string
}
