import { createColumnHelper } from "@tanstack/react-table";
import {
  ActivityIcon,
  BadgeDollarSignIcon,
  BoxesIcon,
  CircleCheckIcon,
  CircleOffIcon,
  MoreHorizontalIcon,
  PackageIcon,
  PencilIcon,
  ReceiptIcon,
  ScanBarcodeIcon,
  TagIcon,
  TrashIcon,
  TrendingUpIcon,
  WrenchIcon,
} from "lucide-react";
import { Link } from "react-router";
import DataTableColumnHeader from "@/components/features/DataTable/DataTableColumnHeader.tsx";
import type { DataTableFeatures } from "@/components/features/DataTable/data-table-features.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import type { IGetCategory } from "@/features/categories/interfaces/get.interface.ts";
import type { ProductRowEditHandlers } from "../hooks/useProductRowEdit.ts";
import type { IGetProduct } from "../interfaces/get.interface.ts";
import ProductEditableCell from "./ProductEditableCell.tsx";
import ProductImagePreview from "./ProductImagePreview.tsx";
import ProductProfitCell from "./ProductProfitCell.tsx";
import ProductStockBadge from "./ProductStockBadge.tsx";

export interface ProductColumnHandlers extends ProductRowEditHandlers {
  categories: IGetCategory[];
  onDeactivate: (productId: number) => void;
  onCreateCategory: (nombre: string) => Promise<number>;
}

const columnHelper = createColumnHelper<DataTableFeatures, IGetProduct>();

export function createProductColumns(handlers: ProductColumnHandlers) {
  const editableCell = (
    product: IGetProduct,
    field:
      | "nombre_producto"
      | "id_categoria"
      | "cantidad_en_existencia"
      | "costo_compra"
      | "precio_venta",
  ) => {
    const {
      categories,
      onCreateCategory,
      valuesFor,
      errorFor,
      setField,
      isSaving,
    } = handlers;

    return (
      <ProductEditableCell
        product={product}
        field={field}
        categories={categories}
        onCreateCategory={onCreateCategory}
        valuesFor={valuesFor}
        errorFor={errorFor}
        setField={setField}
        isSaving={isSaving}
      />
    );
  };

  return columnHelper.columns([
    columnHelper.display({
      id: "select",
      header: ({ table }) => {
        const isAllSelected = table.getIsAllPageRowsSelected();

        return (
          <Checkbox
            aria-label="Seleccionar todos"
            checked={isAllSelected}
            indeterminate={!isAllSelected && table.getIsSomePageRowsSelected()}
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(checked)
            }
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          aria-label="Seleccionar producto"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => row.toggleSelected(checked)}
        />
      ),
    }),
    columnHelper.accessor("nombre_producto", {
      header: () => <DataTableColumnHeader icon={PackageIcon} title="Producto" />,
      cell: ({ row }) => {
        const product = row.original;
        const sku = handlers.valuesFor(product).sku.trim();

        return (
          <div className="flex min-w-0 items-center gap-3">
            <ProductImagePreview
              src={product.imagen_url}
              name={product.nombre_producto}
            />
            <div className="flex min-w-0 flex-col gap-1">
              {editableCell(product, "nombre_producto")}
              {sku || product.es_servicio ? (
                <div className="flex items-center gap-1.5">
                  {sku ? (
                    <Badge variant="outline" className="font-mono">
                      <ScanBarcodeIcon data-icon="inline-start" />
                      {sku}
                    </Badge>
                  ) : null}
                  {product.es_servicio ? (
                    <Badge variant="info">
                      <WrenchIcon data-icon="inline-start" />
                      Servicio
                    </Badge>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("id_categoria", {
      header: () => <DataTableColumnHeader icon={TagIcon} title="Categoría" />,
      cell: ({ row }) => editableCell(row.original, "id_categoria"),
    }),
    columnHelper.accessor("cantidad_en_existencia", {
      header: () => <DataTableColumnHeader icon={BoxesIcon} title="Existencia" />,
      cell: ({ row }) => {
        const product = row.original;
        const values = handlers.valuesFor(product);

        return (
          <div className="flex items-start gap-2">
            <div className="w-20">
              {editableCell(product, "cantidad_en_existencia")}
            </div>
            {product.es_servicio ? null : (
              <div className="mt-1.5">
                <ProductStockBadge
                  stock={values.cantidad_en_existencia}
                  minimumStock={values.stock_minimo}
                />
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("precio_venta", {
      header: () => (
        <DataTableColumnHeader icon={BadgeDollarSignIcon} title="Precio" />
      ),
      cell: ({ row }) => editableCell(row.original, "precio_venta"),
    }),
    columnHelper.accessor("costo_compra", {
      header: () => <DataTableColumnHeader icon={ReceiptIcon} title="Costo" />,
      cell: ({ row }) => editableCell(row.original, "costo_compra"),
    }),
    columnHelper.display({
      id: "ganancia",
      header: () => (
        <DataTableColumnHeader icon={TrendingUpIcon} title="Ganancia" />
      ),
      cell: ({ row }) => {
        const values = handlers.valuesFor(row.original);

        return (
          <ProductProfitCell
            salePrice={values.precio_venta}
            purchaseCost={values.costo_compra}
          />
        );
      },
    }),
    columnHelper.accessor("activo", {
      header: () => <DataTableColumnHeader icon={ActivityIcon} title="Estado" />,
      cell: ({ row }) =>
        row.original.activo ? (
          <Badge variant="success">
            <CircleCheckIcon data-icon="inline-start" />
            Activo
          </Badge>
        ) : (
          <Badge variant="secondary">
            <CircleOffIcon data-icon="inline-start" />
            Inactivo
          </Badge>
        ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Más" />
                }
              >
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    render={<Link to={`/productos/${product.id}`} />}
                  >
                    <PencilIcon />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={!product.activo}
                    onClick={() => handlers.onDeactivate(product.id)}
                  >
                    <TrashIcon />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ]);
}
