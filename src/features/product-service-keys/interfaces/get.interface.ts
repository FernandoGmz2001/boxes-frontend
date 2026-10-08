export interface IGetProductServiceKey {
  clave: string
  descripcion: string
  incluir_iva_trasladado: string
  incluir_ieps_trasladado: string
  fecha_inicio_vigencia: string
  fecha_fin_vigencia: string | null
}
