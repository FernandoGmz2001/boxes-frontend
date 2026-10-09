import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import AppShell from '@/app/layouts/AppShell.tsx'
import LoginPage from '@/features/auth/pages/LoginPage.tsx'
import CategoriesPage from '@/features/categories/pages/CategoriesPage.tsx'
import ProductCreatePage from '@/features/products/pages/ProductCreatePage.tsx'
import ProductEditPage from '@/features/products/pages/ProductEditPage.tsx'
import ProductsPage from '@/features/products/pages/ProductsPage.tsx'
import SessionGate from './SessionGate.tsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <SessionGate mode="guest">
              <LoginPage />
            </SessionGate>
          }
        />
        <Route
          element={
            <SessionGate mode="authenticated">
              <AppShell />
            </SessionGate>
          }
        >
          <Route index element={<ProductsPage />} />
          <Route path="productos/nuevo" element={<ProductCreatePage />} />
          <Route path="productos/:productId" element={<ProductEditPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
