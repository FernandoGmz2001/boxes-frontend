import { useNavigate, useParams } from 'react-router'
import { Alert, AlertDescription } from '@/components/ui/alert.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import ProductForm from '../components/ProductForm.tsx'
import { useGetProduct } from '../services/queries.ts'

export default function ProductEditPage() {
  const { productId: productIdParam } = useParams()
  const navigate = useNavigate()
  const productId = Number(productIdParam)
  const isValidId = Number.isInteger(productId) && productId > 0
  const productQuery = useGetProduct(isValidId ? productId : 0)

  if (productQuery.data) {
    return (
      <main className="flex min-h-0 w-full flex-1 flex-col bg-canvas">
        <ProductForm product={productQuery.data} onClose={() => navigate('/')} />
      </main>
    )
  }

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col bg-canvas p-4">
      {isValidId && productQuery.isLoading ? <Skeleton className="h-80 w-full" /> : null}
      {!isValidId || productQuery.isError ? (
        <Alert variant="destructive">
          <AlertDescription>No se pudo cargar el producto.</AlertDescription>
        </Alert>
      ) : null}
    </main>
  )
}
