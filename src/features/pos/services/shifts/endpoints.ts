import axios from 'axios'
import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { ICierreTurno, ICloseShift } from '../../interfaces/shifts/close.interface.ts'
import type { ICorteTurno } from '../../interfaces/shifts/corte.interface.ts'
import type { ICreateCashMovement } from '../../interfaces/shifts/create-movement.interface.ts'
import type { IMovimientoCaja, ITurno, ITurnoDetalle } from '../../interfaces/shifts/get.interface.ts'
import type { IOpenShift } from '../../interfaces/shifts/open.interface.ts'

export async function getCurrentShift() {
  try {
    const response = await api.get<ITurno>('/turnos/actual')
    return response.data
  } catch (error) {
    // 404 es la respuesta normal cuando el usuario no tiene turno abierto.
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw handleApiError(error, 'No se pudo obtener tu turno')
  }
}

export async function getShift(shiftId: number) {
  try {
    const response = await api.get<ITurnoDetalle>(`/turnos/${shiftId}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener el turno')
  }
}

export async function getShiftCorte(shiftId: number) {
  try {
    const response = await api.get<ICorteTurno>(`/turnos/${shiftId}/corte`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener el corte del turno')
  }
}

export async function openShift(payload: IOpenShift) {
  const response = await api.post<ITurno>('/turnos', payload)
  return response.data
}

export async function createCashMovement(shiftId: number, payload: ICreateCashMovement) {
  const response = await api.post<IMovimientoCaja>(`/turnos/${shiftId}/movimientos`, payload)
  return response.data
}

export async function closeShift(shiftId: number, payload: ICloseShift) {
  const response = await api.post<ICierreTurno>(`/turnos/${shiftId}/cierre`, payload)
  return response.data
}
