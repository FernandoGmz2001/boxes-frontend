export const PAYMENT_METHODS = ['Efectivo', 'Tarjeta', 'Transferencia'] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export interface IVentaDetalle {
  id: number
  producto_id: number
  cantidad: number
  precio_unitario: string
  subtotal: string
}

export interface IVenta {
  id: number
  folio: string
  usuario_id: number
  turno_id: number
  cliente_id: number | null
  metodo_pago: PaymentMethod
  total: string
  created_at: string
  detalles: IVentaDetalle[]
}

export interface IVentaDetalleProducto extends IVentaDetalle {
  nombre_producto: string
}

export interface IVentaCompleta extends Omit<IVenta, 'detalles'> {
  usuario: {
    id: number
    nombre: string
  }
  detalles: IVentaDetalleProducto[]
}
