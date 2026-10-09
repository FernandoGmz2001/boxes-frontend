import { Controller, FormProvider } from 'react-hook-form'
import FormField from '@/components/features/Form/FormField.tsx'
import FormTextField from '@/components/features/Form/FormTextField.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import SaveShortcut from '@/shared/hotkeys/SaveShortcut.tsx'
import { useCategoryForm } from '../hooks/useCategoryForm.ts'
import type { IGetCategory } from '../interfaces/get.interface.ts'
import CategoryColorControl from './CategoryColorControl.tsx'

interface CategoryFormDialogProps {
  category: IGetCategory | null
  onClose: () => void
}

export default function CategoryFormDialog({ category, onClose }: CategoryFormDialogProps) {
  const { form, onSubmit, isEditing, isSubmitting } = useCategoryForm(category, onClose)

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <FormProvider {...form}>
          <form className="grid gap-4" onSubmit={onSubmit} noValidate>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Actualiza los datos de la categoría.' : 'Completa los datos de la categoría.'}
              </DialogDescription>
            </DialogHeader>
            <FormTextField name="nombre" label="Nombre" required />
            <Controller
              name="color_ui"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormField
                  label="Color"
                  htmlFor="color_ui"
                  invalid={fieldState.invalid}
                  error={fieldState.error}
                  description="Opcional. Ejemplo: #1A73E8"
                >
                  <CategoryColorControl
                    id="color_ui"
                    value={field.value}
                    invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormField>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Guardar
                {isSubmitting ? null : <SaveShortcut />}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
