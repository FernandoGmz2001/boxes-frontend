import { useCallback, useState } from "react";
import { PlusIcon, ShieldCheckIcon } from "lucide-react";
import { cn } from "cn";
import { useTablePagination } from "@/components/features/DataTable/hooks/useTablePagination.ts";
import ListHeader from "@/components/features/ListHeader/ListHeader.tsx";
import SearchInput from "@/components/features/SearchInput/SearchInput.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import RoleDeleteDialog from "../components/RoleDeleteDialog.tsx";
import RoleFormDialog from "../components/RoleFormDialog.tsx";
import RoleList from "../components/RoleList.tsx";
import RoleListSkeleton from "../components/Skeletons/RoleListSkeleton.tsx";
import type { IGetRole } from "../interfaces/get.interface.ts";
import { useGetRoles } from "../services/queries.ts";

interface RoleFormTarget {
  roleId: number | null;
}

export default function RolesPage() {
  const { page, pageSize, search, setPage, setPageSize, setSearch, resetPage } =
    useTablePagination();
  const [roleFormTarget, setRoleFormTarget] = useState<RoleFormTarget | null>(
    null,
  );
  const [deletingRole, setDeletingRole] = useState<IGetRole | null>(null);
  const rolesQuery = useGetRoles({
    pagina: page,
    limite: pageSize,
    busqueda: search || undefined,
  });
  const roles = rolesQuery.data?.data ?? [];
  const total = rolesQuery.data?.total ?? 0;
  const totalPages = rolesQuery.data?.total_paginas ?? 0;

  const openEdit = useCallback((roleId: number) => {
    setRoleFormTarget({ roleId });
  }, []);

  const askDelete = useCallback((role: IGetRole) => {
    setDeletingRole(role);
  }, []);

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto p-4">
      <ListHeader
        title="Roles y permisos"
        subtitle="Define qué módulos puede usar cada tipo de usuario."
      >
        <Button type="button" onClick={() => setRoleFormTarget({ roleId: null })}>
          <PlusIcon data-icon="inline-start" />
          Nuevo rol
        </Button>
      </ListHeader>
      <div className="flex items-center justify-end">
        <SearchInput
          label="Buscar roles"
          placeholder="Nombre del rol"
          onDebouncedChange={(value) => {
            resetPage();
            setSearch(value);
          }}
        />
      </div>
      {rolesQuery.isLoading ? <RoleListSkeleton /> : null}
      {rolesQuery.isError ? (
        <Alert variant="destructive">
          <AlertDescription>No se pudieron cargar los roles.</AlertDescription>
        </Alert>
      ) : null}
      {!rolesQuery.isLoading && !rolesQuery.isError && roles.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldCheckIcon />
            </EmptyMedia>
            <EmptyTitle>No hay roles</EmptyTitle>
            <EmptyDescription>
              Crea un rol para dar acceso a los módulos.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {!rolesQuery.isLoading && !rolesQuery.isError && roles.length > 0 ? (
        <div className={cn(rolesQuery.isFetching && "opacity-60")}>
          <RoleList
            roles={roles}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              resetPage();
            }}
            onEdit={openEdit}
            onDelete={askDelete}
          />
        </div>
      ) : null}
      {roleFormTarget ? (
        <RoleFormDialog
          roleId={roleFormTarget.roleId}
          onClose={() => setRoleFormTarget(null)}
        />
      ) : null}
      <RoleDeleteDialog
        role={deletingRole}
        onClose={() => setDeletingRole(null)}
      />
    </main>
  );
}
