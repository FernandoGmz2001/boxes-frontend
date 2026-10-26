import SearchInput from "@/components/features/SearchInput/SearchInput.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import {
  USER_STATUSES,
  USER_STATUS_LABELS,
  type UserStatus,
} from "../user-status.ts";

interface UserToolbarProps {
  status: UserStatus;
  onStatusChange: (status: UserStatus) => void;
  onSearchChange: (search: string) => void;
}

export default function UserToolbar({
  status,
  onStatusChange,
  onSearchChange,
}: UserToolbarProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[status]}
        onValueChange={(values) => {
          const nextStatus = values.find((value): value is UserStatus =>
            USER_STATUSES.some((item) => item === value),
          );
          if (nextStatus) onStatusChange(nextStatus);
        }}
      >
        {USER_STATUSES.map((item) => (
          <ToggleGroupItem key={item} value={item}>
            {USER_STATUS_LABELS[item]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <SearchInput
        label="Buscar usuarios"
        placeholder="Nombre o correo"
        onDebouncedChange={onSearchChange}
      />
    </div>
  );
}
