import { useNavigate } from 'react-router'
import { Card, CardContent } from '@/components/ui/card.tsx'
import ProductForm from '../components/ProductForm.tsx'

export default function ProductCreatePage() {
  const navigate = useNavigate()

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-5 p-6 lg:p-8">
      <h1 className="font-heading text-2xl font-medium">Nuevo producto</h1>
      <Card>
        <CardContent>
          <ProductForm product={null} onClose={() => navigate('/')} />
        </CardContent>
      </Card>
    </main>
  )
}
