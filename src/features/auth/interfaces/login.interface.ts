export interface ILoginRequest {
  email: string
  password: string
}

export interface ILoginUser {
  id: number
}

export interface ILoginResponse {
  access_token: string
  usuario: ILoginUser
}
