import { z } from 'zod'
import { productSchema } from './upsert.schema.ts'

export const productRowSchema = productSchema.pick({
  nombre_producto: true,
  sku: true,
  id_categoria: true,
  cantidad_en_existencia: true,
  stock_minimo: true,
  costo_compra: true,
  precio_venta: true,
  activo: true,
})

export type ProductRowSchema = z.infer<typeof productRowSchema>
