import { useEffect, useState } from 'react'

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

/** Film-grain texture floating above everything — the analog finish. */
export function GrainOverlay() {
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia('(max-width: 768px) or (pointer: coarse)').matches
  )

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px) or (pointer: coarse)')
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  if (isMobile) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <div
        className="animate-grain absolute -inset-[100%] opacity-[0.05]"
        style={{ backgroundImage: NOISE_SVG, backgroundSize: '256px 256px' }}
      />
    </div>
  )
}
