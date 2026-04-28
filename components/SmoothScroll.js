'use client'

import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.normalizeScroll(true)
}

function GSAPBridge() {
  const lenis = useLenis(ScrollTrigger.update)

  useEffect(() => {
    if (!lenis) return
    gsap.ticker.lagSmoothing(0)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [lenis])

  return null
}

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root autoRaf={false} options={{ lerp: 0.1, duration: 1.5, smoothTouch: false }}>
      <GSAPBridge />
      {children}
    </ReactLenis>
  )
}
