export interface IPaginationParams {
  pagina?: number
  limite?: number
}

export interface IPage<T> {
  data: T[]
  pagina: number
  limite: number
  total: number
  total_paginas: number
}
