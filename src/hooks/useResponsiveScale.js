import { useEffect } from 'react'

/**
 * Keeps builder preview scale responsive to viewport and sidebar state.
 */
export function useResponsiveScale({ sidebarOpen, setAutoScale, sidebarWidth = 420 }) {
  useEffect(() => {
    const update = () => {
      const available = window.innerWidth - (sidebarOpen ? sidebarWidth : 0) - 64
      setAutoScale(Math.min(0.80, Math.max(0.38, available / 794)))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [sidebarOpen, setAutoScale, sidebarWidth])
}

