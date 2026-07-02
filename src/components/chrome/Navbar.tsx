import { motion, useScroll, useTransform } from 'framer-motion'

import { useLenisRef } from '@/components/providers/lenis-context'
import { navLinks } from '@/data/site'

interface NavbarProps {
  visible: boolean
}

/**
 * Fixed editorial masthead with frosted-glass backdrop.
 * Reads cleanly over all sections without mix-blend tricks.
 */
export function Navbar({ visible }: NavbarProps) {
  const lenisRef = useLenisRef()
  const { scrollY } = useScroll()

  // Background opacity: 0 at top of page, 1 after 80px scroll
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1])
  // Border opacity: fades in slightly later
  const borderOpacity = useTransform(scrollY, [40, 120], [0, 0.12])

  const go = (href: string) => {
    const target = document.querySelector(href)
    if (target instanceof HTMLElement) {
      lenisRef?.current?.scrollTo(target, { offset: 0, duration: 1.6 })
    }
  }

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : undefined}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
      className="fixed inset-x-0 top-0 z-[70]"
    >
      {/* Frosted backdrop — fades in on scroll */}
      <motion.div
        aria-hidden
        className="absolute inset-0 backdrop-blur-md"
        style={{
          opacity: bgOpacity,
          background: 'linear-gradient(to bottom, rgba(242,237,228,0.94) 0%, rgba(242,237,228,0.88) 100%)',
        }}
      />
      {/* Bottom border — appears on scroll */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-ink"
        style={{ opacity: borderOpacity }}
      />

      <nav className="relative flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <button
          type="button"
          onClick={() => lenisRef?.current?.scrollTo(0, { duration: 1.6 })}
          className="font-display text-ink text-lg leading-none font-semibold tracking-tight italic transition-colors duration-300 hover:text-terra md:text-xl"
        >
          Isadora G·B
        </button>

        <p className="editorial-label text-ink-soft hidden opacity-75 md:block">
          Modelo &amp; Digital Influencer
        </p>

        <ul className="flex items-center gap-5 md:gap-8">
          {navLinks.map((link) => (
            <li key={link.href} className={link.href === '#contato' ? '' : 'hidden sm:block'}>
              <button
                type="button"
                onClick={() => go(link.href)}
                className="editorial-label text-ink group relative py-1 transition-colors duration-300 hover:text-terra"
              >
                {link.label}
                <span className="bg-terra absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  )
}
