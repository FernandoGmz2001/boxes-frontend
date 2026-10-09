import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'

interface ProductSaveFooterProps {
  dirtyCount: number
  isSaving: boolean
  onSave: () => Promise<void>
}

export default function ProductSaveFooter({ dirtyCount, isSaving, onSave }: ProductSaveFooterProps) {
  return (
    <footer className="bg-background">
      <Separator />
      <div className="flex items-center justify-end gap-3 px-6 py-3">
        {dirtyCount > 0 ? (
          <p className="text-muted-foreground">
            {dirtyCount === 1 ? '1 producto con cambios' : `${dirtyCount} productos con cambios`}
          </p>
        ) : null}
        <Button type="button" disabled={dirtyCount === 0 || isSaving} onClick={() => void onSave()}>
          {isSaving ? <Spinner data-icon="inline-start" /> : null}
          Guardar cambios
        </Button>
      </div>
    </footer>
  )
}
