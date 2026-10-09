import type { z } from 'zod'
import type { IGetCategory } from './interfaces/get.interface.ts'
import type { IUpdateCategory } from './interfaces/update.interface.ts'
import type { CategoryRowSchema } from './schemas/row.schema.ts'

export interface ICategoryRowEdit {
  nombre: string
  color_ui: string
}

export type CategoryRowFieldErrors = Partial<Record<keyof ICategoryRowEdit, string>>

export function categoryToRowEdit(category: IGetCategory): ICategoryRowEdit {
  return {
    nombre: category.nombre,
    color_ui: category.color_ui ?? '',
  }
}

function sameText(left: string, right: string) {
  return left.trim() === right.trim()
}

function sameColor(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase()
}

export function rowEditsMatch(left: ICategoryRowEdit, right: ICategoryRowEdit) {
  return sameText(left.nombre, right.nombre) && sameColor(left.color_ui, right.color_ui)
}

export function rowEditToSchemaInput(draft: ICategoryRowEdit) {
  return {
    nombre: draft.nombre,
    color_ui: draft.color_ui,
  }
}

export function rowFieldErrors(error: z.ZodError): CategoryRowFieldErrors {
  const errors: CategoryRowFieldErrors = {}

  for (const issue of error.issues) {
    const field = issue.path[0]
    if (typeof field !== 'string' || field in errors) continue
    errors[field as keyof ICategoryRowEdit] = issue.message
  }

  return errors
}

export function buildRowUpdate(baseline: ICategoryRowEdit, next: CategoryRowSchema): IUpdateCategory {
  const payload: IUpdateCategory = {}

  if (next.nombre !== baseline.nombre.trim()) payload.nombre = next.nombre

  if (next.color_ui.toLowerCase() !== baseline.color_ui.trim().toLowerCase()) {
    payload.color_ui = next.color_ui.length > 0 ? next.color_ui : null
  }

  return payload
}
