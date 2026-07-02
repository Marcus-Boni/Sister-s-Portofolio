import { Fragment } from 'react'

import { cn } from '@/lib/utils'

const DEFAULT_ITEMS = ['Editorial', 'Moda', 'Lifestyle', 'Fitness', 'Beauty', 'UGC']

interface MarqueeProps {
  items?: string[]
  className?: string
}

/** Infinite editorial ticker — one consistent serif voice, terracotta dots. */
export function Marquee({ items = DEFAULT_ITEMS, className }: MarqueeProps) {
  const strip = (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <Fragment key={item}>
          <span className="font-display text-[clamp(2.4rem,5vw,4.8rem)] leading-none font-medium whitespace-nowrap">
            {item}
          </span>
          <span className="bg-terra mx-[3.2vw] size-2 shrink-0 rounded-full md:size-2.5" />
        </Fragment>
      ))}
    </div>
  )

  return (
    <div
      aria-hidden
      className={cn('border-line flex overflow-hidden border-y py-7 md:py-9', className)}
    >
      <div className="animate-marquee flex w-max">
        {strip}
        {strip}
      </div>
    </div>
  )
}
