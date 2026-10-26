import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { ICreateRole } from '../interfaces/create.interface.ts'
import type { IGetAllRoles, IGetAllRolesParams } from '../interfaces/get-all.interface.ts'
import type { IGetRole } from '../interfaces/get.interface.ts'
import type { IUpdateRole } from '../interfaces/update.interface.ts'

export async function getRoles(params: IGetAllRolesParams) {
  try {
    const response = await api.get<IGetAllRoles>('/roles', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener los roles')
  }
}

export async function getRole(roleId: number) {
  try {
    const response = await api.get<IGetRole>(`/roles/${roleId}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener el rol')
  }
}

export async function createRole(payload: ICreateRole) {
  const response = await api.post<IGetRole>('/roles', payload)
  return response.data
}

export async function updateRole(roleId: number, payload: IUpdateRole) {
  const response = await api.patch<IGetRole>(`/roles/${roleId}`, payload)
  return response.data
}

export async function deleteRole(roleId: number) {
  await api.delete(`/roles/${roleId}`)
}
