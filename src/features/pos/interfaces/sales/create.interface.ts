import type { PaymentMethod } from './get.interface.ts'

export interface ICreateSaleLine {
  producto_id: number
  cantidad: number
}

export interface ICreateSale {
  metodo_pago: PaymentMethod
  cliente_id?: number
  carrito: ICreateSaleLine[]
}
