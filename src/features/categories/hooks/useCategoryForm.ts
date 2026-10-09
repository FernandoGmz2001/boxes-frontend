import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { ICreateCategory } from '../interfaces/create.interface.ts'
import type { IGetCategory } from '../interfaces/get.interface.ts'
import type { IUpdateCategory } from '../interfaces/update.interface.ts'
import { categorySchema, type CategorySchema } from '../schemas/upsert.schema.ts'
import { useCreateCategory, useUpdateCategory } from '../services/queries.ts'

const emptyValues: CategorySchema = {
  nombre: '',
  color_ui: '',
}

function toFormValues(category: IGetCategory): CategorySchema {
  return {
    nombre: category.nombre,
    color_ui: category.color_ui ?? '',
  }
}

function colorOrEmpty(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function buildCreatePayload(values: CategorySchema): ICreateCategory {
  const color = colorOrEmpty(values.color_ui)

  return {
    nombre: values.nombre,
    ...(color ? { color_ui: color } : {}),
  }
}

function buildUpdatePayload(values: CategorySchema): IUpdateCategory {
  return {
    nombre: values.nombre,
    color_ui: colorOrEmpty(values.color_ui),
  }
}

export function useCategoryForm(category: IGetCategory | null, onSaved: () => void) {
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory()

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? toFormValues(category) : emptyValues,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (category) {
      await updateCategory({ categoryId: category.id, payload: buildUpdatePayload(values) })
    } else {
      await createCategory(buildCreatePayload(values))
    }

    onSaved()
  })

  return {
    form,
    onSubmit,
    isEditing: category !== null,
    isSubmitting: isCreating || isUpdating,
  }
}
