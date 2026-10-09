import { Field, FieldError } from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import type { CategoryRowEditHandlers } from '../hooks/useCategoryRowEdit.ts'
import type { IGetCategory } from '../interfaces/get.interface.ts'
import CategoryColorControl from './CategoryColorControl.tsx'

type CategoryCellField = 'nombre' | 'color_ui'

interface CategoryEditableCellProps extends CategoryRowEditHandlers {
  category: IGetCategory
  field: CategoryCellField
}

export default function CategoryEditableCell({
  category,
  field,
  valuesFor,
  errorFor,
  setField,
  isSaving,
}: CategoryEditableCellProps) {
  const values = valuesFor(category)
  const error = errorFor(category.id, field)
  const invalid = error ? true : undefined

  if (field === 'color_ui') {
    return (
      <Field data-invalid={invalid} data-disabled={isSaving ? true : undefined}>
        <CategoryColorControl
          value={values.color_ui}
          disabled={isSaving}
          invalid={Boolean(error)}
          onChange={(value) => setField(category, 'color_ui', value)}
        />
        <FieldError errors={error ? [{ message: error }] : []} />
      </Field>
    )
  }

  return (
    <Field data-invalid={invalid} data-disabled={isSaving ? true : undefined}>
      <Input
        className="min-w-40"
        disabled={isSaving}
        aria-invalid={invalid}
        aria-label="Nombre de la categoría"
        value={values.nombre}
        onChange={(event) => setField(category, 'nombre', event.target.value)}
      />
      <FieldError errors={error ? [{ message: error }] : []} />
    </Field>
  )
}
