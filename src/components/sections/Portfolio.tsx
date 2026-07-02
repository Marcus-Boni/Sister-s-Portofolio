import { useRef, useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { photos, type Photo } from '@/data/site'
import { gsap, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

/** Plate rhythm: alternating scale and vertical offset, like a pinned wall. */
const PLATE_STYLES = [
  'md:h-[62vh] md:mt-[6vh]',
  'md:h-[44vh] md:-mt-[12vh]',
  'md:h-[70vh] md:mt-[10vh]',
  'md:h-[50vh] md:-mt-[8vh]',
  'md:h-[64vh] md:mt-[2vh]',
  'md:h-[54vh] md:-mt-[10vh]',
]

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<Photo | null>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current
        if (!track) return
        const amount = () => track.scrollWidth - window.innerWidth

        const scroll = gsap.to(track, {
          x: () => -amount(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${amount()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // inner-image parallax against the moving track
        gsap.utils.toArray<HTMLElement>('[data-plate-img]').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: scroll,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })

        // ghost masthead drifts at half speed
        gsap.to('[data-ghost-title]', {
          xPercent: -32,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${amount()}`,
            scrub: true,
          },
        })
      })

      mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
        gsap.utils.toArray<HTMLElement>('[data-plate]').forEach((plate) => {
          gsap.fromTo(
            plate,
            { opacity: 0, y: 64 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              scrollTrigger: { trigger: plate, start: 'top 88%', once: true },
            },
          )
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="bg-bone relative md:h-screen md:overflow-hidden"
      aria-label="Portfólio"
    >
      <h2
        data-ghost-title
        aria-hidden
        className="display-tight text-outline pointer-events-none absolute bottom-[2vh] left-0 z-0 hidden font-bold whitespace-nowrap opacity-35 md:block md:text-[24vh]"
      >
        PORTFÓLIO — PORTFÓLIO
      </h2>

      <div
        ref={trackRef}
        className="relative z-10 flex flex-col gap-24 px-[6vw] py-24 will-change-transform md:h-full md:w-max md:flex-row md:items-center md:gap-[7vw] md:py-0 md:pr-[12vw] md:pl-[8vw]"
      >
        {/* intro plate */}
        <header className="shrink-0 md:w-[26vw]">
          <p className="editorial-label text-ink-soft mb-7">Portfólio — Nº 03</p>
          <h3 className="display-tight text-[clamp(2.4rem,5vw,4.6rem)] font-semibold">
            Quatro nichos, <em className="text-terra font-medium">uma</em> assinatura.
          </h3>
          <p className="text-ink-soft mt-8 max-w-[26rem] text-sm leading-relaxed md:text-base">
            Editorial, lifestyle, fitness e beauty — cada imagem é pensada para
            traduzir a essência da marca.
          </p>
          <p className="editorial-label text-ink-soft mt-10 hidden items-center gap-3 md:flex">
            Role para navegar <span aria-hidden>⟶</span>
          </p>
        </header>
        {photos.map((photo, i) => (
          <figure
            key={photo.src}
            data-plate
            className={cn(
              'relative shrink-0 md:self-start md:aspect-[2/3]',
              PLATE_STYLES[i % PLATE_STYLES.length],
            )}
          >
            <button
              type="button"
              data-cursor="Ver"
              onClick={() => setLightbox(photo)}
              className="group block h-full w-full text-left"
              aria-label={`Ampliar foto — ${photo.title}, ${photo.category}`}
            >
              <span className="block h-full overflow-hidden">
                <img
                  data-plate-img
                  src={photo.small}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  className="block aspect-[2/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-full md:w-auto md:scale-[1.16] md:group-hover:scale-[1.22]"
                />
              </span>
            </button>
            <figcaption className="mt-4 flex items-baseline justify-between gap-6">
              <span className="font-display text-ink text-lg italic md:text-xl">
                {photo.title}
              </span>
              <span className="editorial-label text-ink-soft">
                {String(i + 1).padStart(2, '0')} · {photo.category}
              </span>
            </figcaption>
          </figure>
        ))}

        {/* outro plate */}
        <aside className="flex shrink-0 flex-col items-start justify-center md:w-[24vw]">
          <p className="font-display text-[clamp(1.6rem,2.6vw,2.6rem)] leading-snug italic">
            “A estética é o meio. <span className="text-terra">O desejo</span> é o
            resultado.”
          </p>
        </aside>
      </div>

      {/* lightbox */}
      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent
          className="w-[min(92vw,60vh)] md:w-auto"
          aria-describedby={undefined}
        >
          {lightbox && (
            <figure>
              <DialogTitle className="sr-only">
                {lightbox.title} — {lightbox.category}
              </DialogTitle>
              <DialogDescription className="sr-only">{lightbox.alt}</DialogDescription>
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                width={lightbox.width}
                height={lightbox.height}
                className="max-h-[82vh] w-auto max-w-[92vw]"
              />
              <figcaption className="mt-4 flex items-baseline justify-between gap-8">
                <span className="font-display text-bone text-xl italic">{lightbox.title}</span>
                <span className="editorial-label text-bone/70">{lightbox.category}</span>
              </figcaption>
            </figure>
          )}
          <DialogClose
            className="editorial-label text-bone/80 hover:text-bone absolute -top-10 right-0 transition-colors"
            aria-label="Fechar"
          >
            Fechar ✕
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  )
}
