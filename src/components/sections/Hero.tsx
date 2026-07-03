import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react'

import type { PointerState } from '@/components/webgl/HeroCanvas'

const HeroCanvas = lazy(() =>
  import('@/components/webgl/HeroCanvas').then((m) => ({ default: m.HeroCanvas })),
)
import { heroPhoto } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

function MaskWord({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('mask-word', className)}>
      <span data-hero-word className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  )
}

interface HeroProps {
  /** Becomes true as the preloader curtain lifts. */
  active: boolean
}

export function Hero({ active }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<PointerState>({ x: 0.5, y: 0.5, lastX: 0.5, lastY: 0.5 })
  const [inView, setInView] = useState(true)
  const reduced = usePrefersReducedMotion()

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const panel = panelRef.current
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    pointerRef.current.x = (e.clientX - rect.left) / rect.width
    pointerRef.current.y = 1 - (e.clientY - rect.top) / rect.height
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Entrance — fired by the preloader hand-off
  useGSAP(
    () => {
      if (!active) return
      if (reduced) {
        gsap.set(clipRef.current, { clipPath: 'inset(0% 0% 0% 0%)' })
        gsap.set('[data-hero-word], [data-hero-fade]', { opacity: 1, yPercent: 0 })
        return
      }
      const tl = gsap.timeline()
      tl.to(
        clipRef.current,
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut' },
        0,
      )
      tl.fromTo(
        '[data-hero-word]',
        { yPercent: 115 },
        { yPercent: 0, stagger: 0.085, duration: 1.35, ease: 'power4.out' },
        0.4,
      )
      tl.fromTo(
        '[data-hero-fade]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 1 },
        1,
      )
    },
    { scope: sectionRef, dependencies: [active, reduced] },
  )

  // Scroll parallax + idle scroll cue
  useGSAP(
    () => {
      if (reduced) return
      const scrub = {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
      gsap.to(panelRef.current, { yPercent: -9, ease: 'none', scrollTrigger: scrub })
      gsap.to('[data-hero-title]', { yPercent: 22, ease: 'none', scrollTrigger: { ...scrub } })

      gsap.to('[data-scroll-cue-line]', {
        scaleY: 0.25,
        transformOrigin: 'top',
        duration: 1.1,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      })
    },
    { scope: sectionRef, dependencies: [reduced] },
  )

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="relative h-[100svh] overflow-hidden"
      aria-label="Apresentação"
    >
      {/* ── Image plate ──────────────────────────────────────────────
          Mobile: centered horizontally, sits in the lower 2/3 of the screen.
          Desktop (md+): anchored to the right side with slight offset.
      */}
      <div
        ref={clipRef}
        style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        className="absolute z-10 left-1/2 top-[24svh] -translate-x-1/2 md:left-auto md:right-[6vw] md:top-1/2 md:translate-x-0 md:-translate-y-1/2"
      >
        <div
          ref={panelRef}
          className="relative aspect-[1064/1600] h-[52svh] overflow-hidden md:h-[78svh]"
        >
          <img
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            width={heroPhoto.width}
            height={heroPhoto.height}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {!reduced && (
            <Suspense fallback={null}>
              <HeroCanvas
                src={heroPhoto.src}
                imageWidth={heroPhoto.width}
                imageHeight={heroPhoto.height}
                pointerRef={pointerRef}
                active={active}
                inView={inView}
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* ── Masthead typography ──────────────────────────────────────
          mix-blend-difference flips text colour over the photo.
          Mobile: text sits at the top with a slightly smaller clamp.
          Desktop: top-[16svh] as before.
      */}
      <div
        data-hero-title
        className="text-bone pointer-events-none absolute inset-x-[4vw] top-[10svh] z-20 mix-blend-difference md:top-[16svh]"
      >
        <h1 className="display-tight font-bold">
          <span className="block text-[clamp(3.8rem,15vw,15rem)] leading-[1.05] pb-[0.04em]">
            <MaskWord>ISADORA</MaskWord>
          </span>
          <span className="ml-[8vw] block text-[clamp(1.4rem,5.5vw,5.6rem)] leading-[1.16] font-medium tracking-[0.04em] md:ml-[16vw]">
            <MaskWord>GALVÃO</MaskWord> <MaskWord>BONI</MaskWord>
          </span>
        </h1>
      </div>

      {/* ── Editorial meta — bottom left ─────────────────────────────
          Mobile: smaller text, limited width.
          Desktop: same as before.
      */}
      <div className="absolute bottom-[5svh] left-[4vw] z-20 max-w-[55vw] md:max-w-[60vw]">
        <p
          data-hero-fade
          className="font-sans text-ink text-[clamp(0.85rem,2vw,1.5rem)] leading-snug italic font-light tracking-wide"
        >
          modelo &amp; digital influencer
        </p>
        <div data-hero-fade className="bg-line mt-4 h-px w-[30vw] max-w-72 md:mt-7" />
        <div data-hero-fade className="editorial-label text-ink-soft mt-4 flex flex-col gap-2 md:mt-7">
          <span>Edição Nº 01 — 2026</span>
          <span>Guarapari — ES, Brasil</span>
        </div>
      </div>

      {/* ── Vertical edge label — desktop only ──────────────────────── */}
      <p
        data-hero-fade
        className="editorial-label text-ink-soft absolute top-1/2 right-[2vw] z-20 hidden -translate-y-1/2 [writing-mode:vertical-rl] lg:block"
      >
        Portfólio — da moda casual e praia ao fitness e lifestyle
      </p>

      {/* ── Scroll cue ──────────────────────────────────────────────
          Desktop: "Role" label + animated line.
          Mobile: minimal animated arrow at bottom-center.
      */}
      <div
        data-hero-fade
        className="absolute bottom-[5svh] right-[3vw] z-20 hidden flex-col items-center gap-3 md:flex"
      >
        <span className="editorial-label text-ink-soft">Role</span>
        <span data-scroll-cue-line className="bg-ink-soft block h-12 w-px" />
      </div>

      {/* Mobile scroll cue — centered arrow */}
      <div
        data-hero-fade
        className="absolute bottom-[3svh] left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 md:hidden"
      >
        <span data-scroll-cue-line className="bg-ink-soft block h-8 w-px" />
      </div>
    </section>
  )
}
