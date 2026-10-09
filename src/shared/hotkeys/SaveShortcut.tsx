import { Kbd, KbdGroup } from '@/components/ui/kbd.tsx'

function saveModifier() {
  if (typeof navigator === 'undefined') return 'Ctrl'
  return /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl'
}

export default function SaveShortcut() {
  return (
    <KbdGroup>
      <Kbd>{saveModifier()}</Kbd>
      <Kbd>S</Kbd>
    </KbdGroup>
  )
}
