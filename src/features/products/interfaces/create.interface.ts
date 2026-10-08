export interface ICreateProduct {
  nombre_producto: string
  imagen_url?: string
  cantidad_en_existencia: number
  stock_minimo: number
  sku?: string
  codigo_barras?: string
  precio_venta: number
  costo_compra: number
  es_servicio: boolean
  activo?: boolean
  id_categoria: number
  clave_producto_servicio?: string
  clave_unidad_medida?: string
  objeto_impuesto?: string
  impuesto_preset_ids?: number[]
}
