import { useRef } from 'react'
import SplitType from 'split-type'

import { gsap, useGSAP } from '@/lib/gsap'

interface EditorialRevealOptions {
  /** ScrollTrigger start position. Default: 'top 82%' */
  start?: string
  /** Seconds before the stagger begins once triggered. */
  delay?: number
  /** Stagger between lines, in seconds. */
  stagger?: number
  /** Animate immediately instead of waiting for scroll. */
  immediate?: boolean
}

/**
 * Splits the element's text into masked lines and slides them up
 * when the element scrolls into view — the signature editorial reveal.
 * The split is reverted once the animation completes so text reflows
 * naturally on resize.
 */
export function useEditorialReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: EditorialRevealOptions = {},
) {
  const { start = 'top 82%', delay = 0, stagger = 0.09, immediate = false } = options
  const ref = useRef<T>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.classList.add('reveal-lines')
    const split = new SplitType(el, { types: 'lines,words', tagName: 'span' })
    if (!split.words?.length) return

    gsap.set(el, { visibility: 'visible' })
    gsap.fromTo(
      split.words,
      { yPercent: 120 },
      {
        yPercent: 0,
        duration: 1.25,
        ease: 'power4.out',
        stagger,
        delay,
        scrollTrigger: immediate
          ? undefined
          : { trigger: el, start, once: true },
        onComplete: () => {
          split.revert()
          el.classList.remove('reveal-lines')
        },
      },
    )
  }, [])

  return ref
}
