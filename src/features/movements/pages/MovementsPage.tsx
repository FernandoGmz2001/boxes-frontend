import { useState } from "react";
import { useTablePagination } from "@/components/features/DataTable/hooks/useTablePagination.ts";
import ListHeader from "@/components/features/ListHeader/ListHeader.tsx";
import SearchInput from "@/components/features/SearchInput/SearchInput.tsx";
import { useGetCategories } from "@/features/categories/services/queries.ts";
import { useGetProducts } from "@/features/products/services/queries.ts";
import MovementLog from "../components/MovementLog.tsx";
import MovementProductList from "../components/MovementProductList.tsx";
import {
  MOVEMENT_TYPES,
  type MovementType,
} from "../interfaces/get.interface.ts";
import { useGetMovements } from "../services/queries.ts";

const PRODUCT_PAGE_SIZE = 15;
const MOVEMENT_PAGE_SIZE = 30;
const PRODUCT_CATALOG_LIMIT = 100;

const INITIAL_TYPES = Object.fromEntries(
  MOVEMENT_TYPES.map((type) => [type, true]),
) as Record<MovementType, boolean>;

export default function MovementsPage() {
  const {
    page: productPage,
    pageSize: productPageSize,
    setPage: setProductPage,
    resetPage: resetProductPage,
  } = useTablePagination(PRODUCT_PAGE_SIZE);
  const {
    page: movementPage,
    pageSize: movementPageSize,
    setPage: setMovementPage,
    resetPage: resetMovementPage,
  } = useTablePagination(MOVEMENT_PAGE_SIZE);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [enabledTypes, setEnabledTypes] = useState(INITIAL_TYPES);
  const productsQuery = useGetProducts({
    pagina: productPage,
    limite: productPageSize,
    busqueda: productSearch || undefined,
  });
  const productCatalogQuery = useGetProducts({
    pagina: 1,
    limite: PRODUCT_CATALOG_LIMIT,
  });
  const categoriesQuery = useGetCategories({ pagina: 1, limite: 100 });
  const movementsQuery = useGetMovements({
    pagina: movementPage,
    limite: movementPageSize,
    producto_id: selectedProductId ?? undefined,
  });
  const products = productsQuery.data?.data ?? [];
  const movements = movementsQuery.data?.data ?? [];
  const visibleMovements = movements.filter(
    (movement) => enabledTypes[movement.tipo_movimiento],
  );
  const productNames = new Map<number, string>();
  const movementTotal = movementsQuery.data?.total ?? 0;

  for (const product of productCatalogQuery.data?.data ?? []) {
    productNames.set(product.id, product.nombre_producto);
  }

  for (const product of products) {
    productNames.set(product.id, product.nombre_producto);
  }

  const headerLabel =
    selectedProductId === null
      ? "Todos los productos"
      : (productNames.get(selectedProductId) ??
        `Producto ${selectedProductId}`);
  const movementCountLabel = `${movementTotal.toLocaleString("es-MX")} ${movementTotal === 1 ? "movimiento" : "movimientos"}`;

  const selectProduct = (productId: number | null) => {
    setSelectedProductId(productId);
    resetMovementPage();
  };

  const changeType = (type: MovementType, enabled: boolean) => {
    setEnabledTypes((current) => ({ ...current, [type]: enabled }));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 bg-background p-4">
      <ListHeader
        title="Movimientos"
        subtitle="Consulta las entradas, salidas y ajustes de tu inventario."
      >
        {movementsQuery.isSuccess ? (
          <p className="text-sm text-muted-foreground tabular-nums">
            {movementCountLabel}
          </p>
        ) : null}
      </ListHeader>
      {/* <div className="w-full "></div> */}
      <div className="grid grid-cols-3 min-h-0  gap-4 lg:flex-row">
        <div className="flex flex-col gap-6">
          <SearchInput
            className="max-w-none"
            label="Buscar productos"
            placeholder="Nombre o SKU"
            onDebouncedChange={(value) => {
              resetProductPage();
              setProductSearch(value);
            }}
          />

          <MovementProductList
            products={products}
            categories={categoriesQuery.data?.data ?? []}
            categoriesLoading={categoriesQuery.isLoading}
            selectedProductId={selectedProductId}
            page={productPage}
            totalPages={productsQuery.data?.total_paginas ?? 0}
            total={productsQuery.data?.total ?? 0}
            isLoading={productsQuery.isLoading}
            isFetching={productsQuery.isFetching}
            isError={productsQuery.isError}
            onSelect={selectProduct}
            onPageChange={setProductPage}
          />
        </div>
        <MovementLog
          movements={visibleMovements}
          pageMovementCount={movements.length}
          productNames={productNames}
          showProductName={selectedProductId === null}
          headerLabel={headerLabel}
          enabledTypes={enabledTypes}
          page={movementPage}
          totalPages={movementsQuery.data?.total_paginas ?? 0}
          isLoading={movementsQuery.isLoading}
          isFetching={movementsQuery.isFetching}
          isError={movementsQuery.isError}
          onTypeChange={changeType}
          onPageChange={setMovementPage}
        />
      </div>
    </div>
  );
}
