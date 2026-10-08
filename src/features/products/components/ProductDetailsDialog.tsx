import { Alert, AlertDescription } from '@/components/ui/alert.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { useGetCategories } from '@/features/categories/services/queries.ts'
import { formatMoney } from '../format-money.ts'
import { useGetProduct } from '../services/queries.ts'
import ProductImage from './ProductImage.tsx'

interface ProductDetailsDialogProps {
  productId: number
  onClose: () => void
  onEdit: (productId: number) => void
}

export default function ProductDetailsDialog({ productId, onClose, onEdit }: ProductDetailsDialogProps) {
  const productQuery = useGetProduct(productId)
  const categoriesQuery = useGetCategories({ pagina: 1, limite: 100 })
  const product = productQuery.data
  const categoryName = categoriesQuery.data?.data.find((category) => category.id === product?.id_categoria)?.nombre

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del producto</DialogTitle>
        </DialogHeader>
        {productQuery.isLoading ? <Skeleton className="h-48 w-full" /> : null}
        {productQuery.isError ? (
          <Alert variant="destructive">
            <AlertDescription>No se pudo cargar el producto.</AlertDescription>
          </Alert>
        ) : null}
        {product ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <ProductImage src={product.imagen_url} name={product.nombre_producto} />
              <div>
                <p className="font-medium">{product.nombre_producto}</p>
                <p className="text-muted-foreground">{categoryName ?? 'Sin categoría'}</p>
              </div>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">SKU</dt>
                <dd>{product.sku ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Código de barras</dt>
                <dd>{product.codigo_barras ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Existencia</dt>
                <dd>{product.cantidad_en_existencia}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Stock mínimo</dt>
                <dd>{product.stock_minimo}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Precio de venta</dt>
                <dd>{formatMoney(product.precio_venta)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Costo de compra</dt>
                <dd>{formatMoney(product.costo_compra)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Servicio</dt>
                <dd>{product.es_servicio ? 'Sí' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Activo</dt>
                <dd>
                  <Badge variant={product.activo ? 'secondary' : 'outline'}>{product.activo ? 'Sí' : 'No'}</Badge>
                </dd>
              </div>
            </dl>
            <DialogFooter>
              <Button type="button" onClick={() => onEdit(product.id)}>
                Editar
              </Button>
            </DialogFooter>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
