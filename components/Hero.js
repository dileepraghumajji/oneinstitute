'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './Hero.module.css'
import { useLoading } from '@/context/LoadingContext'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const BoxingRing3D = dynamic(() => import('./BoxingRing3D'), {
  ssr: false,
  loading: () => null,
})

function handleMagnet(e) {
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const x = (e.clientX - rect.left - rect.width / 2) * 0.25
  const y = (e.clientY - rect.top - rect.height / 2) * 0.25
  btn.style.transform = `translate(${x}px, ${y}px)`
}

function resetMagnet(e) {
  const btn = e.currentTarget
  btn.style.transition = 'transform 400ms ease'
  btn.style.transform = 'translate(0, 0)'
  setTimeout(() => {
    if (btn) {
      btn.style.transition = ''
      btn.style.transform = ''
    }
  }, 400)
}

export default function Hero() {
  const { isLoaded } = useLoading()
  const container = useRef()
  const ringRef = useRef()
  const speedRef = useRef()
  const [punchSpeed, setPunchSpeed] = useState(null)
  const lastPunchTime = useRef(0)
  const inactivityTimer = useRef(null)

  // 5.2 — Punch-speed tracker
  useEffect(() => {
    const handlePunch = (e) => {
      const now = e.detail.time
      const delta = now - lastPunchTime.current
      lastPunchTime.current = now

      if (delta > 0 && delta < 2000) {
        const speed = Math.min(Math.round(1000 / delta * 30), 120)
        setPunchSpeed(speed)

        // Animate the number with GSAP
        if (speedRef.current) {
          gsap.fromTo(speedRef.current, { scale: 1.3 }, {
            scale: 1, duration: 0.3, ease: 'back.out(1.7)'
          })
        }

        // Shake the ring container
        if (ringRef.current) {
          gsap.to(ringRef.current, {
            x: '+=2', duration: 0.04, yoyo: true, repeat: 3, ease: 'none',
            onComplete: () => gsap.set(ringRef.current, { x: 0 })
          })
        }
      }

      // Reset after 3s of inactivity
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      inactivityTimer.current = setTimeout(() => setPunchSpeed(null), 3000)
    }

    window.addEventListener('ring-punch', handlePunch)
    return () => {
      window.removeEventListener('ring-punch', handlePunch)
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    }
  }, [])

  useGSAP(() => {
    if (!isLoaded) return

    const tl = gsap.timeline()

    // Ring crashes down
    tl.from(ringRef.current, {
      y: -700,
      opacity: 0,
      duration: 1.6,
      ease: 'bounce.out',
    })

    // Camera shake — ±4px on X after impact
    tl.to(ringRef.current, {
      x: 4,
      repeat: 3,
      yoyo: true,
      duration: 0.05,
      ease: 'none',
    })
    tl.set(ringRef.current, { x: 0 })
    tl.call(() => window.dispatchEvent(new CustomEvent('ring-impact')), null, '<')

    // Text reveals
    tl.from('.hero-text-anim', {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    }, '-=0.5')

    // 5.4 — Scroll-linked glow intensity
    ScrollTrigger.create({
      trigger: container.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const intensity = 1 - self.progress * 0.8 // range: 1.0 → 0.2
        window.dispatchEvent(new CustomEvent('ring-glow', {
          detail: { intensity }
        }))
      },
    })

  }, { scope: container, dependencies: [isLoaded] })

  return (
    <section className={styles.hero} ref={container}>

      {/* Full-bleed 3D ring — base environment layer */}
      <div className={styles.ringCol} ref={ringRef} data-cursor-crosshair>
        <BoxingRing3D />
      </div>

      {/* Top-left — round identifier */}
      <p className={`${styles.roundTag} hero-text-anim`}>
        [R 01] — ONE INSTITUTE OF MARTIAL ARTS
      </p>

      {/* Bottom-left — headline stack */}
      <div className={styles.bottomContent}>
        <p className={`${styles.sub} hero-text-anim`}>Boxing · Muaythai · Kickboxing</p>
        <h1 className={`${styles.headline} hero-text-anim`}>
          STEP IN.<br />
          ROUND <span className={styles.accentWord}>ONE</span><br />
          STARTS HERE.
        </h1>
        <div className={`${styles.ctaRow} hero-text-anim`}>
          <a
            href="#contact"
            className={styles.btnPrimary}
            onMouseMove={handleMagnet}
            onMouseLeave={resetMagnet}
          >Book a Class</a>
          <a
            href="#programs"
            className={styles.btnSecondary}
            onMouseMove={handleMagnet}
            onMouseLeave={resetMagnet}
          >View Programs</a>
        </div>
      </div>

      {/* Scroll hint — bottom left */}
      <div className={styles.scrollHint}>
        <span className={styles.scrollLine} />
        Scroll
      </div>

      {/* Location — bottom right */}
      <a
        href="https://maps.app.goo.gl/NueVZvaGrQJLBgBB8"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.locationPin}
        aria-label="Find ONE Institute on Google Maps"
      >
        <span className={styles.locationDot} />
        <MapPin size={14} strokeWidth={1.75} />
        Find Us
      </a>
      {/* 5.2 — Punch-speed panel */}
      <div className={`${styles.speedPanel} ${punchSpeed !== null ? styles.speedPanelVisible : ''}`}>
        <span className={styles.speedLabel}>PUNCH SPEED</span>
        <span className={styles.speedValue} ref={speedRef}>
          {punchSpeed !== null ? `${punchSpeed}` : '—'}
        </span>
        <span className={styles.speedUnit}>MPH</span>
      </div>

    </section>
  )
}
