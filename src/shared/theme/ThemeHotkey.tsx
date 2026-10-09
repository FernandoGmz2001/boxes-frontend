import { useEffect, useEffectEvent } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeHotkey() {
  const { setTheme } = useTheme()

  const toggleTheme = useEffectEvent(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'light' : 'dark')
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.code !== 'KeyD' || !event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        return
      }

      event.preventDefault()
      toggleTheme()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return null
}
