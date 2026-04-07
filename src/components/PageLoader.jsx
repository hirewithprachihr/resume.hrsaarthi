import { useEffect, useState } from 'react'

/**
 * Premium top-progress-bar loader.
 * Replaces the full-screen spinner with a thin animated bar at the very top —
 * much less jarring, feels faster, matches modern SaaS standards (Linear, Vercel, etc.)
 */
export default function PageLoader() {
  const [width, setWidth] = useState(12)

  useEffect(() => {
    // Simulate progress: quick to 70%, then slow until component unmounts
    const t1 = setTimeout(() => setWidth(40),  80)
    const t2 = setTimeout(() => setWidth(65), 300)
    const t3 = setTimeout(() => setWidth(78), 600)
    const t4 = setTimeout(() => setWidth(88), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  return (
    <>
      {/* Top progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
        background: 'transparent', zIndex: 9999, pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: 'linear-gradient(90deg, #5B4BF5, #0EC8A0)',
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 12px rgba(91,75,245,0.6)',
          borderRadius: '0 2px 2px 0',
        }} />
      </div>

      {/* Subtle background — not full screen block */}
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(2px)', zIndex: 9998, pointerEvents: 'none',
      }} />
    </>
  )
}
