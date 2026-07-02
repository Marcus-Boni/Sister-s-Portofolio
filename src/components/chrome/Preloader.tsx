import { useRef, useState } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'

const NAME = 'ISADORA'
const MIN_DURATION = 2.1

interface PreloaderProps {
  /** Fired as the curtain starts lifting — cue the hero entrance. */
  onReveal: () => void
}

/**
 * Opening sequence: the name letters rise out of masks while a counter
 * runs to 100; once webfonts are ready, a two-layer curtain (bone over
 * ink) sweeps upward to reveal the page.
 */
export function Preloader({ onReveal }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const boneRef = useRef<HTMLDivElement>(null)
  const inkRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    () => {
      if (!rootRef.current) return
      const letters = rootRef.current.querySelectorAll('[data-letter]')
      const counter = { value: 0 }
      const started = performance.now()

      const tl = gsap.timeline()
      tl.fromTo(
        letters,
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.055 },
        0.15,
      )
      tl.fromTo(
        '[data-pre-label]',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.55,
      )
      tl.to(
        counter,
        {
          value: 100,
          duration: 1.7,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0')
            }
          },
        },
        0.2,
      )

      const exit = () => {
        const elapsed = (performance.now() - started) / 1000
        const wait = Math.max(0, MIN_DURATION - elapsed)
        const out = gsap.timeline({ delay: wait, onComplete: () => setGone(true) })
        out.to(
          '[data-pre-content]',
          { yPercent: -40, opacity: 0, duration: 0.6, ease: 'power2.in' },
          0,
        )
        out.add(() => onReveal(), 0.32)
        out.to(boneRef.current, { yPercent: -100, duration: 1.05, ease: 'power4.inOut' }, 0.25)
        out.to(inkRef.current, { yPercent: -100, duration: 1.05, ease: 'power4.inOut' }, 0.37)
      }

      void document.fonts.ready.then(exit)
    },
    { scope: rootRef },
  )

  if (gone) return null

  return (
    <div ref={rootRef} className="fixed inset-0 z-[80]" aria-hidden>
      <div ref={inkRef} className="bg-ink absolute inset-0" />
      <div ref={boneRef} className="bg-bone absolute inset-0">
        <div data-pre-content className="absolute inset-0">
          <div className="flex h-full flex-col items-center justify-center">
            <h1 className="display-tight flex overflow-hidden text-[clamp(3.4rem,14vw,12rem)] font-bold">
              {NAME.split('').map((letter, i) => (
                <span key={i} data-letter className="inline-block will-change-transform">
                  {letter}
                </span>
              ))}
            </h1>
            <p data-pre-label className="editorial-label text-ink-soft mt-6 md:mt-8">
              Portfólio — Edição Nº 01
            </p>
          </div>

          <span
            ref={counterRef}
            className="font-display text-ink absolute right-6 bottom-5 text-3xl font-medium italic tabular-nums md:right-10 md:bottom-8 md:text-5xl"
          >
            000
          </span>
          <span className="editorial-label text-ink-soft absolute bottom-6 left-6 md:bottom-10 md:left-10">
            Guarapari — ES
          </span>
        </div>
      </div>
    </div>
  )
}
