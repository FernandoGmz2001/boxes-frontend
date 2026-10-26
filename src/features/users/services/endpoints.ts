import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { ICreateUser } from '../interfaces/create.interface.ts'
import type { IGetAllUsers, IGetAllUsersParams } from '../interfaces/get-all.interface.ts'
import type { IGetUser } from '../interfaces/get.interface.ts'
import type { IUpdateUser } from '../interfaces/update.interface.ts'

export async function getUsers(params: IGetAllUsersParams) {
  try {
    const response = await api.get<IGetAllUsers>('/usuarios', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener los usuarios')
  }
}

export async function getUser(userId: number) {
  try {
    const response = await api.get<IGetUser>(`/usuarios/${userId}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener el usuario')
  }
}

export async function createUser(payload: ICreateUser) {
  const response = await api.post<IGetUser>('/usuarios', payload)
  return response.data
}

export async function updateUser(userId: number, payload: IUpdateUser) {
  const response = await api.patch<IGetUser>(`/usuarios/${userId}`, payload)
  return response.data
}
