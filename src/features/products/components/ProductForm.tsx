import { Controller } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import { useGetCategories } from '@/features/categories/services/queries.ts'
import { useGetTaxes } from '@/features/taxes/services/queries.ts'
import type { IGetProduct } from '../interfaces/get.interface.ts'
import { useProductForm } from '../hooks/useProductForm.ts'

interface ProductFormProps {
  product: IGetProduct | null
  onClose: () => void
}

interface CategoryOption {
  label: string
  value: string | null
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { form, onSubmit, isEditing, isSubmitting } = useProductForm(product, onClose)
  const categoriesQuery = useGetCategories({ pagina: 1, limite: 100 })
  const taxesQuery = useGetTaxes({ pagina: 1, limite: 100 })
  const categories = categoriesQuery.data?.data ?? []
  const taxes = taxesQuery.data?.data ?? []
  const categoryItems: CategoryOption[] = [
    { label: 'Selecciona una categoría', value: null },
    ...categories.map((category) => ({ label: category.nombre, value: String(category.id) })),
  ]
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={errors.nombre_producto ? true : undefined}>
          <FieldLabel htmlFor="nombre_producto">Nombre</FieldLabel>
          <Input id="nombre_producto" aria-invalid={errors.nombre_producto ? true : undefined} {...register('nombre_producto')} />
          <FieldError errors={[errors.nombre_producto]} />
        </Field>

        <Field data-invalid={errors.id_categoria ? true : undefined}>
          <FieldLabel>Categoría</FieldLabel>
          <Controller
            name="id_categoria"
            control={control}
            render={({ field }) => (
              <Select
                items={categoryItems}
                value={field.value > 0 ? String(field.value) : null}
                onValueChange={(value) => field.onChange(value == null ? 0 : Number(value))}
              >
                <SelectTrigger className="w-full" aria-invalid={errors.id_categoria ? true : undefined}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categoryItems.map((item) => (
                      <SelectItem key={item.value ?? 'empty'} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.id_categoria]} />
          {!categoriesQuery.isLoading && categories.length === 0 ? (
            <Alert>
              <AlertDescription>No hay categorías. Crea una antes de guardar el producto.</AlertDescription>
            </Alert>
          ) : null}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={errors.cantidad_en_existencia ? true : undefined} data-disabled={isEditing ? true : undefined}>
            <FieldLabel htmlFor="cantidad_en_existencia">Existencia</FieldLabel>
            <Input
              id="cantidad_en_existencia"
              type="number"
              min={0}
              step={1}
              disabled={isEditing}
              aria-invalid={errors.cantidad_en_existencia ? true : undefined}
              {...register('cantidad_en_existencia', { valueAsNumber: true })}
            />
            {isEditing ? <FieldDescription>Cambia con un movimiento.</FieldDescription> : null}
            <FieldError errors={[errors.cantidad_en_existencia]} />
          </Field>
          <Field data-invalid={errors.stock_minimo ? true : undefined}>
            <FieldLabel htmlFor="stock_minimo">Stock mínimo</FieldLabel>
            <Input
              id="stock_minimo"
              type="number"
              min={0}
              step={1}
              aria-invalid={errors.stock_minimo ? true : undefined}
              {...register('stock_minimo', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.stock_minimo]} />
          </Field>
          <Field data-invalid={errors.precio_venta ? true : undefined}>
            <FieldLabel htmlFor="precio_venta">Precio de venta</FieldLabel>
            <Input
              id="precio_venta"
              type="number"
              min={0}
              step="0.01"
              aria-invalid={errors.precio_venta ? true : undefined}
              {...register('precio_venta', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.precio_venta]} />
          </Field>
          <Field data-invalid={errors.costo_compra ? true : undefined}>
            <FieldLabel htmlFor="costo_compra">Costo de compra</FieldLabel>
            <Input
              id="costo_compra"
              type="number"
              min={0}
              step="0.01"
              aria-invalid={errors.costo_compra ? true : undefined}
              {...register('costo_compra', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.costo_compra]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="sku">SKU</FieldLabel>
            <Input id="sku" {...register('sku')} />
          </Field>
          <Field>
            <FieldLabel htmlFor="codigo_barras">Código de barras</FieldLabel>
            <Input id="codigo_barras" {...register('codigo_barras')} />
          </Field>
        </div>

        <Field data-invalid={errors.imagen_url ? true : undefined}>
          <FieldLabel htmlFor="imagen_url">URL de imagen</FieldLabel>
          <Input id="imagen_url" type="url" aria-invalid={errors.imagen_url ? true : undefined} {...register('imagen_url')} />
          <FieldError errors={[errors.imagen_url]} />
        </Field>

        <FieldSet>
          <FieldLegend variant="label">Opciones</FieldLegend>
          <FieldGroup>
            <Controller
              name="es_servicio"
              control={control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Checkbox id="es_servicio" checked={field.value} onCheckedChange={field.onChange} />
                  <FieldLabel htmlFor="es_servicio">Es servicio</FieldLabel>
                </Field>
              )}
            />
            <Controller
              name="activo"
              control={control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Checkbox id="activo" checked={field.value} onCheckedChange={field.onChange} />
                  <FieldLabel htmlFor="activo">Activo</FieldLabel>
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <Collapsible className="flex flex-col gap-4">
          <CollapsibleTrigger render={<Button type="button" variant="outline" className="w-fit" />}>
            Datos fiscales
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="clave_producto_servicio">Clave producto</FieldLabel>
                <Input id="clave_producto_servicio" {...register('clave_producto_servicio')} />
              </Field>
              <Field>
                <FieldLabel htmlFor="clave_unidad_medida">Clave unidad</FieldLabel>
                <Input id="clave_unidad_medida" {...register('clave_unidad_medida')} />
              </Field>
              <Field>
                <FieldLabel htmlFor="objeto_impuesto">Objeto de impuesto</FieldLabel>
                <Input id="objeto_impuesto" {...register('objeto_impuesto')} />
              </Field>
            </div>
            <FieldSet>
              <FieldLegend variant="label">Impuestos</FieldLegend>
              <Controller
                name="impuesto_preset_ids"
                control={control}
                render={({ field }) => (
                  <ScrollArea className="h-36">
                    <FieldGroup>
                      {taxes.map((tax) => {
                        const checked = field.value.includes(tax.id)
                        const taxFieldId = `impuesto-${tax.id}`

                        return (
                          <Field key={tax.id} orientation="horizontal">
                            <Checkbox
                              id={taxFieldId}
                              checked={checked}
                              onCheckedChange={(nextChecked) => {
                                field.onChange(
                                  nextChecked ? [...field.value, tax.id] : field.value.filter((taxId) => taxId !== tax.id),
                                )
                              }}
                            />
                            <FieldLabel htmlFor={taxFieldId}>
                              {tax.impuesto} · {tax.factor} · {tax.valor_maximo}
                            </FieldLabel>
                          </Field>
                        )
                      })}
                    </FieldGroup>
                  </ScrollArea>
                )}
              />
            </FieldSet>
          </CollapsibleContent>
        </Collapsible>
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting || categories.length === 0}>
        {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
        {isSubmitting ? 'Guardando…' : 'Guardar'}
      </Button>
    </form>
  )
}
