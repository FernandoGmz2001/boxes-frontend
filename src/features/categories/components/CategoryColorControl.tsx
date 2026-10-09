import { Input } from '@/components/ui/input.tsx'
import { colorPickerValue } from '../category-color.ts'

interface CategoryColorControlProps {
  id?: string
  value: string
  disabled?: boolean
  invalid?: boolean
  onChange: (value: string) => void
  onBlur?: () => void
}

export default function CategoryColorControl({
  id,
  value,
  disabled = false,
  invalid = false,
  onChange,
  onBlur,
}: CategoryColorControlProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        aria-label="Elegir color"
        disabled={disabled}
        value={colorPickerValue(value)}
        className="size-8 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        onChange={(event) => onChange(event.target.value)}
      />
      <Input
        id={id}
        className="w-32"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-label="Color"
        placeholder="#000000"
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
