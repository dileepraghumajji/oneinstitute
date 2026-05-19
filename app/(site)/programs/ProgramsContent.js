'use client'

import { useRef } from 'react'
import { Link } from 'next-view-transitions'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './page.module.css'

gsap.registerPlugin(ScrollTrigger)

const disciplines = [
  {
    num: '[01]',
    name: 'Boxing',
    slug: 'boxing',
    schedule: '4× / week',
    days: 'Mon · Tue · Thu · Fri',
    videoSrc: '/videos/boxing.mp4',
  },
  {
    num: '[02]',
    name: 'Muaythai',
    slug: 'muaythai',
    schedule: '3× / week',
    days: 'Tue · Thu · Sat',
    videoSrc: '/videos/muaythai.mp4',
  },
  {
    num: '[03]',
    name: 'Kickboxing K1',
    slug: 'kickboxing',
    schedule: '2× / week',
    days: 'Wed · Sat',
    videoSrc: '/videos/kickboxing.mp4',
  },
  {
    num: '[04]',
    name: 'Low Kick',
    slug: 'lowkick',
    schedule: '2× / week',
    days: 'Mon · Fri',
    videoSrc: '/videos/lowkick.mp4',
  },
]

function handleEnter(e) {
  const v = e.currentTarget.querySelector('video')
  if (v) v.play().catch(() => {})
}

function handleLeave(e) {
  const v = e.currentTarget.querySelector('video')
  if (v) { v.pause(); v.currentTime = 0 }
}

export default function ProgramsContent() {
  const container = useRef()

  useGSAP(() => {
    gsap.from('.prog-hero-anim', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out',
    })

    gsap.from('.prog-card-anim', {
      x: -60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.prog-card-anim',
        start: 'top 85%',
      },
    })
  }, { scope: container })

  return (
    <div ref={container}>
      <section className={styles.hero}>
        <p className={`${styles.overline} prog-hero-anim`}>[+] All Disciplines</p>
        <h1 className={`${styles.headline} prog-hero-anim`}>
          FOUR DISCIPLINES.<br />
          ONE STANDARD.
        </h1>
      </section>

      <div className={styles.cards}>
        {disciplines.map(d => (
          <Link
            key={d.slug}
            href={`/programs/${d.slug}`}
            className={`${styles.card} prog-card-anim`}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <video
              className={styles.cardVideo}
              src={d.videoSrc}
              muted
              loop
              playsInline
              preload="none"
            />
            <span className={styles.cardNum}>{d.num}</span>
            <span className={styles.cardName}>{d.name}</span>
            <div className={styles.cardMeta}>
              <span className={styles.cardSchedule}>{d.schedule}</span>
              <span className={styles.cardDays}>{d.days}</span>
            </div>
            <span className={styles.cardArrow}>→</span>
          </Link>
        ))}
      </div>

      <div className={styles.cta}>
        <div>
          <p className={styles.ctaText}>
            FIRST CLASS<br />
            IS ON <em>US.</em>
          </p>
          <p className={styles.ctaSub}>Walk-ins welcome · No sign-up fee · All levels</p>
        </div>
        <Link href="/contact" className={styles.ctaBtn}>Book Your First Class</Link>
      </div>
    </div>
  )
}
