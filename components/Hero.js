'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Hero.module.css'
import { useLoading } from '@/context/LoadingContext'

const BoxingRing3D = dynamic(() => import('./BoxingRing3D'), { ssr: false })

export default function Hero() {
  const { isLoaded } = useLoading()
  const container = useRef()
  const ringRef = useRef()

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

  }, { scope: container, dependencies: [isLoaded] })

  return (
    <section className={styles.hero} ref={container}>

      {/* Full-bleed 3D ring — base environment layer */}
      <div className={styles.ringCol} ref={ringRef}>
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
          <a href="#contact" className={styles.btnPrimary}>Book a Class</a>
          <a href="#programs" className={styles.btnSecondary}>View Programs</a>
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
      >
        <span className={styles.locationDot} />
        <MapPin size={14} strokeWidth={1.75} />
        Find Us
      </a>

    </section>
  )
}
