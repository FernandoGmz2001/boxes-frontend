import { Controller } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useGetCategories } from "@/features/categories/services/queries.ts";
import { useGetTaxes } from "@/features/taxes/services/queries.ts";
import type { IGetProduct } from "../interfaces/get.interface.ts";
import { useProductForm } from "../hooks/useProductForm.ts";
import ProductImage from "./ProductImage.tsx";
import PageHeader from "@/components/features/PageHeader/PageHeader.tsx";

interface ProductFormProps {
  product: IGetProduct | null;
  onClose: () => void;
  embedded?: boolean;
}

interface CategoryOption {
  label: string;
  value: string | null;
}

export default function ProductForm({
  product,
  onClose,
  embedded = false,
}: ProductFormProps) {
  const { form, onSubmit, isEditing, isSubmitting } = useProductForm(
    product,
    onClose,
  );
  const categoriesQuery = useGetCategories({ pagina: 1, limite: 100 });
  const taxesQuery = useGetTaxes({ pagina: 1, limite: 100 });
  const categories = categoriesQuery.data?.data ?? [];
  const taxes = taxesQuery.data?.data ?? [];
  const categoryItems: CategoryOption[] = [
    { label: "Selecciona una categoría", value: null },
    ...categories.map((category) => ({
      label: category.nombre,
      value: String(category.id),
    })),
  ];
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;
  const imageUrl = watch("imagen_url");
  const productName = watch("nombre_producto");

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto px-4 py-6 md:px-6">
        {embedded ? null : (
          <PageHeader
            title={isEditing ? "Editar producto" : "Nuevo producto"}
            subtitle={
              isEditing
                ? "Actualiza los datos del producto."
                : "Completa los datos del producto."
            }
            back
          />
        )}
        <div className="grid content-start items-start gap-4 md:grid-cols-5">
          <Card className="min-h-min md:col-span-3">
            <CardHeader>
              <CardTitle>Información básica</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <ProductImage
                  className="size-24"
                  src={imageUrl || null}
                  name={productName || "Producto"}
                />
                <Field
                  className="min-w-0 flex-1"
                  data-invalid={errors.imagen_url ? true : undefined}
                >
                  <FieldLabel htmlFor="imagen_url">Imagen</FieldLabel>
                  <Input
                    id="imagen_url"
                    type="url"
                    placeholder="https://…"
                    aria-invalid={errors.imagen_url ? true : undefined}
                    {...register("imagen_url")}
                  />
                  <FieldError errors={[errors.imagen_url]} />
                </Field>
              </div>

              <Field data-invalid={errors.nombre_producto ? true : undefined}>
                <FieldLabel htmlFor="nombre_producto">
                  Nombre del producto
                </FieldLabel>
                <Input
                  id="nombre_producto"
                  aria-invalid={errors.nombre_producto ? true : undefined}
                  {...register("nombre_producto")}
                />
                <FieldError errors={[errors.nombre_producto]} />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={errors.precio_venta ? true : undefined}>
                  <FieldLabel htmlFor="precio_venta">
                    Precio de venta
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">$</InputGroupAddon>
                    <InputGroupInput
                      id="precio_venta"
                      type="number"
                      min={0}
                      step="0.01"
                      aria-invalid={errors.precio_venta ? true : undefined}
                      {...register("precio_venta", { valueAsNumber: true })}
                    />
                  </InputGroup>
                  <FieldError errors={[errors.precio_venta]} />
                </Field>
                <Field data-invalid={errors.costo_compra ? true : undefined}>
                  <FieldLabel htmlFor="costo_compra">Costo</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">$</InputGroupAddon>
                    <InputGroupInput
                      id="costo_compra"
                      type="number"
                      min={0}
                      step="0.01"
                      aria-invalid={errors.costo_compra ? true : undefined}
                      {...register("costo_compra", { valueAsNumber: true })}
                    />
                  </InputGroup>
                  <FieldError errors={[errors.costo_compra]} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  data-invalid={
                    errors.cantidad_en_existencia ? true : undefined
                  }
                  data-disabled={isEditing ? true : undefined}
                >
                  <FieldLabel htmlFor="cantidad_en_existencia">
                    Unidades
                  </FieldLabel>
                  <Input
                    id="cantidad_en_existencia"
                    type="number"
                    min={0}
                    step={1}
                    disabled={isEditing}
                    aria-invalid={
                      errors.cantidad_en_existencia ? true : undefined
                    }
                    {...register("cantidad_en_existencia", {
                      valueAsNumber: true,
                    })}
                  />
                  {isEditing ? (
                    <FieldDescription>
                      Cambia con un movimiento.
                    </FieldDescription>
                  ) : null}
                  <FieldError errors={[errors.cantidad_en_existencia]} />
                </Field>
                <Field data-invalid={errors.stock_minimo ? true : undefined}>
                  <FieldLabel htmlFor="stock_minimo">
                    Alerta de unidades bajas
                  </FieldLabel>
                  <Input
                    id="stock_minimo"
                    type="number"
                    min={0}
                    step={1}
                    aria-invalid={errors.stock_minimo ? true : undefined}
                    {...register("stock_minimo", { valueAsNumber: true })}
                  />
                  <FieldDescription>
                    Aviso cuando queden estas unidades o menos.
                  </FieldDescription>
                  <FieldError errors={[errors.stock_minimo]} />
                </Field>
              </div>

              <Field data-invalid={errors.id_categoria ? true : undefined}>
                <FieldLabel>Categoría</FieldLabel>
                <Controller
                  name="id_categoria"
                  control={control}
                  render={({ field }) => (
                    <Select
                      items={categoryItems}
                      value={field.value > 0 ? String(field.value) : null}
                      onValueChange={(value) =>
                        field.onChange(value == null ? 0 : Number(value))
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={errors.id_categoria ? true : undefined}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categoryItems.map((item) => (
                            <SelectItem
                              key={item.value ?? "empty"}
                              value={item.value}
                            >
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
                    <AlertDescription>
                      No hay categorías. Crea una antes de guardar el producto.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </Field>

              <Controller
                name="es_servicio"
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="es_servicio"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="es_servicio">Es servicio</FieldLabel>
                  </Field>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 md:col-span-2">
            <Card className="min-h-min">
              <CardHeader>
                <CardTitle>Más detalles</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Field>
                  <FieldLabel htmlFor="sku">SKU</FieldLabel>
                  <Input id="sku" {...register("sku")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="codigo_barras">Código</FieldLabel>
                  <Input
                    id="codigo_barras"
                    placeholder="Escanea o escribe el código del producto"
                    {...register("codigo_barras")}
                  />
                </Field>
                <FieldSet>
                  <FieldLegend variant="label">Impuesto</FieldLegend>
                  <Controller
                    name="impuesto_preset_ids"
                    control={control}
                    render={({ field }) => (
                      <div className="max-h-40 overflow-y-auto pr-2 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]">
                        <FieldGroup>
                          {taxes.map((tax) => {
                            const checked = field.value.includes(tax.id);
                            const taxFieldId = `impuesto-${tax.id}`;

                            return (
                              <Field key={tax.id} orientation="horizontal">
                                <Checkbox
                                  id={taxFieldId}
                                  checked={checked}
                                  onCheckedChange={(nextChecked) => {
                                    field.onChange(
                                      nextChecked
                                        ? [...field.value, tax.id]
                                        : field.value.filter(
                                            (taxId) => taxId !== tax.id,
                                          ),
                                    );
                                  }}
                                />
                                <FieldLabel htmlFor={taxFieldId}>
                                  {tax.impuesto} · {tax.factor} ·{" "}
                                  {tax.valor_maximo}
                                </FieldLabel>
                              </Field>
                            );
                          })}
                        </FieldGroup>
                      </div>
                    )}
                  />
                </FieldSet>
              </CardContent>
            </Card>

            <Card className="min-h-min">
              <CardHeader>
                <CardTitle>Datos fiscales</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Field>
                  <FieldLabel htmlFor="clave_producto_servicio">
                    Clave producto
                  </FieldLabel>
                  <Input
                    id="clave_producto_servicio"
                    {...register("clave_producto_servicio")}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="clave_unidad_medida">
                      Clave unidad
                    </FieldLabel>
                    <Input
                      id="clave_unidad_medida"
                      {...register("clave_unidad_medida")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="objeto_impuesto">
                      Objeto de impuesto
                    </FieldLabel>
                    <Input
                      id="objeto_impuesto"
                      {...register("objeto_impuesto")}
                    />
                  </Field>
                </div>
                <Controller
                  name="activo"
                  control={control}
                  render={({ field }) => (
                    <Field
                      orientation="horizontal"
                      className="rounded-lg border p-3"
                    >
                      <Checkbox
                        id="activo"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel htmlFor="activo">
                        Activo en el inventario
                      </FieldLabel>
                    </Field>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <footer>
        <Separator />
        <div className="flex items-center justify-end px-6 py-3">
          <Button
            type="submit"
            disabled={isSubmitting || categories.length === 0}
          >
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            {isSubmitting ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </footer>
    </form>
  );
}
