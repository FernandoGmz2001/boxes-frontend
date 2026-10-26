export const USER_STATUSES = ['all', 'active', 'inactive'] as const

export type UserStatus = (typeof USER_STATUSES)[number]

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  all: 'Todos',
  active: 'Activos',
  inactive: 'Inactivos',
}

export function toActiveFilter(status: UserStatus) {
  return status === 'all' ? undefined : status === 'active'
}
