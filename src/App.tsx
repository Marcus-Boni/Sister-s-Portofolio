import { useState } from 'react'

import { CustomCursor } from '@/components/chrome/CustomCursor'
import { GrainOverlay } from '@/components/chrome/GrainOverlay'
import { Marquee } from '@/components/chrome/Marquee'
import { Navbar } from '@/components/chrome/Navbar'
import { Preloader } from '@/components/chrome/Preloader'
import { SmoothScroll } from '@/components/providers/SmoothScroll'
import { Contato } from '@/components/sections/Contato'
import { Hero } from '@/components/sections/Hero'
import { Portfolio } from '@/components/sections/Portfolio'
import { Servicos } from '@/components/sections/Servicos'
import { Sobre } from '@/components/sections/Sobre'

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <SmoothScroll paused={!introDone}>
      <Preloader onReveal={() => setIntroDone(true)} />
      <CustomCursor />
      <GrainOverlay />
      <Navbar visible={introDone} />

      <main>
        <Hero active={introDone} />
        <Marquee />
        <Sobre />
        <Portfolio />
        <Servicos />
        <Contato />
      </main>
    </SmoothScroll>
  )
}
