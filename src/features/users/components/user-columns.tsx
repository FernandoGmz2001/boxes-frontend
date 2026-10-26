import { createColumnHelper } from "@tanstack/react-table";
import {
  MoreHorizontalIcon,
  PencilIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";
import type { DataTableFeatures } from "@/components/features/DataTable/data-table-features.ts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import type { IGetUser } from "../interfaces/get.interface.ts";
import { userInitials } from "../user-initials.ts";

export interface UserColumnHandlers {
  currentUserId: number | null;
  onEdit: (userId: number) => void;
  onToggleStatus: (user: IGetUser) => void;
}

const columnHelper = createColumnHelper<DataTableFeatures, IGetUser>();

export function createUserColumns(handlers: UserColumnHandlers) {
  return columnHelper.columns([
    columnHelper.accessor("nombre", {
      header: "Usuario",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar>
              <AvatarFallback>{userInitials(user.nombre)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">
                {user.nombre}
                {user.id === handlers.currentUserId ? (
                  <span className="text-muted-foreground"> (tú)</span>
                ) : null}
              </span>
              <span className="truncate text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "rol",
      header: "Rol",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.rol.nombre}</Badge>
      ),
    }),
    columnHelper.accessor("activo", {
      header: "Estado",
      cell: ({ row }) =>
        row.original.activo ? (
          <Badge variant="outline">Activo</Badge>
        ) : (
          <Badge variant="destructive">Inactivo</Badge>
        ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => {
        const user = row.original;

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
                  <DropdownMenuItem onClick={() => handlers.onEdit(user.id)}>
                    <PencilIcon />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant={user.activo ? "destructive" : "default"}
                    disabled={user.id === handlers.currentUserId}
                    onClick={() => handlers.onToggleStatus(user)}
                  >
                    {user.activo ? <UserXIcon /> : <UserCheckIcon />}
                    {user.activo ? "Desactivar" : "Activar"}
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
