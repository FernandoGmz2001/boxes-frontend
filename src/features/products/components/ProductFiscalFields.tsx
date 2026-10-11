import { useState } from "react";
import { useFormContext } from "react-hook-form";
import FormComboboxField from "@/components/features/Form/FormComboboxField.tsx";
import { useGetProductServiceKey, useGetProductServiceKeys } from "@/features/product-service-keys/services/queries.ts";
import { useGetTaxObject, useGetTaxObjects } from "@/features/tax-objects/services/queries.ts";
import { useGetUnitKey, useGetUnitKeys } from "@/features/unit-keys/services/queries.ts";
import type { ProductSchema } from "../schemas/upsert.schema.ts";

interface CatalogOption {
  label: string;
  value: string;
}

function catalogOption(code: string, name: string): CatalogOption {
  return { value: code, label: `${code} · ${name}` };
}

function mergeSelectedOption(
  options: CatalogOption[],
  selected: CatalogOption | null,
) {
  if (selected == null) return options;
  if (options.some((option) => option.value === selected.value)) return options;
  return [selected, ...options];
}

function selectedOption(
  code: string,
  detail: { clave: string; name: string } | undefined,
) {
  if (code.length === 0) return null;
  if (detail == null) return { value: code, label: code };
  return catalogOption(detail.clave, detail.name);
}

function emptyMessage(isFetching: boolean) {
  return isFetching ? "Buscando…" : "Sin coincidencias.";
}

export default function ProductFiscalFields() {
  const { watch } = useFormContext<ProductSchema>();
  const [productKeySearch, setProductKeySearch] = useState("");
  const [unitKeySearch, setUnitKeySearch] = useState("");
  const [taxObjectSearch, setTaxObjectSearch] = useState("");
  const productKey = watch("clave_producto_servicio");
  const unitKey = watch("clave_unidad_medida");
  const taxObject = watch("objeto_impuesto");
  const productKeysQuery = useGetProductServiceKeys({
    pagina: 1,
    limite: 20,
    busqueda: productKeySearch || undefined,
  });
  const unitKeysQuery = useGetUnitKeys({
    pagina: 1,
    limite: 20,
    busqueda: unitKeySearch || undefined,
  });
  const taxObjectsQuery = useGetTaxObjects({
    pagina: 1,
    limite: 20,
    busqueda: taxObjectSearch || undefined,
  });
  const productKeyDetail = useGetProductServiceKey(productKey);
  const unitKeyDetail = useGetUnitKey(unitKey);
  const taxObjectDetail = useGetTaxObject(taxObject);
  const productKeyOptions = mergeSelectedOption(
    (productKeysQuery.data?.data ?? []).map((item) =>
      catalogOption(item.clave, item.descripcion),
    ),
    selectedOption(
      productKey,
      productKeyDetail.data
        ? {
            clave: productKeyDetail.data.clave,
            name: productKeyDetail.data.descripcion,
          }
        : undefined,
    ),
  );
  const unitKeyOptions = mergeSelectedOption(
    (unitKeysQuery.data?.data ?? []).map((item) =>
      catalogOption(item.clave, item.nombre),
    ),
    selectedOption(
      unitKey,
      unitKeyDetail.data
        ? { clave: unitKeyDetail.data.clave, name: unitKeyDetail.data.nombre }
        : undefined,
    ),
  );
  const taxObjectOptions = mergeSelectedOption(
    (taxObjectsQuery.data?.data ?? []).map((item) =>
      catalogOption(item.clave, item.descripcion),
    ),
    selectedOption(
      taxObject,
      taxObjectDetail.data
        ? {
            clave: taxObjectDetail.data.clave,
            name: taxObjectDetail.data.descripcion,
          }
        : undefined,
    ),
  );

  return (
    <>
      <FormComboboxField
        name="clave_producto_servicio"
        label="Clave producto"
        options={productKeyOptions}
        placeholder="p. ej. 50202306 · Bebidas"
        emptyMessage={emptyMessage(productKeysQuery.isFetching)}
        emptyValue=""
        onQueryChange={setProductKeySearch}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormComboboxField
          name="clave_unidad_medida"
          label="Clave unidad"
          options={unitKeyOptions}
          placeholder="p. ej. H87 · Pieza"
          emptyMessage={emptyMessage(unitKeysQuery.isFetching)}
          emptyValue=""
          onQueryChange={setUnitKeySearch}
        />
        <FormComboboxField
          name="objeto_impuesto"
          label="Objeto de impuesto"
          options={taxObjectOptions}
          placeholder="p. ej. 02 · Sí objeto de impuesto"
          emptyMessage={emptyMessage(taxObjectsQuery.isFetching)}
          emptyValue=""
          onQueryChange={setTaxObjectSearch}
        />
      </div>
    </>
  );
}
