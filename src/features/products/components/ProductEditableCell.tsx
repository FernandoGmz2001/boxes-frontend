import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox.tsx";
import { Field, FieldError } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import type { IGetCategory } from "@/features/categories/interfaces/get.interface.ts";
import { formatMoney } from "../format-money.ts";
import type { ProductRowEditHandlers } from "../hooks/useProductRowEdit.ts";
import type { IGetProduct } from "../interfaces/get.interface.ts";

type ProductCellField =
  | "nombre_producto"
  | "id_categoria"
  | "cantidad_en_existencia"
  | "stock_minimo"
  | "costo_compra"
  | "precio_venta"
  | "ganancia";

interface ProductEditableCellProps extends ProductRowEditHandlers {
  product: IGetProduct;
  field: ProductCellField;
  categories: IGetCategory[];
}

export default function ProductEditableCell({
  product,
  field,
  categories,
  valuesFor,
  errorFor,
  setField,
  isSaving,
}: ProductEditableCellProps) {
  const values = valuesFor(product);

  if (field === "ganancia") {
    const sale = Number(values.precio_venta);
    const cost = Number(values.costo_compra);
    const profit = sale - cost;

    return (
      <span>{Number.isFinite(profit) ? formatMoney(String(profit)) : "—"}</span>
    );
  }

  const error = errorFor(product.id, field);
  const invalid = error ? true : undefined;

  if (field === "id_categoria") {
    const items = categories.map((category) => ({
      label: category.nombre,
      value: String(category.id),
    }));
    const hasCurrent = items.some(
      (item) => item.value === String(values.id_categoria),
    );
    const categoryItems =
      hasCurrent || values.id_categoria <= 0
        ? items
        : [
            ...items,
            { label: "Categoría actual", value: String(values.id_categoria) },
          ];
    const selectedCategory =
      categoryItems.find(
        (item) => item.value === String(values.id_categoria),
      ) ?? null;

    return (
      <Field data-invalid={invalid} data-disabled={isSaving ? true : undefined}>
        <Combobox
          items={categoryItems}
          value={selectedCategory}
          disabled={isSaving}
          isItemEqualToValue={(item, selected) => item.value === selected.value}
          onValueChange={(category) =>
            setField(
              product,
              "id_categoria",
              category == null ? 0 : Number(category.value),
            )
          }
        >
          <ComboboxInput
            className="w-full min-w-36"
            disabled={isSaving}
            aria-invalid={invalid}
            aria-label="Categoría"
            placeholder="Categoría"
          />
          <ComboboxContent>
            <ComboboxEmpty>No hay categorías.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <FieldError errors={error ? [{ message: error }] : []} />
      </Field>
    );
  }

  if (field === "costo_compra") {
    return (
      <Field data-invalid={invalid} data-disabled={isSaving ? true : undefined}>
        <InputGroup className="w-36">
          <InputGroupAddon align="inline-start">$</InputGroupAddon>
          <InputGroupInput
            inputMode="decimal"
            disabled={isSaving}
            aria-invalid={invalid}
            aria-label="Costo de compra"
            value={values.costo_compra}
            onChange={(event) =>
              setField(product, "costo_compra", event.target.value)
            }
          />
        </InputGroup>
        <FieldError errors={error ? [{ message: error }] : []} />
      </Field>
    );
  }

  if (field === "precio_venta") {
    return (
      <Field data-invalid={invalid} data-disabled={isSaving ? true : undefined}>
        <InputGroup className="w-36">
          <InputGroupAddon align="inline-start">$</InputGroupAddon>
          <InputGroupInput
            inputMode="decimal"
            disabled={isSaving}
            aria-invalid={invalid}
            aria-label="Precio de venta"
            value={values.precio_venta}
            onChange={(event) =>
              setField(product, "precio_venta", event.target.value)
            }
          />
        </InputGroup>
        <FieldError errors={error ? [{ message: error }] : []} />
      </Field>
    );
  }

  if (field === "cantidad_en_existencia") {
    return (
      <Field data-invalid={invalid} data-disabled={isSaving ? true : undefined}>
        <Input
          inputMode="numeric"
          disabled={isSaving}
          aria-invalid={invalid}
          aria-label="Existencia"
          value={values.cantidad_en_existencia}
          onChange={(event) =>
            setField(product, "cantidad_en_existencia", event.target.value)
          }
        />
        <FieldError errors={error ? [{ message: error }] : []} />
      </Field>
    );
  }

  if (field === "stock_minimo") {
    return (
      <Field data-invalid={invalid} data-disabled={isSaving ? true : undefined}>
        <Input
          className="w-20"
          inputMode="numeric"
          disabled={isSaving}
          aria-invalid={invalid}
          aria-label="Stock"
          value={values.stock_minimo}
          onChange={(event) =>
            setField(product, "stock_minimo", event.target.value)
          }
        />
        <FieldError errors={error ? [{ message: error }] : []} />
      </Field>
    );
  }

  return (
    <Field data-invalid={invalid} data-disabled={isSaving ? true : undefined}>
      <Input
        className="min-w-40"
        disabled={isSaving}
        aria-invalid={invalid}
        aria-label="Nombre del producto"
        value={values.nombre_producto}
        onChange={(event) =>
          setField(product, "nombre_producto", event.target.value)
        }
      />
      <FieldError errors={error ? [{ message: error }] : []} />
    </Field>
  );
}
