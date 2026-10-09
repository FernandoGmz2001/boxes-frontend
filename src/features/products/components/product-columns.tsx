import { createColumnHelper } from "@tanstack/react-table";
import {
  DeleteIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { Link } from "react-router";
import type { DataTableFeatures } from "@/components/features/DataTable/data-table-features.ts";
import { Button } from "@/components/ui/button.tsx";
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
import ProductImage from "./ProductImage.tsx";

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
      | "precio_venta"
      | "ganancia",
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
    columnHelper.accessor("nombre_producto", {
      header: "Producto",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex min-w-0 items-center gap-3">
            <ProductImage
              src={product.imagen_url}
              name={product.nombre_producto}
            />
            {editableCell(product, "nombre_producto")}
          </div>
        );
      },
    }),
    columnHelper.accessor("id_categoria", {
      header: "Categoría",
      cell: ({ row }) => editableCell(row.original, "id_categoria"),
    }),
    columnHelper.accessor("cantidad_en_existencia", {
      header: "Cantidad en existencia",
      cell: ({ row }) => editableCell(row.original, "cantidad_en_existencia"),
    }),
    columnHelper.accessor("precio_venta", {
      header: "Precio",
      cell: ({ row }) => editableCell(row.original, "precio_venta"),
    }),
    columnHelper.accessor("costo_compra", {
      header: "Costo",
      cell: ({ row }) => editableCell(row.original, "costo_compra"),
    }),

    columnHelper.display({
      id: "ganancia",
      header: "Ganancia",
      cell: ({ row }) => editableCell(row.original, "ganancia"),
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
