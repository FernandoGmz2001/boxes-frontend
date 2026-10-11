import { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { PencilIcon, PlusIcon, TagsIcon, TrashIcon, XIcon } from 'lucide-react'
import { useTablePagination } from '@/components/features/DataTable/hooks/useTablePagination.ts'
import FormTextField from '@/components/features/Form/FormTextField.tsx'
import { Alert, AlertDescription } from '@/components/ui/alert.tsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer.tsx'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import { useCategoryForm } from '../hooks/useCategoryForm.ts'
import type { IGetCategory } from '../interfaces/get.interface.ts'
import { useDeleteCategory, useGetCategories } from '../services/queries.ts'

interface CategoryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CategoryDrawer({ open, onOpenChange }: CategoryDrawerProps) {
  const { page, setPage } = useTablePagination()
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<IGetCategory | null>(null)
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null)
  const categoriesQuery = useGetCategories({ pagina: page, limite: 10 })
  const deleteCategory = useDeleteCategory()
  const { form, onSubmit, isEditing, isSubmitting } = useCategoryForm(editingCategory, () => {
    setFormOpen(false)
    setEditingCategory(null)
  })
  const categories = categoriesQuery.data?.data ?? []
  const totalPages = categoriesQuery.data?.total_paginas ?? 0

  const confirmDelete = () => {
    if (deleteCategoryId === null) return

    deleteCategory.mutate(deleteCategoryId, {
      onSuccess: () => setDeleteCategoryId(null),
    })
  }

  const closeForm = () => {
    form.reset()
    setFormOpen(false)
    setEditingCategory(null)
  }

  const openCreate = () => {
    form.reset({ nombre: '' })
    setEditingCategory(null)
    setFormOpen(true)
  }

  const openEdit = (category: IGetCategory) => {
    form.reset({ nombre: category.nombre })
    setEditingCategory(category)
    setFormOpen(true)
  }

  return (
    <>
      <Drawer
        open={open}
        swipeDirection="right"
        onOpenChange={(nextOpen) => {
          if (!nextOpen && (isSubmitting || deleteCategory.isPending)) return
          onOpenChange(nextOpen)
        }}
        onOpenChangeComplete={(nextOpen) => {
          if (!nextOpen) closeForm()
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <DrawerTitle>
                  {formOpen ? (isEditing ? 'Editar categoría' : 'Nueva categoría') : 'Categorías'}
                </DrawerTitle>
                <DrawerDescription>
                  {formOpen
                    ? isEditing
                      ? 'Actualiza el nombre de la categoría.'
                      : 'Escribe el nombre de la categoría.'
                    : 'Administra las categorías de tus productos.'}
                </DrawerDescription>
              </div>
              <DrawerClose render={<Button variant="ghost" size="icon-sm" aria-label="Cerrar" />}>
                <XIcon />
              </DrawerClose>
            </div>
          </DrawerHeader>

          {formOpen ? (
            <FormProvider {...form}>
              <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit} noValidate>
                <div className="flex-1 overflow-y-auto p-4">
                  <FormTextField
                    name="nombre"
                    label="Nombre"
                    required
                    autoFocus
                    placeholder="p. ej. Bebidas"
                  />
                </div>
                <DrawerFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                    Guardar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={closeForm}
                  >
                    Cancelar
                  </Button>
                </DrawerFooter>
              </form>
            </FormProvider>
          ) : (
            <>
              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
                <Button type="button" onClick={openCreate}>
                  <PlusIcon data-icon="inline-start" />
                  Crear categoría
                </Button>
                {categoriesQuery.isLoading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : null}
                {categoriesQuery.isError ? (
                  <Alert variant="destructive">
                    <AlertDescription>No se pudieron cargar las categorías.</AlertDescription>
                  </Alert>
                ) : null}
                {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length === 0 ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <TagsIcon />
                      </EmptyMedia>
                      <EmptyTitle>No hay categorías</EmptyTitle>
                      <EmptyDescription>Crea una categoría para organizar tus productos.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : null}
                {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length > 0 ? (
                  <ul>
                    {categories.map((category, index) => (
                      <li key={category.id}>
                        {index > 0 ? <Separator /> : null}
                        <div className="flex items-center justify-between gap-2 py-2">
                          <span className="truncate">{category.nombre}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Editar ${category.nombre}`}
                              onClick={() => openEdit(category)}
                            >
                              <PencilIcon />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Eliminar ${category.nombre}`}
                              onClick={() => setDeleteCategoryId(category.id)}
                            >
                              <TrashIcon />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              {totalPages > 1 ? (
                <DrawerFooter>
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {page} de {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </DrawerFooter>
              ) : null}
            </>
          )}
        </DrawerContent>
      </Drawer>
      <AlertDialog
        open={deleteCategoryId !== null}
        onOpenChange={(open) => {
          if (!open && !deleteCategory.isPending) setDeleteCategoryId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
            <AlertDialogDescription>
              La categoría se borrará y dejará de estar disponible para los productos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCategory.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={deleteCategory.isPending} onClick={confirmDelete}>
              {deleteCategory.isPending ? <Spinner data-icon="inline-start" /> : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
