import { createColumnHelper } from "@tanstack/react-table";
import { LockIcon, MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
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
      header: "Rol",
      cell: ({ row }) => {
        const role = row.original;

        return (
          <div className="flex min-w-0 flex-col">
            <span className="flex items-center gap-2 font-medium">
              {role.nombre}
              {role.es_sistema ? (
                <Badge variant="outline">
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
        );
      },
    }),
    columnHelper.accessor("permisos", {
      header: "Módulos",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.permisos.map((permission) => (
            <Badge key={permission} variant="secondary">
              {APP_MODULES[permission].label}
            </Badge>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("total_usuarios", {
      header: "Usuarios",
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.total_usuarios}</span>
      ),
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
