import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import SaveShortcut from "@/shared/hotkeys/SaveShortcut.tsx";

interface SaveFooterProps {
  isSaving: boolean;
  onSave?: () => void | Promise<void>;
  dirtyCount?: number;
  singularLabel?: string;
  pluralLabel?: string;
  disabled?: boolean;
  label?: string;
  savingLabel?: string;
  type?: "button" | "submit";
}

function pendingChangesLabel(
  dirtyCount: number,
  singularLabel: string,
  pluralLabel: string,
) {
  if (dirtyCount === 1) return `1 ${singularLabel} con cambios`;
  return `${dirtyCount} ${pluralLabel} con cambios`;
}

export default function SaveFooter({
  isSaving,
  onSave,
  dirtyCount = 0,
  singularLabel,
  pluralLabel,
  disabled = false,
  label = "Guardar cambios",
  savingLabel,
  type = "button",
}: SaveFooterProps) {
  const showsPendingCount = singularLabel != null && pluralLabel != null;

  return (
    <footer className="bg-canvas">
      <div className="flex items-center justify-end gap-3 px-6 py-3">
        {showsPendingCount && dirtyCount > 0 ? (
          <p className="text-muted-foreground text-sm">
            {pendingChangesLabel(dirtyCount, singularLabel, pluralLabel)}
          </p>
        ) : null}
        <Button
          type={type}
          data-save-shortcut=""
          disabled={
            disabled || isSaving || (showsPendingCount && dirtyCount === 0)
          }
          onClick={
            type === "button" && onSave
              ? () => {
                  void onSave();
                }
              : undefined
          }
        >
          {isSaving ? <Spinner data-icon="inline-start" /> : null}
          {isSaving && savingLabel ? savingLabel : label}
          {isSaving ? null : <SaveShortcut />}
        </Button>
      </div>
    </footer>
  );
}
