import { api } from '@/shared/api/client.ts'
import type { ILoginRequest, ILoginResponse } from '../interfaces/login.interface.ts'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseUserId(value: unknown) {
  if (typeof value === 'number' && Number.isInteger(value)) return value
  if (typeof value === 'string' && value.trim() && Number.isInteger(Number(value))) return Number(value)
  return null
}

function parseLoginResponse(payload: unknown): ILoginResponse {
  if (!isRecord(payload) || typeof payload.access_token !== 'string' || !payload.access_token || !isRecord(payload.usuario)) {
    throw new Error('La respuesta de inicio de sesión no es válida')
  }

  const userId = parseUserId(payload.usuario.id)

  if (userId === null) {
    throw new Error('La respuesta de inicio de sesión no es válida')
  }

  return {
    access_token: payload.access_token,
    usuario: { id: userId },
  }
}

export async function login(payload: ILoginRequest) {
  const response = await api.post<unknown>('/auth/login', payload)
  return parseLoginResponse(response.data)
}
