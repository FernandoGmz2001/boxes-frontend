import { useEffect } from 'react'

function isSaveShortcut(event: KeyboardEvent) {
  return (
    event.code === 'KeyS' &&
    !event.repeat &&
    !event.altKey &&
    !event.shiftKey &&
    (event.ctrlKey || event.metaKey) &&
    !(event.ctrlKey && event.metaKey)
  )
}

function findSaveTarget() {
  const active = document.activeElement
  if (active instanceof Element) {
    const focusedForm = active.closest('form')
    if (focusedForm instanceof HTMLFormElement) return focusedForm
  }

  const forms = [...document.querySelectorAll('form')].filter(
    (form): form is HTMLFormElement => form instanceof HTMLFormElement,
  )
  if (forms.length > 0) return forms[forms.length - 1]

  const saveButtons = [...document.querySelectorAll('[data-save-shortcut]')].filter(
    (button): button is HTMLButtonElement => button instanceof HTMLButtonElement,
  )
  if (saveButtons.length === 1) return saveButtons[0]

  return null
}

function isDisabledSubmitter(submitter: Element) {
  return (
    (submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement) &&
    submitter.disabled
  )
}

function triggerSave(target: HTMLFormElement | HTMLButtonElement) {
  if (target instanceof HTMLButtonElement) {
    if (target.disabled) return
    target.click()
    return
  }

  const submitter = target.querySelector('button[type="submit"], input[type="submit"]')
  if (submitter && isDisabledSubmitter(submitter)) return
  target.requestSubmit()
}

export default function SaveHotkey() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isSaveShortcut(event)) return

      event.preventDefault()
      const target = findSaveTarget()
      if (!target) return
      triggerSave(target)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return null
}
