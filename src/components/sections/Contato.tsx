import { motion } from 'framer-motion'
import { useRef } from 'react'

import { contact } from '@/data/site'
import { useEditorialReveal } from '@/hooks/useEditorialReveal'
import { gsap, useGSAP } from '@/lib/gsap'

const LINKS = [
  { key: 'instagram', label: 'Instagram', value: contact.instagram.label, href: contact.instagram.href },
  { key: 'whatsapp', label: 'WhatsApp', value: contact.whatsapp.label, href: contact.whatsapp.href },
  { key: 'email', label: 'E-mail', value: contact.email.label, href: contact.email.href },
]

export function Contato() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useEditorialReveal<HTMLHeadingElement>({ stagger: 0.07 })

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.fromTo(
        '[data-contact-row]',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-contact-list]', start: 'top 85%', once: true },
        },
      )
      gsap.fromTo(
        '[data-ghost-name]',
        { yPercent: 30 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="bg-ink text-bone relative overflow-hidden px-[5vw] pt-[18svh] pb-12"
    >
      <p className="editorial-label text-bone/50 mb-10">Contato — Nº 05</p>

      <h2
        ref={headlineRef}
        className="display-tight max-w-[10ch] text-[clamp(3rem,11vw,10.5rem)] font-semibold"
      >
        Vamos trabalhar <em className="text-terra font-medium">juntos?</em>
      </h2>

      <ul data-contact-list className="mt-20 md:mt-28">
        {LINKS.map((link) => (
          <li key={link.key} data-contact-row className="border-bone/15 border-t last:border-b">
            <motion.a
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              className="flex flex-col gap-2 py-7 md:flex-row md:items-baseline md:justify-between md:gap-x-10 md:py-9"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <span className="editorial-label text-bone/60 md:w-28">{link.label}</span>
              <motion.span
                className="font-display flex-1 text-[clamp(1.45rem,3.6vw,2.9rem)] leading-tight font-medium [overflow-wrap:anywhere]"
                variants={{
                  rest: { x: 0, color: 'rgb(242 237 228)' },
                  hover: { x: 12, color: 'var(--color-terra)' },
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {link.value}
              </motion.span>
              <motion.span
                aria-hidden
                className="text-terra hidden text-2xl md:block md:text-4xl"
                variants={{
                  rest: { opacity: 0, y: 8 },
                  hover: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                ↗
              </motion.span>
            </motion.a>
          </li>
        ))}
      </ul>

      <div className="text-bone/40 mt-20 flex flex-col gap-3 md:mt-36 md:flex-row md:flex-wrap md:items-baseline md:justify-between md:gap-4">
        <p className="editorial-label">© 2026 Isadora Galvão Boni</p>
        <p className="editorial-label">{contact.location}</p>
        <p className="editorial-label">Portfólio — Edição Nº 01</p>
      </div>

      <p
        data-ghost-name
        aria-hidden
        className="display-tight text-outline-bone pointer-events-none mt-8 -mb-[4vw] text-center text-[22vw] leading-none font-bold whitespace-nowrap opacity-20 md:text-[19.5vw] md:opacity-25"
      >
        ISADORA
      </p>
    </section>
  )
}
