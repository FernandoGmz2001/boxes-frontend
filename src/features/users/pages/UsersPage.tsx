import { useCallback, useState } from "react";
import { PlusIcon, UsersIcon } from "lucide-react";
import { cn } from "cn";
import { useTablePagination } from "@/components/features/DataTable/hooks/useTablePagination.ts";
import ListHeader from "@/components/features/ListHeader/ListHeader.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import { useAuth } from "@/shared/auth/useAuth.ts";
import UserDeactivateDialog from "../components/UserDeactivateDialog.tsx";
import UserFormDialog from "../components/UserFormDialog.tsx";
import UserList from "../components/UserList.tsx";
import UserToolbar from "../components/UserToolbar.tsx";
import UserListSkeleton from "../components/Skeletons/UserListSkeleton.tsx";
import type { IGetUser } from "../interfaces/get.interface.ts";
import { useGetUsers, useUpdateUser } from "../services/queries.ts";
import { toActiveFilter, type UserStatus } from "../user-status.ts";

interface UserFormTarget {
  userId: number | null;
}

export default function UsersPage() {
  const { session } = useAuth();
  const { page, pageSize, search, setPage, setPageSize, setSearch, resetPage } =
    useTablePagination();
  const [status, setStatus] = useState<UserStatus>("all");
  const [userFormTarget, setUserFormTarget] = useState<UserFormTarget | null>(
    null,
  );
  const [deactivatingUser, setDeactivatingUser] = useState<IGetUser | null>(
    null,
  );
  const usersQuery = useGetUsers({
    pagina: page,
    limite: pageSize,
    busqueda: search || undefined,
    activo: toActiveFilter(status),
  });
  const { mutate: updateUser } = useUpdateUser();
  const users = usersQuery.data?.data ?? [];
  const total = usersQuery.data?.total ?? 0;
  const totalPages = usersQuery.data?.total_paginas ?? 0;

  const handleStatusChange = (nextStatus: UserStatus) => {
    setStatus(nextStatus);
    resetPage();
  };

  const openEdit = useCallback((userId: number) => {
    setUserFormTarget({ userId });
  }, []);

  const toggleStatus = useCallback(
    (user: IGetUser) => {
      if (user.activo) {
        setDeactivatingUser(user);
        return;
      }

      updateUser({ userId: user.id, payload: { activo: true } });
    },
    [updateUser],
  );

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto p-4">
      <ListHeader
        title="Usuarios"
        subtitle="Gestiona quién entra al sistema y con qué rol."
      >
        <Button type="button" onClick={() => setUserFormTarget({ userId: null })}>
          <PlusIcon data-icon="inline-start" />
          Nuevo usuario
        </Button>
      </ListHeader>
      <UserToolbar
        status={status}
        onStatusChange={handleStatusChange}
        onSearchChange={(value) => {
          resetPage();
          setSearch(value);
        }}
      />
      {usersQuery.isLoading ? <UserListSkeleton /> : null}
      {usersQuery.isError ? (
        <Alert variant="destructive">
          <AlertDescription>No se pudieron cargar los usuarios.</AlertDescription>
        </Alert>
      ) : null}
      {!usersQuery.isLoading && !usersQuery.isError && users.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            <EmptyTitle>No hay usuarios</EmptyTitle>
            <EmptyDescription>No hay usuarios para este filtro.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {!usersQuery.isLoading && !usersQuery.isError && users.length > 0 ? (
        <div className={cn(usersQuery.isFetching && "opacity-60")}>
          <UserList
            users={users}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              resetPage();
            }}
            currentUserId={session?.userId ?? null}
            onEdit={openEdit}
            onToggleStatus={toggleStatus}
          />
        </div>
      ) : null}
      {userFormTarget ? (
        <UserFormDialog
          userId={userFormTarget.userId}
          onClose={() => setUserFormTarget(null)}
        />
      ) : null}
      <UserDeactivateDialog
        user={deactivatingUser}
        onClose={() => setDeactivatingUser(null)}
      />
    </main>
  );
}
