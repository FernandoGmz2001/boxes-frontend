import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import AppShell from '@/app/layouts/AppShell.tsx'
import LoginPage from '@/features/auth/pages/LoginPage.tsx'
import MovementsPage from '@/features/movements/pages/MovementsPage.tsx'
import ProductCreatePage from '@/features/products/pages/ProductCreatePage.tsx'
import ProductEditPage from '@/features/products/pages/ProductEditPage.tsx'
import ProductsPage from '@/features/products/pages/ProductsPage.tsx'
import RolesPage from '@/features/roles/pages/RolesPage.tsx'
import UsersPage from '@/features/users/pages/UsersPage.tsx'
import PermissionGate from './PermissionGate.tsx'
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
          <Route element={<PermissionGate permission="productos" />}>
            <Route index element={<ProductsPage />} />
            <Route path="productos/nuevo" element={<ProductCreatePage />} />
            <Route path="productos/:productId" element={<ProductEditPage />} />
          </Route>
          <Route element={<PermissionGate permission="movimientos" />}>
            <Route path="movimientos" element={<MovementsPage />} />
          </Route>
          <Route element={<PermissionGate permission="usuarios" />}>
            <Route path="usuarios" element={<UsersPage />} />
          </Route>
          <Route element={<PermissionGate permission="roles" />}>
            <Route path="roles" element={<RolesPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
