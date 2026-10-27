export const QUERY_KEYS = {
  AUTH: {
    ALL: ['auth'] as const,
    LOGIN: ['auth', 'login'] as const,
    PROFILES: ['auth', 'profile'] as const,
    PROFILE: (userId: number) => ['auth', 'profile', userId] as const,
  },
  USERS: {
    ALL: ['users'] as const,
    LISTS: ['users', 'list'] as const,
    LIST: (params: { pagina?: number; limite?: number; busqueda?: string; activo?: boolean }) =>
      ['users', 'list', params] as const,
    DETAIL: (userId: number) => ['users', 'detail', userId] as const,
  },
  ROLES: {
    ALL: ['roles'] as const,
    LISTS: ['roles', 'list'] as const,
    LIST: (params: { pagina?: number; limite?: number; busqueda?: string }) => ['roles', 'list', params] as const,
    DETAIL: (roleId: number) => ['roles', 'detail', roleId] as const,
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
  POS: {
    ALL: ['pos'] as const,
    CASH_REGISTERS: (params: { pagina?: number; limite?: number; activa?: boolean }) =>
      ['pos', 'cash-registers', params] as const,
    CURRENT_SHIFT: ['pos', 'shifts', 'current'] as const,
    SHIFT_DETAIL: (shiftId: number) => ['pos', 'shifts', 'detail', shiftId] as const,
    SHIFT_CORTE: (shiftId: number) => ['pos', 'shifts', 'corte', shiftId] as const,
    SALES: ['pos', 'sales'] as const,
    SALE_LIST: (params: {
      pagina?: number
      limite?: number
      turno_id?: number
      folio?: string
      fecha_desde?: string
      fecha_hasta?: string
    }) => ['pos', 'sales', 'list', params] as const,
    SALE_DETAIL: (saleId: number) => ['pos', 'sales', 'detail', saleId] as const,
  },
  SHIFTS: {
    ALL: ['shifts'] as const,
    LIST: (params: {
      pagina?: number
      limite?: number
      caja_id?: number
      usuario_id?: number
      estado?: string
      fecha_desde?: string
      fecha_hasta?: string
    }) => ['shifts', 'list', params] as const,
  },
} as const
