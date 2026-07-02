# Portfólio — Isadora Galvão Boni

One-page editorial portfolio for model & digital influencer Isadora Galvão Boni
(Guarapari — ES). Designed as a living fashion-magazine issue: bone paper,
espresso ink, terracotta accents, Playfair Display display type over an Archivo
grotesque system.

## Stack

- **React 19 + TypeScript + Vite 8** (pnpm)
- **Tailwind CSS v4** (`@theme` design tokens in `src/index.css`) + `clsx` / `tailwind-merge`
- **Lenis** smooth scroll, driven by the GSAP ticker
- **GSAP + ScrollTrigger** — pinned horizontal gallery, parallax, reveals
- **SplitType** — masked line/word text reveals (`useEditorialReveal`)
- **Framer Motion** — navbar entrance, services accordion
- **React Three Fiber + drei** — hero WebGL plane with a custom GLSL
  liquid-displacement shader (mouse ripple + chromatic fringing), lazy-loaded
  into its own chunk
- **Radix Dialog** (shadcn-style wrapper in `src/components/ui/dialog.tsx`) — gallery lightbox

## Scripts

```bash
pnpm dev      # dev server (http://localhost:5173)
pnpm build    # type-check + production build
pnpm lint     # eslint
```

## Structure

```
src/
  data/site.ts            # all content: photos, services/pricing, contact, nav
  lib/gsap.ts             # central GSAP plugin registration
  hooks/                  # useEditorialReveal, usePrefersReducedMotion
  components/
    providers/            # SmoothScroll (Lenis) + lenis-context
    chrome/               # Preloader, Navbar, CustomCursor, GrainOverlay, Marquee
    webgl/                # HeroCanvas (R3F) + heroShader (GLSL)
    sections/             # Hero, Sobre, Portfolio, Servicos, Contato
    ui/                   # shadcn-style primitives (dialog)
scripts/                  # Python utilities that extracted/optimized the
                          # mídia-kit photos into public/images (*.webp)
```

## Content

All copy, pricing and contact data come from Isadora's mídia kit and live in
[`src/data/site.ts`](src/data/site.ts). Photos are optimized WebP (full +
`-800` small variants) in `public/images/`. To add a photo: drop the WebP
pair in `public/images/` and append an entry to `photos` in `site.ts`.

## Acessibilidade & performance

- Honors `prefers-reduced-motion` (static layout, no pin/WebGL)
- WebGL chunk is code-split and lazy; a plain `<img>` renders first for LCP
- All images have explicit dimensions (no layout shift); below-fold images lazy-load
- Custom cursor only mounts on fine-pointer devices
