'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Link } from 'next-view-transitions'
import { MapPin } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'
import styles from './Hero.module.css'
import { useLoading } from '@/context/LoadingContext'
import { useSound } from '@/context/SoundContext'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const BoxingRing3D = dynamic(() => import('./BoxingRing3DF'), {
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
  const { playSound } = useSound()
  const container = useRef()
  const ringRef = useRef()
  const speedRef = useRef()
  const lastGlowRef = useRef(1)
  const lastOpacityRef = useRef('1')
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

        // 8.3 — Play punch sound on each registered click
        playSound('punch')

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

    const headlineEl = container.current.querySelector('.hero-headline')
    const split = new SplitType(headlineEl, { types: 'chars' })

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

    // Headline — letter-by-letter burst reveal
    tl.from(split.chars, {
      y: 80,
      opacity: 0,
      rotation: -8,
      skewX: 12,
      duration: 0.7,
      stagger: 0.04,
      ease: 'power4.out',
    }, '-=0.4')

    // Supporting text fade-in
    tl.from('.hero-text-anim', {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    }, '-=0.5')

    // 17.1 — Ring recedes as hero scrolls out
    gsap.to(ringRef.current, {
      scale: 0.7,
      y: -80,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    })

    // 5.4 + 17.1 — Scroll-linked glow intensity + overlay fade
    ScrollTrigger.create({
      trigger: container.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        // Quantise to 5% steps — reduces CustomEvent allocations from 60/s to ~4/s
        const intensity = Math.round((1 - self.progress * 0.8) * 20) / 20
        if (intensity !== lastGlowRef.current) {
          lastGlowRef.current = intensity
          window.dispatchEvent(new CustomEvent('ring-glow', { detail: { intensity } }))
        }
        // Two-decimal opacity string — avoids cascade recalc on imperceptible changes
        const opacity = (1 - self.progress).toFixed(2)
        if (opacity !== lastOpacityRef.current) {
          lastOpacityRef.current = opacity
          container.current.style.setProperty('--hero-before-opacity', opacity)
        }
      },
    })

    // 8.3 — Play whoosh once when hero scrolls out of viewport
    ScrollTrigger.create({
      trigger: container.current,
      start: 'bottom top',
      once: true,
      onEnter: () => playSound('whoosh'),
    })

    return () => split.revert()

  }, { scope: container, dependencies: [isLoaded] })

  return (
    <section className={styles.hero} ref={container}>
      <span aria-hidden="true" className="sectionNum">[S 01]</span>

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
        <h1 className={`${styles.headline} hero-headline`}>
          STEP IN.<br />
          ROUND <span className={styles.accentWord}>ONE</span><br />
          STARTS HERE.
        </h1>
        <div className={`${styles.ctaRow} hero-text-anim`}>
          <Link
            href="/contact"
            className={styles.btnPrimary}
            onMouseMove={handleMagnet}
            onMouseLeave={resetMagnet}
          >Book a Class</Link>
          <Link
            href="/programs"
            className={styles.btnSecondary}
            onMouseMove={handleMagnet}
            onMouseLeave={resetMagnet}
          >View Programs</Link>
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
