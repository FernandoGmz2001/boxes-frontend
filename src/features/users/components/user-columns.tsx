import { createColumnHelper } from "@tanstack/react-table";
import { cn } from "cn";
import {
  ActivityIcon,
  CircleCheckIcon,
  CircleOffIcon,
  MailIcon,
  MoreHorizontalIcon,
  PencilIcon,
  ShieldIcon,
  UserCheckIcon,
  UserIcon,
  UserXIcon,
} from "lucide-react";
import DataTableColumnHeader from "@/components/features/DataTable/DataTableColumnHeader.tsx";
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
      header: () => <DataTableColumnHeader icon={UserIcon} title="Usuario" />,
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentUser = user.id === handlers.currentUserId;

        return (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className={cn(!user.activo && "opacity-60")}>
              <AvatarFallback
                className={cn(
                  "font-medium",
                  isCurrentUser && "bg-info/10 text-info dark:bg-info/20",
                )}
              >
                {userInitials(user.nombre)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="flex items-center gap-2 font-medium">
                <span className="truncate">{user.nombre}</span>
                {isCurrentUser ? <Badge variant="info">Tú</Badge> : null}
              </span>
              <span className="inline-flex min-w-0 items-center gap-1 text-muted-foreground">
                <MailIcon className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{user.email}</span>
              </span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "rol",
      header: () => <DataTableColumnHeader icon={ShieldIcon} title="Rol" />,
      cell: ({ row }) => (
        <Badge variant="outline">
          <ShieldIcon data-icon="inline-start" />
          {row.original.rol.nombre}
        </Badge>
      ),
    }),
    columnHelper.accessor("activo", {
      header: () => <DataTableColumnHeader icon={ActivityIcon} title="Estado" />,
      cell: ({ row }) =>
        row.original.activo ? (
          <Badge variant="success">
            <CircleCheckIcon data-icon="inline-start" />
            Activo
          </Badge>
        ) : (
          <Badge variant="secondary">
            <CircleOffIcon data-icon="inline-start" />
            Inactivo
          </Badge>
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
