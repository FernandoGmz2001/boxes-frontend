import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  buildRowUpdate,
  categoryToRowEdit,
  rowEditToSchemaInput,
  rowEditsMatch,
  rowFieldErrors,
  type CategoryRowFieldErrors,
  type ICategoryRowEdit,
} from '../category-row-edit.ts'
import type { IGetCategory } from '../interfaces/get.interface.ts'
import { categoryRowSchema } from '../schemas/row.schema.ts'
import { useUpdateCategory } from '../services/queries.ts'

interface CategoryRowEntry {
  baseline: ICategoryRowEdit
  draft: ICategoryRowEdit
}

export interface CategoryRowEditHandlers {
  valuesFor: (category: IGetCategory) => ICategoryRowEdit
  errorFor: (categoryId: number, field: keyof ICategoryRowEdit) => string | undefined
  setField: <K extends keyof ICategoryRowEdit>(category: IGetCategory, field: K, value: ICategoryRowEdit[K]) => void
  isSaving: boolean
}

export function useCategoryRowEdit() {
  const [entries, setEntries] = useState<Record<number, CategoryRowEntry>>({})
  const [errors, setErrors] = useState<Record<number, CategoryRowFieldErrors>>({})
  const entriesRef = useRef(entries)
  const errorsRef = useRef(errors)
  const updateCategory = useUpdateCategory()

  const setField: CategoryRowEditHandlers['setField'] = useCallback((category, field, value) => {
    setEntries((current) => {
      const entry = current[category.id] ?? {
        baseline: categoryToRowEdit(category),
        draft: categoryToRowEdit(category),
      }
      const draft = { ...entry.draft, [field]: value }
      const next = { ...current }

      if (rowEditsMatch(entry.baseline, draft)) delete next[category.id]
      else next[category.id] = { ...entry, draft }

      entriesRef.current = next
      return next
    })

    setErrors((current) => {
      const rowErrors = current[category.id]
      if (!rowErrors?.[field]) return current

      const nextRow = { ...rowErrors }
      delete nextRow[field]
      const next = { ...current, [category.id]: nextRow }
      errorsRef.current = next
      return next
    })
  }, [])

  const valuesFor = useCallback(
    (category: IGetCategory) => entriesRef.current[category.id]?.draft ?? categoryToRowEdit(category),
    [],
  )

  const errorFor = useCallback(
    (categoryId: number, field: keyof ICategoryRowEdit) => errorsRef.current[categoryId]?.[field],
    [],
  )

  const save = async () => {
    const nextErrors: Record<number, CategoryRowFieldErrors> = {}
    const ready: Array<{ categoryId: number; payload: ReturnType<typeof buildRowUpdate> }> = []

    for (const [categoryIdText, entry] of Object.entries(entries)) {
      const categoryId = Number(categoryIdText)
      const parsed = categoryRowSchema.safeParse(rowEditToSchemaInput(entry.draft))

      if (!parsed.success) {
        nextErrors[categoryId] = rowFieldErrors(parsed.error)
        continue
      }

      const payload = buildRowUpdate(entry.baseline, parsed.data)
      if (Object.keys(payload).length === 0) continue

      ready.push({ categoryId, payload })
    }

    errorsRef.current = nextErrors
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    for (const item of ready) {
      await updateCategory.mutateAsync({ categoryId: item.categoryId, payload: item.payload })

      setEntries((current) => {
        if (!current[item.categoryId]) return current
        const next = { ...current }
        delete next[item.categoryId]
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
    isSaving: updateCategory.isPending,
    save,
  }
}
