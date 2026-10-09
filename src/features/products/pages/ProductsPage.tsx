import { useCallback, useState } from "react";
import { PackageIcon } from "lucide-react";
import { cn } from "cn";
import { useTablePagination } from "@/components/features/DataTable/hooks/useTablePagination.ts";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useGetCategories } from "@/features/categories/services/queries.ts";
import ProductList from "../components/ProductList.tsx";
import ProductSaveFooter from "../components/ProductSaveFooter.tsx";
import ProductListSkeleton from "../components/Skeletons/ProductListSkeleton.tsx";
import ProductToolbar from "../components/ProductToolbar.tsx";
import { useProductRowEdit } from "../hooks/useProductRowEdit.ts";
import { useDeactivateProduct, useGetProducts } from "../services/queries.ts";

type ProductStatus = "all" | "active" | "inactive";

export default function ProductsPage() {
  const { page, pageSize, setPage, setPageSize, resetPage } =
    useTablePagination();
  const [status, setStatus] = useState<ProductStatus>("all");
  const [deactivateProductId, setDeactivateProductId] = useState<number | null>(
    null,
  );
  const activo = status === "all" ? undefined : status === "active";
  const productsQuery = useGetProducts({
    pagina: page,
    limite: pageSize,
    activo,
  });
  const categoriesQuery = useGetCategories({ pagina: 1, limite: 100 });
  const { valuesFor, errorFor, setField, dirtyCount, isSaving, save } =
    useProductRowEdit();
  const deactivateProduct = useDeactivateProduct();
  const products = productsQuery.data?.data ?? [];
  const total = productsQuery.data?.total ?? 0;
  const totalPages = productsQuery.data?.total_paginas ?? 0;

  const handleStatusChange = (nextStatus: ProductStatus) => {
    setStatus(nextStatus);
    resetPage();
  };

  const askDeactivate = useCallback((productId: number) => {
    setDeactivateProductId(productId);
  }, []);

  const confirmDeactivate = () => {
    if (deactivateProductId === null) return;

    deactivateProduct.mutate(deactivateProductId, {
      onSuccess: () => setDeactivateProductId(null),
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto p-6 lg:p-8">
        <div className="flex items-center justify-end gap-2">
          <ProductToolbar
            status={status}
            totalLabel={String(total)}
            onStatusChange={handleStatusChange}
          />
        </div>
        {productsQuery.isLoading ? <ProductListSkeleton /> : null}
        {productsQuery.isError ? (
          <Alert variant="destructive">
            <AlertDescription>
              No se pudieron cargar los productos.
            </AlertDescription>
          </Alert>
        ) : null}
        {!productsQuery.isLoading &&
        !productsQuery.isError &&
        products.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageIcon />
              </EmptyMedia>
              <EmptyTitle>No hay productos</EmptyTitle>
              <EmptyDescription>
                No hay productos para este filtro.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {!productsQuery.isLoading &&
        !productsQuery.isError &&
        products.length > 0 ? (
          <div className={cn(productsQuery.isFetching && "opacity-60")}>
            <ProductList
              products={products}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                resetPage();
              }}
              categories={categoriesQuery.data?.data ?? []}
              valuesFor={valuesFor}
              errorFor={errorFor}
              setField={setField}
              isSaving={isSaving}
              onDeactivate={askDeactivate}
            />
          </div>
        ) : null}
        <AlertDialog
          open={deactivateProductId !== null}
          onOpenChange={(open) => {
            if (!open && !deactivateProduct.isPending)
              setDeactivateProductId(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Dar de baja</AlertDialogTitle>
              <AlertDialogDescription>
                El producto quedará inactivo y se conservará en el inventario.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deactivateProduct.isPending}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deactivateProduct.isPending}
                onClick={confirmDeactivate}
              >
                {deactivateProduct.isPending ? (
                  <Spinner data-icon="inline-start" />
                ) : null}
                Dar de baja
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
      <ProductSaveFooter
        dirtyCount={dirtyCount}
        isSaving={isSaving}
        onSave={save}
      />
    </div>
  );
}
