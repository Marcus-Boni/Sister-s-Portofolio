import { motion } from 'framer-motion'
import { useRef } from 'react'

import { manifesto, niches, sobrePhoto, sobrePhotoDetail } from '@/data/site'
import { useEditorialReveal } from '@/hooks/useEditorialReveal'
import { gsap, useGSAP } from '@/lib/gsap'

export function Sobre() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useEditorialReveal<HTMLHeadingElement>()
  const manifestoRef = useEditorialReveal<HTMLParagraphElement>({ stagger: 0.04 })

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // portrait drifts slower than the page; the detail plate drifts faster
      gsap.fromTo(
        '[data-sobre-portrait]',
        { y: 60 },
        {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
      gsap.fromTo(
        '[data-sobre-detail]',
        { y: 110 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )

      gsap.fromTo(
        '[data-niche-row]',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.09,
          scrollTrigger: { trigger: '[data-niche-list]', start: 'top 80%', once: true },
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="relative px-[5vw] py-[16svh] md:py-[20svh]"
    >
      <div className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-[3vw]">
        {/* heading block */}
        <div className="md:col-span-7">
          <p className="editorial-label text-ink-soft mb-8 md:mb-12">Sobre — Nº 02</p>
          <h2
            ref={headlineRef}
            className="display-tight text-[clamp(2.6rem,6.5vw,6.2rem)] font-semibold"
          >
            Estética cuidada, <em className="text-terra font-medium">presença</em> autêntica.
          </h2>
          <p
            ref={manifestoRef}
            className="text-ink-soft mt-10 max-w-[34rem] text-base leading-relaxed md:mt-16 md:text-lg"
          >
            {manifesto}
          </p>

          <div className="mt-12 flex items-center gap-6 md:mt-20">
            <span className="bg-terra size-2 rounded-full" />
            <p className="editorial-label text-ink-soft">
              Disponível para campanhas, catálogos &amp; collabs
            </p>
          </div>
        </div>

        {/* portrait spread */}
        <div className="relative md:col-span-5">
          <div data-sobre-portrait className="relative ml-auto w-[78%] md:w-[86%]">
            <p className="editorial-label text-ink-soft mb-4 flex justify-between">
              <span>{sobrePhoto.title}</span>
              <span>{sobrePhoto.category}</span>
            </p>
            <img
              src={sobrePhoto.src}
              alt={sobrePhoto.alt}
              width={sobrePhoto.width}
              height={sobrePhoto.height}
              loading="lazy"
              className="aspect-[1200/1600] w-full object-cover"
            />
          </div>
          <div
            data-sobre-detail
            className="border-bone bg-bone absolute -bottom-16 left-0 w-[42%] rotate-[-4deg] border-8 shadow-[0_24px_60px_rgb(27_21_17/0.18)] md:-left-10 md:w-[38%]"
          >
            <img
              src={sobrePhotoDetail.small}
              alt={sobrePhotoDetail.alt}
              width={sobrePhotoDetail.width}
              height={sobrePhotoDetail.height}
              loading="lazy"
              className="aspect-[1064/1600] w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* niches index */}
      <div data-niche-list className="mt-28 md:mt-40">
        <p className="editorial-label text-ink-soft mb-6">Versatilidade / Nichos</p>
        <ul>
          {niches.map((niche) => (
            <motion.li
              key={niche.index}
              data-niche-row
              className="border-line flex cursor-default items-baseline justify-between border-t py-5 last:border-b md:py-7"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              {/* index number */}
              <motion.span
                className="font-sans text-ink-soft w-16 text-sm italic md:text-base"
                variants={{
                  rest: { opacity: 0.5 },
                  hover: { opacity: 1 },
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {niche.index}
              </motion.span>

              {/* label */}
              <motion.span
                className="font-display flex-1 text-[clamp(1.7rem,4.5vw,3.6rem)] leading-none font-medium"
                variants={{
                  rest: { x: 0, color: 'var(--color-ink)' },
                  hover: { x: 12, color: 'var(--color-terra)' },
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {niche.label}
              </motion.span>

              {/* arrow */}
              <motion.span
                aria-hidden
                className="text-terra text-xl md:text-3xl"
                variants={{
                  rest: { opacity: 0, y: 8 },
                  hover: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                →
              </motion.span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
