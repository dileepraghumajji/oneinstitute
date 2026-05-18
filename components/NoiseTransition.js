'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Full-screen quad shaders — heat-shimmer noise overlay
const VERT = /* glsl */`
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const FRAG = /* glsl */`
  uniform float uProgress;
  uniform float uTime;
  uniform vec2  uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float n  = smoothNoise(uv * 6.0 + uTime * 0.4);
    float n2 = smoothNoise(uv * 12.0 - uTime * 0.3);
    float combined = (n + n2 * 0.5) / 1.5;
    float alpha = combined * uProgress * 0.22;
    gl_FragColor = vec4(1.0, 0.325, 0.0, alpha);
  }
`

function NoiseQuad() {
  const matRef    = useRef()
  const progress  = useRef({ value: 0 })

  const uniforms = useMemo(() => ({
    uProgress:   { value: 0 },
    uTime:       { value: 0 },
    uResolution: { value: new Float32Array([1, 1]) },
  }), [])

  // Wire ScrollTrigger on section entries after loading screen clears
  useEffect(() => {
    const setupTriggers = () => {
      const sections = document.querySelectorAll('main section')
      sections.forEach((sec, i) => {
        if (i === 0) return // skip hero
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 88%',
          onEnter: () => {
            gsap.killTweensOf(progress.current)
            gsap.to(progress.current, {
              value: 1, duration: 0.3, ease: 'power2.in',
              onComplete: () => gsap.to(progress.current, { value: 0, duration: 0.3, ease: 'power2.out' }),
            })
          },
        })
      })
    }
    const timer = setTimeout(setupTriggers, 2600)
    return () => clearTimeout(timer)
  }, [])

  useFrame(({ clock, size }) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value       = clock.getElapsedTime()
    matRef.current.uniforms.uProgress.value   = progress.current.value
    matRef.current.uniforms.uResolution.value = new Float32Array([size.width, size.height])
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function NoiseTransition() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Skip on low-end devices or mobile
    if (navigator.hardwareConcurrency >= 4 && !('ontouchstart' in window)) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', inset: 0,
      width: '100vw', height: '100vh',
      zIndex: 1, pointerEvents: 'none',
      mixBlendMode: 'overlay',
    }}>
      <Canvas
        orthographic
        camera={{ near: -1, far: 1 }}
        gl={{ alpha: true, antialias: false }}
      >
        <NoiseQuad />
      </Canvas>
    </div>
  )
}
