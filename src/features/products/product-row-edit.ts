import type { z } from 'zod'
import type { IGetProduct } from './interfaces/get.interface.ts'
import type { IUpdateProduct } from './interfaces/update.interface.ts'
import type { ProductRowSchema } from './schemas/row.schema.ts'

export interface IProductRowEdit {
  nombre_producto: string
  sku: string
  id_categoria: number
  cantidad_en_existencia: string
  stock_minimo: string
  costo_compra: string
  precio_venta: string
  activo: boolean
}

export type ProductRowFieldErrors = Partial<Record<keyof IProductRowEdit, string>>

export function productToRowEdit(product: IGetProduct): IProductRowEdit {
  return {
    nombre_producto: product.nombre_producto,
    sku: product.sku ?? '',
    id_categoria: product.id_categoria,
    cantidad_en_existencia: String(product.cantidad_en_existencia),
    stock_minimo: String(product.stock_minimo),
    costo_compra: product.costo_compra,
    precio_venta: product.precio_venta,
    activo: product.activo,
  }
}

function sameText(left: string, right: string) {
  return left.trim() === right.trim()
}

function sameNumber(left: string, right: string) {
  if (left.trim() === '' || right.trim() === '') return left.trim() === right.trim()
  return Number(left) === Number(right)
}

function sameMoney(left: string, right: string) {
  if (left.trim() === '' || right.trim() === '') return left.trim() === right.trim()

  const leftAmount = Number(left)
  const rightAmount = Number(right)
  if (!Number.isFinite(leftAmount) || !Number.isFinite(rightAmount)) return left.trim() === right.trim()

  return Math.abs(leftAmount - rightAmount) < 0.001
}

export function rowEditsMatch(left: IProductRowEdit, right: IProductRowEdit) {
  return (
    sameText(left.nombre_producto, right.nombre_producto) &&
    sameText(left.sku, right.sku) &&
    left.id_categoria === right.id_categoria &&
    sameNumber(left.cantidad_en_existencia, right.cantidad_en_existencia) &&
    sameNumber(left.stock_minimo, right.stock_minimo) &&
    sameMoney(left.costo_compra, right.costo_compra) &&
    sameMoney(left.precio_venta, right.precio_venta) &&
    left.activo === right.activo
  )
}

export function rowEditToSchemaInput(draft: IProductRowEdit) {
  return {
    nombre_producto: draft.nombre_producto,
    sku: draft.sku,
    id_categoria: draft.id_categoria,
    cantidad_en_existencia:
      draft.cantidad_en_existencia.trim() === '' ? Number.NaN : Number(draft.cantidad_en_existencia),
    stock_minimo: draft.stock_minimo.trim() === '' ? Number.NaN : Number(draft.stock_minimo),
    costo_compra: draft.costo_compra.trim() === '' ? Number.NaN : Number(draft.costo_compra),
    precio_venta: draft.precio_venta.trim() === '' ? Number.NaN : Number(draft.precio_venta),
    activo: draft.activo,
  }
}

export function rowFieldErrors(error: z.ZodError): ProductRowFieldErrors {
  const errors: ProductRowFieldErrors = {}

  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field !== 'string' || field in errors) continue
    errors[field as keyof IProductRowEdit] = issue.message
  }

  return errors
}

export function buildRowUpdate(baseline: IProductRowEdit, next: ProductRowSchema): IUpdateProduct {
  const payload: IUpdateProduct = {}

  if (next.nombre_producto !== baseline.nombre_producto.trim()) payload.nombre_producto = next.nombre_producto

  const baselineSku = baseline.sku.trim()
  if (next.sku !== baselineSku) payload.sku = next.sku.length > 0 ? next.sku : null

  if (next.id_categoria !== baseline.id_categoria) payload.id_categoria = next.id_categoria
  if (next.stock_minimo !== Number(baseline.stock_minimo)) payload.stock_minimo = next.stock_minimo

  const baselineCost = Number(baseline.costo_compra)
  if (!Number.isFinite(baselineCost) || Math.abs(next.costo_compra - baselineCost) >= 0.001) {
    payload.costo_compra = next.costo_compra
  }

  const baselinePrice = Number(baseline.precio_venta)
  if (!Number.isFinite(baselinePrice) || Math.abs(next.precio_venta - baselinePrice) >= 0.001) {
    payload.precio_venta = next.precio_venta
  }

  if (next.activo !== baseline.activo) payload.activo = next.activo

  return payload
}

export function stockAdjustment(baseline: IProductRowEdit, next: ProductRowSchema) {
  const previous = Number(baseline.cantidad_en_existencia)
  if (next.cantidad_en_existencia === previous) return null

  return next.cantidad_en_existencia - previous
}
