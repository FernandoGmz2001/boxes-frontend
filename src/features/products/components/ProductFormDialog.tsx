import { Alert, AlertDescription } from '@/components/ui/alert.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { useGetProduct } from '../services/queries.ts'
import ProductForm from './ProductForm.tsx'

interface ProductFormDialogProps {
  productId: number
  onClose: () => void
}

export default function ProductFormDialog({ productId, onClose }: ProductFormDialogProps) {
  const productQuery = useGetProduct(productId)

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-h-[min(90svh,820px)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
        </DialogHeader>
        {productQuery.isLoading ? <Skeleton className="h-80 w-full" /> : null}
        {productQuery.isError ? (
          <Alert variant="destructive">
            <AlertDescription>No se pudo cargar el producto.</AlertDescription>
          </Alert>
        ) : null}
        {productQuery.data ? <ProductForm product={productQuery.data} onClose={onClose} /> : null}
      </DialogContent>
    </Dialog>
  )
}
