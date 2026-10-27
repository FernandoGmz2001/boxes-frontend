export type ShiftStatus = 'Abierto' | 'Cerrado'

export const CASH_MOVEMENT_TYPES = ['Entrada', 'Retiro'] as const

export type CashMovementType = (typeof CASH_MOVEMENT_TYPES)[number]

export interface ITurno {
  id: number
  caja_id: number
  usuario_id: number
  estado: ShiftStatus
  fondo_inicial: string
  efectivo_esperado: string | null
  efectivo_contado: string | null
  diferencia: string | null
  notas: string | null
  abierto_at: string
  cerrado_at: string | null
}

export interface IMovimientoCaja {
  id: number
  turno_id: number
  usuario_id: number
  tipo: CashMovementType
  monto: string
  motivo: string
  created_at: string
}

export interface ITurnoDetalle extends ITurno {
  caja: {
    id: number
    nombre: string
  }
  usuario: {
    id: number
    nombre: string
  }
  movimientos: IMovimientoCaja[]
}
