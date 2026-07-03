import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'

import { services, type Service } from '@/data/site'
import { useEditorialReveal } from '@/hooks/useEditorialReveal'
import { ScrollTrigger } from '@/lib/gsap'
import { cn } from '@/lib/utils'

function ServiceRow({
  service,
  open,
  onToggle,
}: {
  service: Service
  open: boolean
  onToggle: () => void
}) {
  return (
    <li className="border-ink/15 border-t last:border-b">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
    className="grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-3 py-6 text-left md:grid-cols-[5rem_1fr_auto_4rem] md:gap-4 md:py-10"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <motion.span
          className="font-display text-ink-soft text-sm italic md:text-lg"
          variants={{
            rest: { opacity: 0.5 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {service.index}
        </motion.span>
        <motion.span
          className="font-display text-[clamp(1.6rem,4.2vw,3.4rem)] leading-none font-medium"
          variants={{
            rest: { x: 0, color: open ? 'var(--color-terra-deep)' : 'var(--color-ink)' },
            hover: { x: 8, color: open ? 'var(--color-terra-deep)' : 'var(--color-terra)' },
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {service.title}
        </motion.span>
        <span className="editorial-label text-ink-soft md:block">
          a partir de{' '}
          <span className="font-display text-ink text-base tracking-normal normal-case italic">
            {service.fromPrice}
          </span>
        </span>
        <motion.span
          aria-hidden
          className={cn('font-display justify-self-end text-2xl leading-none md:text-4xl', open ? 'text-terra' : 'text-ink')}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          +
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => ScrollTrigger.refresh()}
            className="overflow-hidden"
          >
            <div className="grid gap-x-[3vw] gap-y-8 pb-10 md:grid-cols-[5rem_1fr] md:pb-14">
              <span className="hidden md:block" />
              <div>
                <p className="text-ink-soft max-w-[36rem] text-sm leading-relaxed md:text-base">
                  {service.blurb}
                </p>
                <dl className="mt-8">
                  {service.items.map((item) => (
                    <div
                      key={item.label}
                      className="border-ink/10 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t py-5 first:border-t-0 md:py-6"
                    >
                      <dt className="editorial-label text-ink-soft flex-1">{item.label}</dt>
                      <dd className="flex items-baseline gap-3">
                        <span className="font-display text-ink text-2xl italic md:text-3xl">
                          <span className="text-terra text-lg md:text-xl">R$</span>
                          {item.price.replace('R$', '')}
                        </span>
                        {item.note && (
                          <span className="editorial-label bg-terra/10 text-terra rounded-sm px-2 py-[3px]">
                            {item.note}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export function Servicos() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useEditorialReveal<HTMLHeadingElement>()
  const [open, setOpen] = useState<string | null>('ensaio')

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className="bg-bone-deep relative px-[5vw] py-[16svh] md:py-[18svh]"
    >
      <div className="mb-16 flex flex-wrap items-end justify-between gap-8 md:mb-24">
        <div>
          <p className="editorial-label text-ink-soft mb-8">Serviços — Nº 04</p>
          <h2
            ref={headlineRef}
            className="display-tight max-w-[12ch] text-[clamp(2.6rem,7vw,6.6rem)] font-semibold"
          >
            Serviços &amp; <em className="text-terra font-medium">investimento</em>
          </h2>
        </div>
        <p className="editorial-label text-ink-soft max-w-60 leading-relaxed">
          Valores base — projetos sob medida via WhatsApp
        </p>
      </div>

      <ul>
        {services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            open={open === service.id}
            onToggle={() => setOpen(open === service.id ? null : service.id)}
          />
        ))}
      </ul>
    </section>
  )
}
