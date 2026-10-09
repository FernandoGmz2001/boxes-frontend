import { Controller, FormProvider } from "react-hook-form";
import FormCheckboxField from "@/components/features/Form/FormCheckboxField.tsx";
import FormCheckboxGroupField from "@/components/features/Form/FormCheckboxGroupField.tsx";
import FormComboboxField from "@/components/features/Form/FormComboboxField.tsx";
import FormNumberField from "@/components/features/Form/FormNumberField.tsx";
import FormTextField from "@/components/features/Form/FormTextField.tsx";
import PageHeader from "@/components/features/PageHeader/PageHeader.tsx";
import SaveFooter from "@/components/features/SaveFooter/SaveFooter.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  useCreateCategory,
  useGetCategories,
} from "@/features/categories/services/queries.ts";
import { useGetTaxes } from "@/features/taxes/services/queries.ts";
import { useProductForm } from "../hooks/useProductForm.ts";
import type { IGetProduct } from "../interfaces/get.interface.ts";
import ProductImageField from "./ProductImageField.tsx";

interface ProductFormProps {
  product: IGetProduct | null;
  onClose: () => void;
  embedded?: boolean;
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
  const { mutateAsync: createCategory } = useCreateCategory();
  const taxesQuery = useGetTaxes({ pagina: 1, limite: 100 });
  const categories = categoriesQuery.data?.data ?? [];
  const taxes = taxesQuery.data?.data ?? [];
  const categoryItems = categories.map((category) => ({
    label: category.nombre,
    value: String(category.id),
  }));
  const productName = form.watch("nombre_producto");

  return (
    <FormProvider {...form}>
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
                <Controller
                  name="imagen_url"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <ProductImageField
                      name={productName || "Producto"}
                      value={field.value}
                      invalid={fieldState.invalid}
                      error={fieldState.error}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />

                <FormTextField
                  name="nombre_producto"
                  label="Nombre del producto"
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormNumberField
                    name="precio_venta"
                    label="Precio de venta"
                    required
                    prefix="$"
                    min={0}
                    step="0.01"
                  />
                  <FormNumberField
                    name="costo_compra"
                    label="Costo"
                    required
                    prefix="$"
                    min={0}
                    step="0.01"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormNumberField
                    name="cantidad_en_existencia"
                    label="Unidades"
                    required
                    min={0}
                    step={1}
                    disabled={isEditing}
                    description={
                      isEditing ? "Cambia con un movimiento." : undefined
                    }
                  />
                  <FormNumberField
                    name="stock_minimo"
                    label="Alerta de unidades bajas"
                    required
                    min={0}
                    step={1}
                    description="Aviso cuando queden estas unidades o menos."
                  />
                </div>

                <FormComboboxField
                  name="id_categoria"
                  label="Categoría"
                  required
                  options={categoryItems}
                  placeholder="Selecciona una categoría"
                  emptyValue={0}
                  valueAsNumber
                  onCreate={async (nombre) => {
                    const category = await createCategory({ nombre });
                    return category.id;
                  }}
                  footer={
                    !categoriesQuery.isLoading && categories.length === 0 ? (
                      <Alert>
                        <AlertDescription>
                          No hay categorías. Crea una antes de guardar el
                          producto.
                        </AlertDescription>
                      </Alert>
                    ) : null
                  }
                />

                <FormCheckboxField name="es_servicio" label="Es servicio" />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4 md:col-span-2">
              <Card className="min-h-min">
                <CardHeader>
                  <CardTitle>Más detalles</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <FormTextField name="sku" label="SKU" />
                  <FormTextField
                    name="codigo_barras"
                    label="Código"
                    placeholder="Escanea o escribe el código del producto"
                  />
                  <FormCheckboxGroupField
                    name="impuesto_preset_ids"
                    legend="Impuesto"
                    listClassName="max-h-40 overflow-y-auto pr-2 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]"
                    options={taxes.map((tax) => ({
                      value: tax.id,
                      label: `${tax.impuesto} · ${tax.factor} · ${tax.valor_maximo}`,
                    }))}
                  />
                </CardContent>
              </Card>

              <Card className="min-h-min">
                <CardHeader>
                  <CardTitle>Datos fiscales</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <FormTextField
                    name="clave_producto_servicio"
                    label="Clave producto"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormTextField
                      name="clave_unidad_medida"
                      label="Clave unidad"
                    />
                    <FormTextField
                      name="objeto_impuesto"
                      label="Objeto de impuesto"
                    />
                  </div>
                  <FormCheckboxField
                    name="activo"
                    label="Activo en el inventario"
                    className="rounded-lg border p-3"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <SaveFooter
          type="submit"
          label="Guardar"
          savingLabel="Guardando…"
          isSaving={isSubmitting}
          disabled={categories.length === 0}
        />
      </form>
    </FormProvider>
  );
}
