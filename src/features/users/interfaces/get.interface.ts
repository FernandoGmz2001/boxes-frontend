export interface IGetUserRole {
  id: number
  nombre: string
}

export interface IGetUser {
  id: number
  nombre: string
  email: string
  activo: boolean
  rol: IGetUserRole
}
