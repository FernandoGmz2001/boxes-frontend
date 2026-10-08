import { z } from 'zod'
import { booleanField, idField, stringField } from '@/shared/helpers/zod-helpers.ts'

const MAX_MONEY = 99_999_999.99

function moneyField(message: string) {
  return z
    .number(message)
    .min(0, 'El monto no puede ser negativo')
    .max(MAX_MONEY, 'El monto es demasiado alto')
    .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8, 'Usa como máximo dos decimales')
}

function stockField(message: string) {
  return z.number(message).int('Ingresa un número entero').min(0, 'No puede ser negativo')
}

export const productSchema = z.object({
  nombre_producto: stringField('El nombre es obligatorio'),
  imagen_url: z.union([z.literal(''), z.url('Ingresa una URL válida')]),
  cantidad_en_existencia: stockField('Ingresa la existencia'),
  stock_minimo: stockField('Ingresa el stock mínimo'),
  sku: z.string().trim(),
  codigo_barras: z.string().trim(),
  precio_venta: moneyField('Ingresa el precio de venta'),
  costo_compra: moneyField('Ingresa el costo de compra'),
  es_servicio: booleanField(),
  activo: booleanField(),
  id_categoria: idField('Selecciona una categoría'),
  clave_producto_servicio: z.string().trim(),
  clave_unidad_medida: z.string().trim(),
  objeto_impuesto: z.string().trim(),
  impuesto_preset_ids: z.array(z.number().int().positive()),
})

export type ProductSchema = z.infer<typeof productSchema>
