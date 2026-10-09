export const QUERY_KEYS = {
  AUTH: {
    ALL: ['auth'] as const,
    LOGIN: ['auth', 'login'] as const,
  },
  CATEGORIES: {
    ALL: ['categories'] as const,
    LIST: (params: { pagina?: number; limite?: number }) => ['categories', 'list', params] as const,
    DETAIL: (categoryId: number) => ['categories', 'detail', categoryId] as const,
  },
  PRODUCTS: {
    ALL: ['products'] as const,
    LISTS: ['products', 'list'] as const,
    LIST: (params: { pagina?: number; limite?: number; activo?: boolean; busqueda?: string }) =>
      ['products', 'list', params] as const,
    DETAIL: (productId: number) => ['products', 'detail', productId] as const,
  },
  PRODUCT_TAXES: {
    ALL: ['product-taxes'] as const,
    LIST: (productId: number, params: { pagina?: number; limite?: number }) =>
      ['product-taxes', productId, 'list', params] as const,
    DETAIL: (productId: number, productTaxId: number) =>
      ['product-taxes', productId, 'detail', productTaxId] as const,
  },
  TAXES: {
    ALL: ['taxes'] as const,
    LIST: (params: { pagina?: number; limite?: number }) => ['taxes', 'list', params] as const,
    DETAIL: (taxId: number) => ['taxes', 'detail', taxId] as const,
  },
  MOVEMENTS: {
    ALL: ['movements'] as const,
    LIST: (params: { pagina?: number; limite?: number; producto_id?: number; usuario_id?: number }) =>
      ['movements', 'list', params] as const,
    DETAIL: (movementId: number) => ['movements', 'detail', movementId] as const,
  },
  PRODUCT_SERVICE_KEYS: {
    ALL: ['product-service-keys'] as const,
    LIST: (params: { pagina?: number; limite?: number; busqueda?: string }) =>
      ['product-service-keys', 'list', params] as const,
    DETAIL: (key: string) => ['product-service-keys', 'detail', key] as const,
  },
  UNIT_KEYS: {
    ALL: ['unit-keys'] as const,
    LIST: (params: { pagina?: number; limite?: number; busqueda?: string }) => ['unit-keys', 'list', params] as const,
    DETAIL: (key: string) => ['unit-keys', 'detail', key] as const,
  },
  TAX_OBJECTS: {
    ALL: ['tax-objects'] as const,
    LIST: (params: { pagina?: number; limite?: number; busqueda?: string }) => ['tax-objects', 'list', params] as const,
    DETAIL: (key: string) => ['tax-objects', 'detail', key] as const,
  },
} as const
