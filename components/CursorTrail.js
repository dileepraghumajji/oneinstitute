'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

// Invisible mesh that follows cursor in orthographic world space
function TrailMesh({ mouseRef }) {
  const meshRef = useRef()
  const { size, viewport } = useThree()

  useFrame(() => {
    if (!meshRef.current) return
    const mx = mouseRef.current.x
    const my = mouseRef.current.y
    // Map screen coords to orthographic world space (1 unit = 1 px with zoom=1)
    meshRef.current.position.x = mx - size.width / 2
    meshRef.current.position.y = -(my - size.height / 2)
    meshRef.current.position.z = 0
  })

  return (
    <Trail
      width={4}
      length={24}
      color={new THREE.Color(0xFF5300)}
      attenuation={(t) => t}
    >
      <mesh ref={meshRef} visible={false}>
        <sphereGeometry args={[0.5, 4, 4]} />
        <meshBasicMaterial />
      </mesh>
    </Trail>
  )
}

export default function CursorTrail() {
  const [inHero, setInHero]   = useState(false)
  const [ready, setReady]     = useState(false)
  const mouseRef              = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window) return
    setReady(true)

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      const hero = document.querySelector('section.hero, section:first-of-type')
      if (hero) {
        const { top, bottom } = hero.getBoundingClientRect()
        setInHero(e.clientY >= top && e.clientY <= bottom)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (!ready) return null

  return (
    <div style={{
      position: 'fixed', inset: 0,
      zIndex: 9999, pointerEvents: 'none',
      opacity: inHero ? 1 : 0,
      transition: 'opacity 600ms ease',
    }}>
      <Canvas
        orthographic
        camera={{ zoom: 1, near: -10, far: 10 }}
        gl={{ alpha: true, antialias: true }}
      >
        <TrailMesh mouseRef={mouseRef} />
      </Canvas>
    </div>
  )
}
