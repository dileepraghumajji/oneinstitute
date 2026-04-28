'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Hero.module.css'

const BoxingRing3D = dynamic(() => import('./BoxingRing3D'), { ssr: false })

export default function Hero() {
  const container = useRef()
  const ringRef = useRef()

  useGSAP(() => {
    const tl = gsap.timeline()

    // Text stagger animation
    tl.from('.hero-text-anim', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2, // slight delay on load
    })

    // 3D Ring fall and bounce animation
    tl.from(ringRef.current, {
      y: -500, // fall from top
      opacity: 0,
      duration: 1.5,
      ease: 'bounce.out',
    }, '-=0.5') // overlap with text animation slightly
  }, { scope: container })

  return (
    <section className={styles.hero} ref={container}>
      {/* Left — text */}
      <div className={styles.textCol}>
        <p className={`${styles.roundTag} hero-text-anim`}>[R 01] — ONE INSTITUTE OF MARTIAL ARTS</p>

        <h1 className={`${styles.headline} hero-text-anim`}>
          STEP IN.<br />
          ROUND<br />
          <span className={styles.accentWord}>ONE</span><br />
          STARTS<br />
          HERE.
        </h1>

        <p className={`${styles.sub} hero-text-anim`}>Boxing · Muaythai · Kickboxing</p>

        <div className={`${styles.ctaRow} hero-text-anim`}>
          <a href="#contact" className={styles.btnPrimary}>Book a Class</a>
          <a href="#programs" className={styles.btnSecondary}>View Programs</a>
        </div>
      </div>

      {/* Right — 3D ring */}
      <div className={styles.ringCol} ref={ringRef}>
        <BoxingRing3D />
      </div>

      {/* Scroll hint — bottom left */}
      <div className={styles.scrollHint}>
        <span className={styles.scrollLine} />
        Scroll
      </div>

      {/* Location pin — bottom right */}
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
