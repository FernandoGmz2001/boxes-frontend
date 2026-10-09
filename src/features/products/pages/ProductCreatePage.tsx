import { useNavigate } from 'react-router'
import ProductForm from '../components/ProductForm.tsx'

export default function ProductCreatePage() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col bg-canvas">
      <ProductForm product={null} onClose={() => navigate('/')} />
    </main>
  )
}
