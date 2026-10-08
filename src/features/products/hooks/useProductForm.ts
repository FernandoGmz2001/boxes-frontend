import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { ICreateProduct } from '../interfaces/create.interface.ts'
import type { IGetProduct } from '../interfaces/get.interface.ts'
import type { IUpdateProduct } from '../interfaces/update.interface.ts'
import { productSchema } from '../schemas/upsert.schema.ts'
import type { ProductSchema } from '../schemas/upsert.schema.ts'
import { useCreateProduct, useUpdateProduct } from '../services/queries.ts'

const emptyValues: ProductSchema = {
  nombre_producto: '',
  imagen_url: '',
  cantidad_en_existencia: 0,
  stock_minimo: 0,
  sku: '',
  codigo_barras: '',
  precio_venta: 0,
  costo_compra: 0,
  es_servicio: false,
  activo: true,
  id_categoria: 0,
  clave_producto_servicio: '',
  clave_unidad_medida: '',
  objeto_impuesto: '',
  impuesto_preset_ids: [],
}

function toFormValues(product: IGetProduct): ProductSchema {
  return {
    nombre_producto: product.nombre_producto,
    imagen_url: product.imagen_url ?? '',
    cantidad_en_existencia: product.cantidad_en_existencia,
    stock_minimo: product.stock_minimo,
    sku: product.sku ?? '',
    codigo_barras: product.codigo_barras ?? '',
    precio_venta: Number(product.precio_venta),
    costo_compra: Number(product.costo_compra),
    es_servicio: product.es_servicio,
    activo: product.activo,
    id_categoria: product.id_categoria,
    clave_producto_servicio: product.clave_producto_servicio ?? '',
    clave_unidad_medida: product.clave_unidad_medida ?? '',
    objeto_impuesto: product.objeto_impuesto ?? '',
    impuesto_preset_ids: product.impuestos,
  }
}

function textOrNull(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function buildCreatePayload(values: ProductSchema): ICreateProduct {
  const imagenUrl = textOrNull(values.imagen_url)
  const sku = textOrNull(values.sku)
  const barcode = textOrNull(values.codigo_barras)
  const productServiceKey = textOrNull(values.clave_producto_servicio)
  const unitKey = textOrNull(values.clave_unidad_medida)
  const taxObject = textOrNull(values.objeto_impuesto)

  return {
    nombre_producto: values.nombre_producto,
    cantidad_en_existencia: values.cantidad_en_existencia,
    stock_minimo: values.stock_minimo,
    precio_venta: values.precio_venta,
    costo_compra: values.costo_compra,
    es_servicio: values.es_servicio,
    activo: values.activo,
    id_categoria: values.id_categoria,
    ...(imagenUrl ? { imagen_url: imagenUrl } : {}),
    ...(sku ? { sku } : {}),
    ...(barcode ? { codigo_barras: barcode } : {}),
    ...(productServiceKey ? { clave_producto_servicio: productServiceKey } : {}),
    ...(unitKey ? { clave_unidad_medida: unitKey } : {}),
    ...(taxObject ? { objeto_impuesto: taxObject } : {}),
    ...(values.impuesto_preset_ids.length > 0 ? { impuesto_preset_ids: values.impuesto_preset_ids } : {}),
  }
}

function buildUpdatePayload(values: ProductSchema): IUpdateProduct {
  return {
    nombre_producto: values.nombre_producto,
    imagen_url: textOrNull(values.imagen_url),
    stock_minimo: values.stock_minimo,
    sku: textOrNull(values.sku),
    codigo_barras: textOrNull(values.codigo_barras),
    precio_venta: values.precio_venta,
    costo_compra: values.costo_compra,
    es_servicio: values.es_servicio,
    activo: values.activo,
    id_categoria: values.id_categoria,
    clave_producto_servicio: textOrNull(values.clave_producto_servicio),
    clave_unidad_medida: textOrNull(values.clave_unidad_medida),
    objeto_impuesto: textOrNull(values.objeto_impuesto),
    impuesto_preset_ids: values.impuesto_preset_ids,
  }
}

export function useProductForm(product: IGetProduct | null, onSaved: () => void) {
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct()

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? toFormValues(product) : emptyValues,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (product) {
      await updateProduct({ productId: product.id, payload: buildUpdatePayload(values) })
    } else {
      await createProduct(buildCreatePayload(values))
    }

    onSaved()
  })

  return {
    form,
    onSubmit,
    isEditing: product !== null,
    isSubmitting: isCreating || isUpdating,
  }
}
