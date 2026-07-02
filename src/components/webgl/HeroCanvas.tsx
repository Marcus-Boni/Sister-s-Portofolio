import { useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'

import { gsap } from '@/lib/gsap'

import { heroFragmentShader, heroVertexShader } from './heroShader'

export interface PointerState {
  /** Normalized to the canvas: x 0..1 (left→right), y 0..1 (bottom→top). */
  x: number
  y: number
  lastX: number
  lastY: number
}

interface ShaderPlaneProps {
  src: string
  imageWidth: number
  imageHeight: number
  pointerRef: RefObject<PointerState>
  active: boolean
}

function configureTexture(texture: THREE.Texture | THREE.Texture[]) {
  for (const tex of Array.isArray(texture) ? texture : [texture]) {
    tex.colorSpace = THREE.NoColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.generateMipmaps = false
  }
}

function ShaderPlane({ src, imageWidth, imageHeight, pointerRef, active }: ShaderPlaneProps) {
  const texture = useTexture(src, configureTexture)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const strengthRef = useRef(0)
  const { viewport, size } = useThree()

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uPlaneRes: { value: new THREE.Vector2(1, 1) },
      uImageRes: { value: new THREE.Vector2(imageWidth, imageHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uStrength: { value: 0 },
      uZoom: { value: 1.35 },
    }),
    // texture identity is stable for a given src
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    if (active) {
      gsap.to(uniforms.uZoom, { value: 1, duration: 2.2, ease: 'expo.out', delay: 0.15 })
    }
  }, [active, uniforms])

  useFrame((_, delta) => {
    const mat = materialRef.current
    if (!mat) return
    const pointer = pointerRef.current

    mat.uniforms.uTime.value += delta
    mat.uniforms.uPlaneRes.value.set(size.width, size.height)

    const mouse = mat.uniforms.uMouse.value as THREE.Vector2
    mouse.x += (pointer.x - mouse.x) * 0.08
    mouse.y += (pointer.y - mouse.y) * 0.08

    const deltaX = pointer.x - pointer.lastX
    const deltaY = pointer.y - pointer.lastY
    pointer.lastX = pointer.x
    pointer.lastY = pointer.y

    // strength rises quickly on cursor movement, drains slowly
    const target = Math.min(Math.hypot(deltaX, deltaY) * 34, 1)
    strengthRef.current += (target - strengthRef.current) * (target > strengthRef.current ? 0.16 : 0.045)
    mat.uniforms.uStrength.value = strengthRef.current
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={heroVertexShader}
        fragmentShader={heroFragmentShader}
      />
    </mesh>
  )
}

interface HeroCanvasProps {
  src: string
  imageWidth: number
  imageHeight: number
  pointerRef: RefObject<PointerState>
  active: boolean
  inView: boolean
}

/** Full-bleed WebGL plane with liquid mouse displacement. */
export function HeroCanvas({ src, imageWidth, imageHeight, pointerRef, active, inView }: HeroCanvasProps) {
  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      frameloop={inView ? 'always' : 'never'}
      camera={{ fov: 50, position: [0, 0, 2] }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      className="absolute inset-0"
      aria-hidden
    >
      <Suspense fallback={null}>
        <ShaderPlane
          src={src}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          pointerRef={pointerRef}
          active={active}
        />
      </Suspense>
    </Canvas>
  )
}
