import type { PaymentMethod } from '../sales/get.interface.ts'

export interface ICorteVentas {
  metodo_pago: PaymentMethod
  cantidad: number
  importe: string
}

export interface ICorteTurno {
  turno_id: number
  fondo_inicial: string
  ventas: ICorteVentas[]
  total_ventas: string
  entradas: string
  retiros: string
  efectivo_esperado: string
}
