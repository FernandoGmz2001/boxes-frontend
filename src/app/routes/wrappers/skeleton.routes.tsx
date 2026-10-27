import type { ComponentType } from 'react'
import PosSkeleton from '@/features/pos/components/Skeletons/PosSkeleton.tsx'
import ShiftDetailSkeleton from '@/features/shifts/components/Skeletons/ShiftDetailSkeleton.tsx'
import ShiftsSkeleton from '@/features/shifts/components/Skeletons/ShiftsSkeleton.tsx'
import { ROUTES } from '../routes.constants.ts'

export const SKELETON_ROUTES: Partial<Record<string, ComponentType>> = {
  [ROUTES.POS]: PosSkeleton,
  [ROUTES.SHIFTS]: ShiftsSkeleton,
  [ROUTES.SHIFT_DETAIL]: ShiftDetailSkeleton,
}
