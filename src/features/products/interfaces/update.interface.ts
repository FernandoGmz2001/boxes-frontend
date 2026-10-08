export interface IUpdateProduct {
  nombre_producto?: string
  imagen_url?: string | null
  stock_minimo?: number
  sku?: string | null
  codigo_barras?: string | null
  precio_venta?: number
  costo_compra?: number
  es_servicio?: boolean
  activo?: boolean
  id_categoria?: number
  clave_producto_servicio?: string | null
  clave_unidad_medida?: string | null
  objeto_impuesto?: string | null
  impuesto_preset_ids?: number[]
}
