import { useState } from 'react'
import type { IGetProduct } from '@/features/products/interfaces/get.interface.ts'
import { toCents } from '../pos-money.ts'

export const CART_MAX_LINES = 100

export type CartProduct = Pick<
  IGetProduct,
  'id' | 'nombre_producto' | 'imagen_url' | 'precio_venta' | 'cantidad_en_existencia' | 'es_servicio' | 'sku' | 'codigo_barras'
>

export interface CartLine {
  product: CartProduct
  cantidad: number
}

export type CartAddResult = 'added' | 'out-of-stock' | 'max-quantity' | 'line-limit'

export function maxQuantityFor(product: CartProduct) {
  return product.es_servicio ? Number.POSITIVE_INFINITY : Math.max(product.cantidad_en_existencia, 0)
}

export function clampQuantity(product: CartProduct, cantidad: number) {
  if (!Number.isFinite(cantidad)) return 1
  return Math.min(Math.max(Math.trunc(cantidad), 1), maxQuantityFor(product))
}

function checkAdd(lines: CartLine[], product: CartProduct): CartAddResult {
  const maxQuantity = maxQuantityFor(product)
  if (maxQuantity < 1) return 'out-of-stock'

  const existingLine = lines.find((line) => line.product.id === product.id)
  if (!existingLine) return lines.length >= CART_MAX_LINES ? 'line-limit' : 'added'

  return existingLine.cantidad >= maxQuantity ? 'max-quantity' : 'added'
}

function addLine(lines: CartLine[], product: CartProduct): CartLine[] {
  const existingLine = lines.find((line) => line.product.id === product.id)
  if (!existingLine) return [...lines, { product, cantidad: 1 }]

  return lines.map((line) =>
    line.product.id === product.id
      ? { product, cantidad: clampQuantity(product, line.cantidad + 1) }
      : line,
  )
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([])
  const totalCents = lines.reduce((total, line) => total + toCents(line.product.precio_venta) * line.cantidad, 0)
  const itemCount = lines.reduce((total, line) => total + line.cantidad, 0)

  const addProduct = (product: CartProduct): CartAddResult => {
    const result = checkAdd(lines, product)
    if (result === 'added') setLines((current) => addLine(current, product))
    return result
  }

  const setQuantity = (productId: number, cantidad: number) => {
    setLines((current) =>
      current.map((line) =>
        line.product.id === productId ? { ...line, cantidad: clampQuantity(line.product, cantidad) } : line,
      ),
    )
  }

  const removeProduct = (productId: number) => {
    setLines((current) => current.filter((line) => line.product.id !== productId))
  }

  const clear = () => {
    setLines([])
  }

  return { lines, totalCents, itemCount, addProduct, setQuantity, removeProduct, clear }
}
