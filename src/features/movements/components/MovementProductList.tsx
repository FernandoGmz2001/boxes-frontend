import { cn } from "cn";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import type { IGetCategory } from "@/features/categories/interfaces/get.interface.ts";
import type { IGetProduct } from "@/features/products/interfaces/get.interface.ts";
import { formatQuantity } from "../format-movement-log.ts";
import MovementPager from "./MovementPager.tsx";
import MovementProductOption from "./MovementProductOption.tsx";
import MovementProductListSkeleton from "./Skeletons/MovementProductListSkeleton.tsx";

interface MovementProductListProps {
  products: IGetProduct[];
  categories: IGetCategory[];
  categoriesLoading: boolean;
  selectedProductId: number | null;
  page: number;
  totalPages: number;
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onSelect: (productId: number | null) => void;
  onPageChange: (page: number) => void;
}

export default function MovementProductList({
  products,
  categories,
  categoriesLoading,
  selectedProductId,
  page,
  totalPages,
  total,
  isLoading,
  isFetching,
  isError,
  onSelect,
  onPageChange,
}: MovementProductListProps) {
  const groups = categoriesLoading
    ? [{ categoryName: "", products }]
    : groupProductsByCategory(products, categories);
  const productCountLabel = `${total.toLocaleString("es-MX")} ${total === 1 ? "producto" : "productos"}`;

  return (
    <aside className="flex max-h-80 w-full shrink-0 flex-col lg:max-h-none  lg:flex-1">
      <div className="flex items-center px-3 pb-2 text-xs text-muted-foreground">
        <span>Producto</span>
        <span className="ml-auto pr-5">Existencia</span>
      </div>
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto pr-2",
          isFetching && !isLoading && "opacity-60",
        )}
      >
        <MovementProductOption
          label="Todos los productos"
          selected={selectedProductId === null}
          onSelect={() => onSelect(null)}
        />
        {isLoading ? <MovementProductListSkeleton /> : null}
        {isError ? (
          <Alert variant="destructive">
            <AlertDescription>
              No se pudieron cargar los productos.
            </AlertDescription>
          </Alert>
        ) : null}
        {!isLoading && !isError && products.length === 0 ? (
          <Empty className="border-0 py-8">
            <EmptyHeader>
              <EmptyTitle>No hay productos</EmptyTitle>
              <EmptyDescription>Prueba con otro nombre o SKU.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {!isLoading && !isError
          ? groups.map((group) => {
              const showLabel =
                group.categoryName !== "" &&
                (groups.length > 1 || group.categoryName !== "Sin categoría");

              return (
                <div key={group.categoryName || "productos"}>
                  {showLabel ? (
                    <p className="px-3 pt-3 pb-1 text-sm text-muted-foreground">
                      {group.categoryName}
                    </p>
                  ) : null}
                  {group.products.map((product) => (
                    <MovementProductOption
                      key={product.id}
                      label={product.nombre_producto}
                      stock={formatQuantity(product.cantidad_en_existencia)}
                      selected={selectedProductId === product.id}
                      onSelect={() => onSelect(product.id)}
                    />
                  ))}
                </div>
              );
            })
          : null}
      </div>
      <MovementPager
        page={page}
        totalPages={totalPages}
        label={isLoading ? undefined : productCountLabel}
        onPageChange={onPageChange}
      />
    </aside>
  );
}

function groupProductsByCategory(
  products: IGetProduct[],
  categories: IGetCategory[],
) {
  const categoryNameById = new Map(
    categories.map((category) => [category.id, category.nombre]),
  );
  const groups: { categoryName: string; products: IGetProduct[] }[] = [];

  for (const product of products) {
    const categoryName =
      categoryNameById.get(product.id_categoria) ?? "Sin categoría";
    const current = groups.find((group) => group.categoryName === categoryName);

    if (current) {
      current.products.push(product);
      continue;
    }

    groups.push({ categoryName, products: [product] });
  }

  return groups;
}
