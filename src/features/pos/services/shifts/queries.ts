import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { ICloseShift } from '../../interfaces/shifts/close.interface.ts'
import type { ICreateCashMovement } from '../../interfaces/shifts/create-movement.interface.ts'
import {
  closeShift,
  createCashMovement,
  getCurrentShift,
  getShift,
  getShiftCorte,
  openShift,
} from './endpoints.ts'

export function useGetCurrentShift() {
  return useQuery({
    queryKey: QUERY_KEYS.POS.CURRENT_SHIFT,
    queryFn: getCurrentShift,
    retry: false,
  })
}

export function useGetShift(shiftId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.POS.SHIFT_DETAIL(shiftId),
    queryFn: () => getShift(shiftId),
    enabled: shiftId > 0,
  })
}

export function useGetShiftCorte(shiftId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.POS.SHIFT_CORTE(shiftId),
    queryFn: () => getShiftCorte(shiftId),
    enabled: shiftId > 0,
  })
}

export function useOpenShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: openShift,
    onError: async (error) => {
      handleMutationError(error, 'No se pudo abrir el turno')
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POS.CURRENT_SHIFT })
      }
    },
    onSuccess: (shift) => {
      queryClient.setQueryData(QUERY_KEYS.POS.CURRENT_SHIFT, shift)
    },
  })
}

export function useCreateCashMovement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ shiftId, payload }: { shiftId: number; payload: ICreateCashMovement }) =>
      createCashMovement(shiftId, payload),
    onError: (error) => handleMutationError(error, 'No se pudo registrar el movimiento de caja'),
    onSuccess: async (movement) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POS.SHIFT_CORTE(movement.turno_id) }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POS.SHIFT_DETAIL(movement.turno_id) }),
      ])
    },
  })
}

export function useCloseShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ shiftId, payload }: { shiftId: number; payload: ICloseShift }) => closeShift(shiftId, payload),
    onError: (error) => handleMutationError(error, 'No se pudo cerrar el turno'),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POS.ALL })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SHIFTS.ALL })
    },
  })
}
