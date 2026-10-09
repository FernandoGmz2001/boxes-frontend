import { Fragment } from 'react'
import { matchPath, useLocation } from 'react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.tsx'
import { useGetProduct } from '@/features/products/services/queries.ts'

interface BreadcrumbEntry {
  label: string
  to?: string
}

export default function AppBreadcrumb() {
  const { pathname } = useLocation()
  const editMatch = matchPath({ path: '/productos/:productId', end: true }, pathname)
  const productId = Number(editMatch?.params.productId)
  const isProductEdit = Number.isInteger(productId) && productId > 0
  const productQuery = useGetProduct(isProductEdit ? productId : 0)
  const entries = breadcrumbEntries(pathname, isProductEdit ? productQuery.data?.nombre_producto : undefined)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {entries.map((entry, index) => {
          const isCurrent = index === entries.length - 1

          return (
            <Fragment key={`${entry.label}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isCurrent || !entry.to ? (
                  <BreadcrumbPage>{entry.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink to={entry.to}>{entry.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function breadcrumbEntries(pathname: string, productName: string | undefined): BreadcrumbEntry[] {
  if (pathname === '/productos/nuevo') {
    return [
      { label: 'Productos', to: '/' },
      { label: 'Nuevo producto' },
    ]
  }

  if (pathname.startsWith('/productos/')) {
    return [
      { label: 'Productos', to: '/' },
      { label: productName ?? 'Editar producto' },
    ]
  }

  return [{ label: 'Productos' }]
}
