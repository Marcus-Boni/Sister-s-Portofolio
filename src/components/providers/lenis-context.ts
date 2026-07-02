import type Lenis from 'lenis'
import { createContext, use, type RefObject } from 'react'

export const LenisContext = createContext<RefObject<Lenis | null> | null>(null)

/** Returns the live Lenis ref — read `.current` at call time. */
export function useLenisRef() {
  return use(LenisContext)
}
