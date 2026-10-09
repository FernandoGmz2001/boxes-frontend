import { useCallback, useState } from 'react'
import { PlusIcon, TagsIcon } from 'lucide-react'
import { cn } from 'cn'
import { useTablePagination } from '@/components/features/DataTable/hooks/useTablePagination.ts'
import SaveFooter from '@/components/features/SaveFooter/SaveFooter.tsx'
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
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import CategoryFormDialog from '../components/CategoryFormDialog.tsx'
import CategoryList from '../components/CategoryList.tsx'
import CategoryListSkeleton from '../components/Skeletons/CategoryListSkeleton.tsx'
import { useCategoryRowEdit } from '../hooks/useCategoryRowEdit.ts'
import type { IGetCategory } from '../interfaces/get.interface.ts'
import { useDeleteCategory, useGetCategories } from '../services/queries.ts'

export default function CategoriesPage() {
  const { page, pageSize, setPage, setPageSize, resetPage } = useTablePagination()
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null)
  const [draftCategory, setDraftCategory] = useState<IGetCategory | null>()
  const categoriesQuery = useGetCategories({ pagina: page, limite: pageSize })
  const { valuesFor, errorFor, setField, dirtyCount, isSaving, save } = useCategoryRowEdit()
  const deleteCategory = useDeleteCategory()
  const categories = categoriesQuery.data?.data ?? []
  const total = categoriesQuery.data?.total ?? 0
  const totalPages = categoriesQuery.data?.total_paginas ?? 0

  const openEdit = useCallback((category: IGetCategory) => {
    setDraftCategory(category)
  }, [])

  const askDelete = useCallback((categoryId: number) => {
    setDeleteCategoryId(categoryId)
  }, [])

  const confirmDelete = () => {
    if (deleteCategoryId === null) return

    deleteCategory.mutate(deleteCategoryId, {
      onSuccess: () => setDeleteCategoryId(null),
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto p-6 lg:p-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h1 className="font-heading text-xl font-semibold tracking-tight">Listado de categorías</h1>
            <p className="text-sm text-muted-foreground">Gestiona las categorías de tu inventario.</p>
          </div>
          <Button type="button" onClick={() => setDraftCategory(null)}>
            <PlusIcon data-icon="inline-start" />
            Nueva categoría
          </Button>
        </div>
        {categoriesQuery.isLoading ? <CategoryListSkeleton /> : null}
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
          <div className={cn(categoriesQuery.isFetching && 'opacity-60')}>
            <CategoryList
              categories={categories}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                resetPage()
              }}
              valuesFor={valuesFor}
              errorFor={errorFor}
              setField={setField}
              isSaving={isSaving}
              onEdit={openEdit}
              onDelete={askDelete}
            />
          </div>
        ) : null}
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
              <AlertDialogAction
                variant="destructive"
                disabled={deleteCategory.isPending}
                onClick={confirmDelete}
              >
                {deleteCategory.isPending ? <Spinner data-icon="inline-start" /> : null}
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {draftCategory !== undefined ? (
          <CategoryFormDialog
            key={draftCategory?.id ?? 'new'}
            category={draftCategory}
            onClose={() => setDraftCategory(undefined)}
          />
        ) : null}
      </main>
      <SaveFooter
        dirtyCount={dirtyCount}
        singularLabel="categoría"
        pluralLabel="categorías"
        isSaving={isSaving}
        onSave={save}
      />
    </div>
  )
}
