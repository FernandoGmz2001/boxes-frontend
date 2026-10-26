import { ShieldOffIcon } from "lucide-react";
import { Navigate, Outlet } from "react-router";
import { NAVIGATION_ITEMS } from "@/app/layouts/navigation-items.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { usePermissions } from "@/features/auth/hooks/usePermissions.ts";
import type { Permission } from "@/shared/auth/permissions.ts";
import { useAuth } from "@/shared/auth/useAuth.ts";

interface PermissionGateProps {
  permission: Permission;
}

export default function PermissionGate({ permission }: PermissionGateProps) {
  const { endSession } = useAuth();
  const { can, isLoading, isError, refetch } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  if (can(permission)) return <Outlet />;

  const fallbackItem = isError
    ? undefined
    : NAVIGATION_ITEMS.find((item) => can(item.permission));

  if (fallbackItem) return <Navigate to={fallbackItem.to} replace />;

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldOffIcon />
        </EmptyMedia>
        <EmptyTitle>
          {isError ? "No se pudieron cargar tus permisos" : "Sin acceso"}
        </EmptyTitle>
        <EmptyDescription>
          {isError
            ? "Revisa tu conexión e intenta de nuevo."
            : "Tu rol no tiene módulos asignados. Pide a un administrador que te dé acceso."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        {isError ? (
          <Button type="button" onClick={() => refetch()}>
            Reintentar
          </Button>
        ) : null}
        <Button type="button" variant="outline" onClick={endSession}>
          Cerrar sesión
        </Button>
      </EmptyContent>
    </Empty>
  );
}
