import { createColumnHelper } from "@tanstack/react-table";
import { cn } from "cn";
import {
  LayoutGridIcon,
  LockIcon,
  MoreHorizontalIcon,
  PencilIcon,
  ShieldCheckIcon,
  ShieldIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import DataTableColumnHeader from "@/components/features/DataTable/DataTableColumnHeader.tsx";
import type { DataTableFeatures } from "@/components/features/DataTable/data-table-features.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { APP_MODULES } from "@/shared/auth/permissions.ts";
import type { IGetRole } from "../interfaces/get.interface.ts";

export interface RoleColumnHandlers {
  onEdit: (roleId: number) => void;
  onDelete: (role: IGetRole) => void;
}

const columnHelper = createColumnHelper<DataTableFeatures, IGetRole>();

export function createRoleColumns(handlers: RoleColumnHandlers) {
  return columnHelper.columns([
    columnHelper.accessor("nombre", {
      header: () => <DataTableColumnHeader icon={ShieldIcon} title="Rol" />,
      cell: ({ row }) => {
        const role = row.original;

        return (
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                role.es_sistema
                  ? "bg-warning/10 text-warning dark:bg-warning/20"
                  : "bg-info/10 text-info dark:bg-info/20",
              )}
              aria-hidden="true"
            >
              {role.es_sistema ? (
                <ShieldCheckIcon className="size-4" />
              ) : (
                <ShieldIcon className="size-4" />
              )}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="flex items-center gap-2 font-medium">
                {role.nombre}
                {role.es_sistema ? (
                  <Badge variant="warning">
                    <LockIcon data-icon="inline-start" />
                    Sistema
                  </Badge>
                ) : null}
              </span>
              {role.descripcion ? (
                <span className="truncate text-muted-foreground">
                  {role.descripcion}
                </span>
              ) : null}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("permisos", {
      header: () => (
        <DataTableColumnHeader icon={LayoutGridIcon} title="Módulos" />
      ),
      cell: ({ row }) =>
        row.original.permisos.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.original.permisos.map((permission) => {
              const ModuleIcon = APP_MODULES[permission].icon;

              return (
                <Badge key={permission} variant="outline">
                  <ModuleIcon data-icon="inline-start" />
                  {APP_MODULES[permission].label}
                </Badge>
              );
            })}
          </div>
        ) : (
          <span className="text-muted-foreground">Sin módulos</span>
        ),
    }),
    columnHelper.accessor("total_usuarios", {
      header: () => <DataTableColumnHeader icon={UsersIcon} title="Usuarios" />,
      cell: ({ row }) => {
        const totalUsers = row.original.total_usuarios;

        return (
          <Badge
            variant={totalUsers > 0 ? "info" : "secondary"}
            className="tabular-nums"
          >
            <UsersIcon data-icon="inline-start" />
            {totalUsers > 0 ? totalUsers : "Sin usuarios"}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => {
        const role = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Más" />
                }
              >
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    disabled={role.es_sistema}
                    onClick={() => handlers.onEdit(role.id)}
                  >
                    <PencilIcon />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={role.es_sistema || role.total_usuarios > 0}
                    onClick={() => handlers.onDelete(role)}
                  >
                    <TrashIcon />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ]);
}
