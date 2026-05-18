'use client'

import { useRef } from 'react'
import { Link } from 'next-view-transitions'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './discipline.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function DisciplineContent({ breadcrumbLabel, overline, heroBgText, headline, heroMeta, pillars, slots, ctaText }) {
  const container = useRef()

  useGSAP(() => {
    gsap.from('.disc-hero-anim', {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
    })

    gsap.from('.disc-pillar-anim', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.disc-pillar-anim', start: 'top 85%' },
    })

    gsap.from('.disc-slot-anim', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.disc-slot-anim', start: 'top 85%' },
    })
  }, { scope: container })

  return (
    <div ref={container}>
      <section className={styles.hero}>
        <span aria-hidden="true" className={styles.heroBg}>{heroBgText}</span>
        <div className={`${styles.breadcrumb} disc-hero-anim`}>
          <Link href="/programs">Programs</Link>
          <span>/</span>
          <span>{breadcrumbLabel}</span>
        </div>
        <p className={`${styles.overline} disc-hero-anim`}>{overline}</p>
        <h1 className={`${styles.headline} disc-hero-anim`}>
          {headline.split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </h1>
        <div className={`${styles.heroMeta} disc-hero-anim`}>
          {heroMeta.map((item, i) => (
            <span key={i}>
              {i > 0 && <span className={styles.heroMetaDot} />}
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.pillars}>
        <p className={`${styles.pillarsLabel} disc-pillar-anim`}>[+] What You&apos;ll Learn</p>
        <div className={styles.pillarsGrid}>
          {pillars.map(p => (
            <div key={p.num} className={`${styles.pillar} disc-pillar-anim`}>
              <span className={styles.pillarNum}>{p.num}</span>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarDesc}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.scheduleSection}>
        <p className={styles.scheduleLabel}>[+] Training Schedule</p>
        <h2 className={styles.scheduleTitle}>WHEN WE TRAIN.</h2>
        <div className={styles.slots}>
          {slots.map((s, i) => (
            <div key={i} className={`${styles.slot} disc-slot-anim`}>
              <span className={styles.slotDay}>{s.day}</span>
              <span className={styles.slotTime}>{s.time}</span>
              <span className={styles.slotLevel}>{s.level}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <p className={styles.ctaText}>
          {ctaText.split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </p>
        <Link href="/contact" className={styles.ctaBtn}>
          Book First Class →
        </Link>
      </section>
    </div>
  )
}
