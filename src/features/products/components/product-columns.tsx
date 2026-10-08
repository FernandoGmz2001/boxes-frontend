import { createColumnHelper } from '@tanstack/react-table'
import { EyeIcon, MoreHorizontalIcon, PencilIcon } from 'lucide-react'
import type { DataTableFeatures } from '@/components/features/DataTable/data-table-features.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { formatMoney } from '../format-money.ts'
import type { IGetProduct } from '../interfaces/get.interface.ts'
import ProductImage from './ProductImage.tsx'

interface ProductColumnHandlers {
  categoryNames: Map<number, string>
  onEdit: (productId: number) => void
  onView: (productId: number) => void
  onToggleActive: (product: IGetProduct) => void
  onDeactivate: (productId: number) => void
  togglingProductId: number | null
}

const columnHelper = createColumnHelper<DataTableFeatures, IGetProduct>()

export function createProductColumns({
  categoryNames,
  onEdit,
  onView,
  onToggleActive,
  onDeactivate,
  togglingProductId,
}: ProductColumnHandlers) {
  return columnHelper.columns([
    columnHelper.accessor('nombre_producto', {
      header: 'Producto',
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="flex min-w-0 items-center gap-3">
            <ProductImage src={product.imagen_url} name={product.nombre_producto} />
            <div className="min-w-0">
              <p className="truncate font-medium">{product.nombre_producto}</p>
              <p className="truncate text-muted-foreground">{product.sku ?? 'Sin SKU'}</p>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor('id_categoria', {
      header: 'Categoría',
      cell: ({ row }) => categoryNames.get(row.original.id_categoria) ?? 'Sin categoría',
    }),
    columnHelper.accessor('cantidad_en_existencia', {
      header: 'Existencia',
      cell: ({ row }) => {
        const product = row.original
        const lowStock = product.cantidad_en_existencia <= product.stock_minimo

        return (
          <div className="flex items-center gap-2">
            <span>{product.cantidad_en_existencia}</span>
            <Badge variant={lowStock ? 'destructive' : 'outline'}>mín. {product.stock_minimo}</Badge>
          </div>
        )
      },
    }),
    columnHelper.accessor('precio_venta', {
      header: 'Precio',
      cell: ({ row }) => formatMoney(row.original.precio_venta),
    }),
    columnHelper.accessor('activo', {
      header: 'Activo',
      cell: ({ row }) => {
        const product = row.original

        return (
          <Switch
            checked={product.activo}
            disabled={togglingProductId === product.id}
            aria-label={product.activo ? 'Desactivar producto' : 'Activar producto'}
            onCheckedChange={() => onToggleActive(product)}
          />
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="flex justify-end gap-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(product.id)}>
              <PencilIcon data-icon="inline-start" />
              Editar
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => onView(product.id)}>
              <EyeIcon data-icon="inline-start" />
              Ver
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Más" />}>
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={!product.activo}
                    onClick={() => onDeactivate(product.id)}
                  >
                    Dar de baja
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    }),
  ])
}
