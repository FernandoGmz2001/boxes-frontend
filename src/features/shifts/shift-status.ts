import type { ShiftStatus } from '@/features/pos/interfaces/shifts/get.interface.ts'

export const SHIFT_STATUS_FILTERS = ['all', 'Abierto', 'Cerrado'] as const

export type ShiftStatusFilter = (typeof SHIFT_STATUS_FILTERS)[number]

export const SHIFT_STATUS_FILTER_LABELS: Record<ShiftStatusFilter, string> = {
  all: 'Todos',
  Abierto: 'Abiertos',
  Cerrado: 'Cerrados',
}

export function toShiftStatusParam(filter: ShiftStatusFilter): ShiftStatus | undefined {
  return filter === 'all' ? undefined : filter
}
