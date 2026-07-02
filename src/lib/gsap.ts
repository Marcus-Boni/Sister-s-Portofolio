import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

gsap.defaults({ ease: 'power3.out', duration: 1 })

export { gsap, ScrollTrigger, useGSAP }
