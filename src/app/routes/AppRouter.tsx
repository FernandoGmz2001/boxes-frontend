import { lazy } from 'react'
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
import { ROUTES } from './routes.constants.ts'
import SessionGate from './SessionGate.tsx'
import RouteSuspense from './wrappers/RouteSuspense.tsx'

const PosPage = lazy(() => import('@/features/pos/pages/PosPage.tsx'))
const ShiftsPage = lazy(() => import('@/features/shifts/pages/ShiftsPage.tsx'))
const ShiftDetailPage = lazy(() => import('@/features/shifts/pages/ShiftDetailPage.tsx'))

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
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
            <Route path={ROUTES.PRODUCT_CREATE} element={<ProductCreatePage />} />
            <Route path={ROUTES.PRODUCT_EDIT} element={<ProductEditPage />} />
          </Route>
          <Route element={<PermissionGate permission="movimientos" />}>
            <Route path={ROUTES.MOVEMENTS} element={<MovementsPage />} />
          </Route>
          <Route element={<PermissionGate permission="ventas" />}>
            <Route
              path={ROUTES.POS}
              element={
                <RouteSuspense path={ROUTES.POS}>
                  <PosPage />
                </RouteSuspense>
              }
            />
          </Route>
          <Route element={<PermissionGate permission="cajas" />}>
            <Route
              path={ROUTES.SHIFTS}
              element={
                <RouteSuspense path={ROUTES.SHIFTS}>
                  <ShiftsPage />
                </RouteSuspense>
              }
            />
            <Route
              path={ROUTES.SHIFT_DETAIL}
              element={
                <RouteSuspense path={ROUTES.SHIFT_DETAIL}>
                  <ShiftDetailPage />
                </RouteSuspense>
              }
            />
          </Route>
          <Route element={<PermissionGate permission="usuarios" />}>
            <Route path={ROUTES.USERS} element={<UsersPage />} />
          </Route>
          <Route element={<PermissionGate permission="roles" />}>
            <Route path={ROUTES.ROLES} element={<RolesPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.PRODUCTS} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
