import { useEffect, useRef, useState } from 'react'

import { gsap } from '@/lib/gsap'

/**
 * Editorial cursor: a small ink dot with a trailing ring.
 * Over elements tagged [data-cursor="ver"] the ring inflates into a
 * labelled lens. Only mounts on fine-pointer devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-custom-cursor')
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return

    const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.12, ease: 'power2.out' })
    const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.12, ease: 'power2.out' })
    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.45, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const tagged = target.closest<HTMLElement>('[data-cursor]')
      if (tagged) {
        setLabel(tagged.dataset.cursor ?? null)
        return
      }
      const interactive = target.closest('a, button, [role="button"]')
      setLabel(interactive ? '' : null)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [enabled])

  useEffect(() => {
    if (!ringRef.current) return
    const isLens = label !== null && label.length > 0
    const isHover = label === ''
    gsap.to(ringRef.current, {
      width: isLens ? 88 : isHover ? 44 : 28,
      height: isLens ? 88 : isHover ? 44 : 28,
      backgroundColor: isLens ? 'rgba(27,21,17,0.92)' : 'rgba(27,21,17,0)',
      borderColor: isLens ? 'rgba(242,237,228,0)' : 'rgba(27,21,17,0.45)',
      duration: 0.35,
      ease: 'power3.out',
    })
  }, [label])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
        style={{ width: 28, height: 28, borderColor: 'rgba(27,21,17,0.45)' }}
      >
        {label && (
          <span className="editorial-label text-bone select-none" style={{ letterSpacing: '0.22em' }}>
            {label}
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        className="bg-terra absolute top-0 left-0 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />
    </div>
  )
}
