import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import DataTable from "@/components/features/DataTable/DataTable.tsx";
import { Card } from "@/components/ui/card.tsx";
import type { IGetCategory } from "@/features/categories/interfaces/get.interface.ts";
import { useCreateCategory } from "@/features/categories/services/queries.ts";
import type { ProductRowEditHandlers } from "../hooks/useProductRowEdit.ts";
import type { IGetProduct } from "../interfaces/get.interface.ts";
import { createProductColumns } from "./product-columns.tsx";

interface ProductListProps extends ProductRowEditHandlers {
  products: IGetProduct[];
  categories: IGetCategory[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onDeactivate: (productId: number) => void;
}

export default function ProductList({
  products,
  categories,
  page,
  pageSize,
  totalPages,
  total,
  onPageChange,
  onPageSizeChange,
  onDeactivate,
  valuesFor,
  errorFor,
  setField,
  isSaving,
}: ProductListProps) {
  const navigate = useNavigate();
  const { mutateAsync: createCategory } = useCreateCategory();
  const [createdCategories, setCreatedCategories] = useState<IGetCategory[]>(
    [],
  );
  const categoryOptions = useMemo(() => {
    const knownIds = new Set(categories.map((category) => category.id));
    const pending = createdCategories.filter(
      (category) => !knownIds.has(category.id),
    );

    return [...pending, ...categories];
  }, [categories, createdCategories]);
  const handleCreateCategory = useCallback(
    async (nombre: string) => {
      const category = await createCategory({ nombre });
      setCreatedCategories((current) =>
        current.some((item) => item.id === category.id)
          ? current
          : [...current, category],
      );
      return category.id;
    },
    [createCategory],
  );
  const columns = useMemo(
    () =>
      createProductColumns({
        categories: categoryOptions,
        onCreateCategory: handleCreateCategory,
        valuesFor,
        errorFor,
        setField,
        isSaving,
        onDeactivate,
      }),
    [
      categoryOptions,
      handleCreateCategory,
      valuesFor,
      errorFor,
      setField,
      isSaving,
      onDeactivate,
    ],
  );

  return (
    <Card className="p-4">
      <DataTable
        columns={columns}
        data={products}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onRowDoubleClick={(product) => navigate(`/productos/${product.id}`)}
      />
    </Card>
  );
}
