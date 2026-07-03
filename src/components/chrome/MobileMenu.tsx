import { AnimatePresence, motion } from 'framer-motion'

import { useLenisRef } from '@/components/providers/lenis-context'
import { contact, navLinks } from '@/data/site'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.15 } },
}

const panelVariants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.65, ease: [0.625, 0.05, 0, 1] },
  },
  exit: {
    clipPath: 'inset(0% 0% 100% 0%)',
    transition: { duration: 0.55, ease: [0.625, 0.05, 0, 1] },
  },
}

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
}

const itemVariants = {
  hidden: { yPercent: 110, opacity: 0 },
  visible: { yPercent: 0, opacity: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  exit: { yPercent: -30, opacity: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
}

const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const SOCIAL_LINKS = [
  { label: 'Instagram', href: contact.instagram.href, value: contact.instagram.label },
  { label: 'WhatsApp', href: contact.whatsapp.href, value: contact.whatsapp.label },
]

/**
 * Full-screen editorial mobile menu.
 * Clips in from the top with staggered nav items.
 * Only rendered in the DOM when open (AnimatePresence).
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const lenisRef = useLenisRef()

  const go = (href: string) => {
    onClose()
    // Small delay so the menu close animation starts before scroll
    setTimeout(() => {
      const target = document.querySelector(href)
      if (target instanceof HTMLElement) {
        lenisRef?.current?.scrollTo(target, { offset: 0, duration: 1.6 })
      }
    }, 350)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — closes menu on tap outside */}
          <motion.div
            key="overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[75] bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Menu panel */}
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-bone fixed inset-x-0 top-0 z-[80] flex flex-col px-7 pt-24 pb-10"
            style={{ minHeight: '100svh' }}
            role="dialog"
            aria-modal
            aria-label="Menu de navegação"
          >
            {/* Nav links */}
            <motion.nav
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-label="Navegação mobile"
            >
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <li key={link.href} className="border-line border-b first:border-t overflow-hidden py-1">
                    <motion.div variants={itemVariants}>
                      <button
                        type="button"
                        onClick={() => go(link.href)}
                        className="group flex w-full items-baseline gap-4 py-5 text-left"
                      >
                        <span className="editorial-label text-ink-soft w-7 shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="display-tight text-ink group-hover:text-terra text-[clamp(2.2rem,10vw,3.8rem)] font-semibold leading-none transition-colors duration-300">
                          {link.label}
                        </span>
                      </button>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.nav>

            {/* Social footer */}
            <motion.div
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-auto pt-10"
            >
              <p className="editorial-label text-ink-soft mb-5">Redes sociais</p>
              <div className="flex flex-col gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink hover:text-terra font-sans text-sm font-medium transition-colors duration-300"
                    onClick={onClose}
                  >
                    <span className="text-ink-soft mr-2 text-xs">{link.label}</span>
                    {link.value}
                  </a>
                ))}
              </div>

              <p className="editorial-label text-ink-soft mt-8 opacity-50">
                Isadora Galvão Boni — Guarapari, ES
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
