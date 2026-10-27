import { useEffect, useEffectEvent, useState, type KeyboardEvent, type RefObject } from "react";
import { PackageSearchIcon } from "lucide-react";
import { cn } from "cn";
import SearchField from "@/components/features/SearchInput/SearchField.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card } from "@/components/ui/card.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import ProductImage from "@/features/products/components/ProductImage.tsx";
import { formatMoney } from "@/features/products/format-money.ts";
import { getShortcutModifierLabel, isCommandKShortcut } from "@/shared/helpers/keyboard-shortcuts.ts";
import { maxQuantityFor, type CartAddResult, type CartProduct } from "../../hooks/useCart.ts";
import { useProductSearch } from "../../hooks/useProductSearch.ts";

interface ProductSearchProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onAdd: (product: CartProduct) => CartAddResult;
}

export default function ProductSearch({ inputRef, onAdd }: ProductSearchProps) {
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const { search, setSearch, clearSearch, findExactMatch, products, isLoading, isFetching, isError } =
    useProductSearch();
  const highlightedIndex = products.findIndex((product) => product.id === highlightedId);

  const addProduct = (product: CartProduct) => {
    if (onAdd(product) === "added") {
      clearSearch();
      setHighlightedId(null);
    }
    inputRef.current?.focus();
  };

  const moveHighlight = (step: number) => {
    if (products.length === 0) return;
    const nextIndex = highlightedIndex === -1 ? (step > 0 ? 0 : products.length - 1) : highlightedIndex + step;
    setHighlightedId(products[(nextIndex + products.length) % products.length].id);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Escape") {
      clearSearch();
      setHighlightedId(null);
      return;
    }

    if (event.key !== "Enter") return;
    event.preventDefault();

    if (highlightedIndex >= 0) {
      addProduct(products[highlightedIndex]);
      return;
    }

    const code = event.currentTarget.value.trim();
    if (!code) return;

    const match = await findExactMatch(code);
    if (match) addProduct(match);
  };

  const focusSearch = useEffectEvent(() => {
    inputRef.current?.focus();
  });

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || !isCommandKShortcut(event)) return;
      event.preventDefault();
      focusSearch();
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <SearchField
        ref={inputRef}
        autoFocus
        value={search}
        placeholder="Escanea o busca por nombre, SKU o código de barras"
        aria-label="Buscar productos"
        shortcutKeys={[`${getShortcutModifierLabel()}K`]}
        onChange={(event) => {
          setSearch(event.target.value);
          setHighlightedId(null);
        }}
        onKeyDown={handleKeyDown}
      />
      {isError ? (
        <Alert variant="destructive">
          <AlertDescription>No se pudieron buscar los productos.</AlertDescription>
        </Alert>
      ) : null}
      <Card className={cn("min-h-0 flex-1 p-0", isFetching && "opacity-70")}>
        <ScrollArea className="h-full max-h-[calc(100svh-22rem)] min-h-48">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-3" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : null}
          {!isLoading && !isError && products.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-muted-foreground">
              <PackageSearchIcon className="size-6" />
              No hay productos que coincidan.
            </div>
          ) : null}
          <ul role="listbox" aria-label="Resultados de productos" className="flex flex-col p-1.5">
            {products.map((product) => {
              const outOfStock = maxQuantityFor(product) < 1;

              return (
                <li key={product.id} role="option" aria-selected={product.id === highlightedId}>
                  <button
                    type="button"
                    disabled={outOfStock}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
                      product.id === highlightedId && "bg-muted",
                    )}
                    onClick={() => addProduct(product)}
                  >
                    <ProductImage src={product.imagen_url} name={product.nombre_producto} className="size-10" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium">{product.nombre_producto}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {[product.sku, product.codigo_barras].filter(Boolean).join(" · ") || "Sin código"}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-medium tabular-nums">{formatMoney(product.precio_venta)}</span>
                      {product.es_servicio ? (
                        <Badge variant="secondary">Servicio</Badge>
                      ) : (
                        <Badge variant={outOfStock ? "destructive" : "outline"}>
                          {outOfStock ? "Sin existencia" : `${product.cantidad_en_existencia} en existencia`}
                        </Badge>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </Card>
    </div>
  );
}
