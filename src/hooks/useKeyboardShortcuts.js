import { useEffect } from 'react'

export function useKeyboardShortcuts({ onSave, onExportPdf, onSectionJump, maxSections = 8 }) {
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        onSave?.()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        onExportPdf?.()
      }
      if (e.altKey && e.key >= '1' && e.key <= String(maxSections)) {
        e.preventDefault()
        const idx = parseInt(e.key, 10) - 1
        onSectionJump?.(idx)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onSave, onExportPdf, onSectionJump, maxSections])
}

