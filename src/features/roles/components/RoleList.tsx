import { useMemo } from "react";
import DataTable from "@/components/features/DataTable/DataTable.tsx";
import { Card } from "@/components/ui/card.tsx";
import type { IGetRole } from "../interfaces/get.interface.ts";
import { createRoleColumns, type RoleColumnHandlers } from "./role-columns.tsx";

interface RoleListProps extends RoleColumnHandlers {
  roles: IGetRole[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function RoleList({
  roles,
  page,
  pageSize,
  totalPages,
  total,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: RoleListProps) {
  const columns = useMemo(
    () => createRoleColumns({ onEdit, onDelete }),
    [onEdit, onDelete],
  );

  return (
    <Card className="p-4">
      <DataTable
        columns={columns}
        data={roles}
        getRowId={(role) => String(role.id)}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onRowDoubleClick={(role) => {
          if (!role.es_sistema) onEdit(role.id);
        }}
      />
    </Card>
  );
}
