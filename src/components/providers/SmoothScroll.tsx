import Lenis from 'lenis'
import { useEffect, useRef, type ReactNode } from 'react'

import { gsap, ScrollTrigger } from '@/lib/gsap'

import { LenisContext } from './lenis-context'

interface SmoothScrollProps {
  /** While true the page cannot scroll (e.g. during the preloader). */
  paused?: boolean
  children: ReactNode
}

/**
 * Global Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger
 * and the scroll position never drift apart.
 */
export function SmoothScroll({ paused = false, children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

    instance.on('scroll', ScrollTrigger.update)

    const update = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    lenisRef.current = instance

    return () => {
      gsap.ticker.remove(update)
      instance.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (paused) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [paused])

  return <LenisContext value={lenisRef}>{children}</LenisContext>
}
