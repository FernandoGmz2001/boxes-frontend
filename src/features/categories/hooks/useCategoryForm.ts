import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { ICreateCategory } from '../interfaces/create.interface.ts'
import type { IGetCategory } from '../interfaces/get.interface.ts'
import type { IUpdateCategory } from '../interfaces/update.interface.ts'
import { categorySchema, type CategorySchema } from '../schemas/upsert.schema.ts'
import { useCreateCategory, useUpdateCategory } from '../services/queries.ts'

const emptyValues: CategorySchema = {
  nombre: '',
}

function buildPayload(values: CategorySchema): ICreateCategory & IUpdateCategory {
  return {
    nombre: values.nombre,
  }
}

export function useCategoryForm(category: IGetCategory | null, onSaved: () => void) {
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory()

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: emptyValues,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = buildPayload(values)

    if (category) {
      await updateCategory({ categoryId: category.id, payload })
    } else {
      await createCategory(payload)
    }

    form.reset(emptyValues)
    onSaved()
  })

  return {
    form,
    onSubmit,
    isEditing: category !== null,
    isSubmitting: isCreating || isUpdating,
  }
}
