import { useState } from 'react'
import { PackageIcon } from 'lucide-react'
import { cn } from 'cn'
import { useTablePagination } from '@/components/features/DataTable/hooks/useTablePagination.ts'
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
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import { useGetCategories } from '@/features/categories/services/queries.ts'
import ProductDetailsDialog from '../components/ProductDetailsDialog.tsx'
import ProductFormDialog from '../components/ProductFormDialog.tsx'
import ProductList from '../components/ProductList.tsx'
import ProductListSkeleton from '../components/Skeletons/ProductListSkeleton.tsx'
import ProductStats from '../components/ProductStats.tsx'
import ProductToolbar from '../components/ProductToolbar.tsx'
import type { IGetProduct } from '../interfaces/get.interface.ts'
import { useDeactivateProduct, useGetProducts, useUpdateProduct } from '../services/queries.ts'

type ProductStatus = 'all' | 'active' | 'inactive'

export default function ProductsPage() {
  const { page, pageSize, setPage, setPageSize, resetPage } = useTablePagination()
  const [status, setStatus] = useState<ProductStatus>('all')
  const [editorProductId, setEditorProductId] = useState<number | null>(null)
  const [viewProductId, setViewProductId] = useState<number | null>(null)
  const [deactivateProductId, setDeactivateProductId] = useState<number | null>(null)
  const activo = status === 'all' ? undefined : status === 'active'
  const productsQuery = useGetProducts({ pagina: page, limite: pageSize, activo })
  const activeQuery = useGetProducts({ pagina: 1, limite: 1, activo: true })
  const inactiveQuery = useGetProducts({ pagina: 1, limite: 1, activo: false })
  const categoriesQuery = useGetCategories({ pagina: 1, limite: 100 })
  const updateProduct = useUpdateProduct()
  const deactivateProduct = useDeactivateProduct()
  const products = productsQuery.data?.data ?? []
  const total = productsQuery.data?.total ?? 0
  const totalPages = productsQuery.data?.total_paginas ?? 0
  const categoryNames = new Map((categoriesQuery.data?.data ?? []).map((category) => [category.id, category.nombre]))

  const handleStatusChange = (nextStatus: ProductStatus) => {
    setStatus(nextStatus)
    resetPage()
  }

  const handleToggleActive = (product: IGetProduct) => {
    updateProduct.mutate({ productId: product.id, payload: { activo: !product.activo } })
  }

  const confirmDeactivate = () => {
    if (deactivateProductId === null) return

    deactivateProduct.mutate(deactivateProductId, {
      onSuccess: () => setDeactivateProductId(null),
    })
  }

  return (
    <main className="flex flex-col gap-5 p-6 lg:p-8">
      <ProductToolbar status={status} totalLabel={String(total)} onStatusChange={handleStatusChange} />
      <ProductStats activeCount={activeQuery.data?.total ?? 0} inactiveCount={inactiveQuery.data?.total ?? 0} />
      {productsQuery.isLoading ? <ProductListSkeleton /> : null}
      {productsQuery.isError ? (
        <Alert variant="destructive">
          <AlertDescription>No se pudieron cargar los productos.</AlertDescription>
        </Alert>
      ) : null}
      {!productsQuery.isLoading && !productsQuery.isError && products.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageIcon />
            </EmptyMedia>
            <EmptyTitle>No hay productos</EmptyTitle>
            <EmptyDescription>No hay productos para este filtro.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {!productsQuery.isLoading && !productsQuery.isError && products.length > 0 ? (
        <div className={cn(productsQuery.isFetching && 'opacity-60')}>
          <ProductList
            products={products}
            categoryNames={categoryNames}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              resetPage()
            }}
            onEdit={(productId) => {
              setViewProductId(null)
              setEditorProductId(productId)
            }}
            onView={setViewProductId}
            onToggleActive={handleToggleActive}
            onDeactivate={setDeactivateProductId}
            togglingProductId={updateProduct.isPending ? (updateProduct.variables?.productId ?? null) : null}
          />
        </div>
      ) : null}
      {editorProductId !== null ? (
        <ProductFormDialog productId={editorProductId} onClose={() => setEditorProductId(null)} />
      ) : null}
      {viewProductId !== null ? (
        <ProductDetailsDialog
          productId={viewProductId}
          onClose={() => setViewProductId(null)}
          onEdit={(productId) => {
            setViewProductId(null)
            setEditorProductId(productId)
          }}
        />
      ) : null}
      <AlertDialog
        open={deactivateProductId !== null}
        onOpenChange={(open) => {
          if (!open && !deactivateProduct.isPending) setDeactivateProductId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dar de baja</AlertDialogTitle>
            <AlertDialogDescription>El producto quedará inactivo y se conservará en el inventario.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deactivateProduct.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deactivateProduct.isPending}
              onClick={confirmDeactivate}
            >
              {deactivateProduct.isPending ? <Spinner data-icon="inline-start" /> : null}
              Dar de baja
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
