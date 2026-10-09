import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useCreateMovement } from '@/features/movements/services/queries.ts'
import type { IGetProduct } from '../interfaces/get.interface.ts'
import {
  buildRowUpdate,
  productToRowEdit,
  stockAdjustment,
  rowEditToSchemaInput,
  rowEditsMatch,
  rowFieldErrors,
  type IProductRowEdit,
  type ProductRowFieldErrors,
} from '../product-row-edit.ts'
import { productRowSchema } from '../schemas/row.schema.ts'
import { useUpdateProduct } from '../services/queries.ts'

interface ProductRowEntry {
  baseline: IProductRowEdit
  draft: IProductRowEdit
}

export interface ProductRowEditHandlers {
  valuesFor: (product: IGetProduct) => IProductRowEdit
  errorFor: (productId: number, field: keyof IProductRowEdit) => string | undefined
  setField: <K extends keyof IProductRowEdit>(product: IGetProduct, field: K, value: IProductRowEdit[K]) => void
  isSaving: boolean
}

export function useProductRowEdit() {
  const [entries, setEntries] = useState<Record<number, ProductRowEntry>>({})
  const [errors, setErrors] = useState<Record<number, ProductRowFieldErrors>>({})
  const entriesRef = useRef(entries)
  const errorsRef = useRef(errors)
  const updateProduct = useUpdateProduct()
  const createMovement = useCreateMovement()

  const setField: ProductRowEditHandlers['setField'] = useCallback((product, field, value) => {
    setEntries((current) => {
      const entry = current[product.id] ?? {
        baseline: productToRowEdit(product),
        draft: productToRowEdit(product),
      }
      const draft = { ...entry.draft, [field]: value }
      const next = { ...current }

      if (rowEditsMatch(entry.baseline, draft)) delete next[product.id]
      else next[product.id] = { ...entry, draft }

      entriesRef.current = next
      return next
    })

    setErrors((current) => {
      const rowErrors = current[product.id]
      if (!rowErrors?.[field]) return current

      const nextRow = { ...rowErrors }
      delete nextRow[field]
      const next = { ...current, [product.id]: nextRow }
      errorsRef.current = next
      return next
    })
  }, [])

  const valuesFor = useCallback(
    (product: IGetProduct) => entriesRef.current[product.id]?.draft ?? productToRowEdit(product),
    [],
  )

  const errorFor = useCallback(
    (productId: number, field: keyof IProductRowEdit) => errorsRef.current[productId]?.[field],
    [],
  )

  const save = async () => {
    const nextErrors: Record<number, ProductRowFieldErrors> = {}
    const ready: Array<{
      productId: number
      payload: ReturnType<typeof buildRowUpdate>
      stockDelta: number | null
    }> = []

    for (const [productIdText, entry] of Object.entries(entries)) {
      const productId = Number(productIdText)
      const parsed = productRowSchema.safeParse(rowEditToSchemaInput(entry.draft))

      if (!parsed.success) {
        nextErrors[productId] = rowFieldErrors(parsed.error)
        continue
      }

      const payload = buildRowUpdate(entry.baseline, parsed.data)
      const stockDelta = stockAdjustment(entry.baseline, parsed.data)
      if (Object.keys(payload).length === 0 && stockDelta === null) continue

      ready.push({ productId, payload, stockDelta })
    }

    errorsRef.current = nextErrors
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    for (const item of ready) {
      if (Object.keys(item.payload).length > 0) {
        await updateProduct.mutateAsync({ productId: item.productId, payload: item.payload })
      }

      if (item.stockDelta !== null) {
        await createMovement.mutateAsync({
          producto_id: item.productId,
          tipo_movimiento: 'Ajuste',
          cantidad: item.stockDelta,
          motivo: 'Ajuste de existencia',
        })
      }

      setEntries((current) => {
        if (!current[item.productId]) return current
        const next = { ...current }
        delete next[item.productId]
        entriesRef.current = next
        return next
      })
    }

    if (ready.length > 0) toast.success('Cambios guardados')
  }

  return {
    valuesFor,
    errorFor,
    setField,
    dirtyCount: Object.keys(entries).length,
    isSaving: updateProduct.isPending || createMovement.isPending,
    save,
  }
}
