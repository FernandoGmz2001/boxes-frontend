import { useMemo } from "react";
import DataTable from "@/components/features/DataTable/DataTable.tsx";
import { Card } from "@/components/ui/card.tsx";
import type { IGetUser } from "../interfaces/get.interface.ts";
import { createUserColumns, type UserColumnHandlers } from "./user-columns.tsx";

interface UserListProps extends UserColumnHandlers {
  users: IGetUser[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function UserList({
  users,
  page,
  pageSize,
  totalPages,
  total,
  onPageChange,
  onPageSizeChange,
  currentUserId,
  onEdit,
  onToggleStatus,
}: UserListProps) {
  const columns = useMemo(
    () => createUserColumns({ currentUserId, onEdit, onToggleStatus }),
    [currentUserId, onEdit, onToggleStatus],
  );

  return (
    <Card className="p-4">
      <DataTable
        columns={columns}
        data={users}
        getRowId={(user) => String(user.id)}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onRowDoubleClick={(user) => onEdit(user.id)}
      />
    </Card>
  );
}
