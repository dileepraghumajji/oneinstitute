'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ChevronRight } from 'lucide-react'
import styles from './Programs.module.css'

gsap.registerPlugin(ScrollTrigger)

const programs = [
  {
    number: '[01]',
    name: 'Boxing',
    schedule: '4× / week',
    days: 'Mon · Tue · Thu · Fri',
    desc: 'Pure sweet science. Footwork, combinations, defence — trained the way it\'s meant to be. No filler.',
  },
  {
    number: '[02]',
    name: 'Muaythai',
    schedule: '3× / week',
    days: 'Tue · Thu · Sat',
    desc: 'Eight weapons. Clinch work, elbows, knees, kicks. Thailand\'s art, trained seriously.',
  },
  {
    number: '[03]',
    name: 'Kickboxing K1',
    schedule: '2× / week',
    days: 'Wed · Sat',
    desc: 'Dynamic combinations, high kicks, European ruleset. Competitive coaching, no shortcuts.',
  },
  {
    number: '[04]',
    name: 'Low Kick',
    schedule: '2× / week',
    days: 'Mon · Fri',
    desc: 'Ground-level game. Low kicks, cuts, sweeps. Full contact. This one leaves marks.',
  },
]

export default function Programs() {
  const container = useRef()

  useGSAP(() => {
    const mm = gsap.matchMedia()

    // Desktop: pinned horizontal card reveal
    mm.add('(min-width: 769px)', () => {
      gsap.from('.programs-header-anim', {
        x: -60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%',
        }
      })

      const cards = Array.from(
        container.current.querySelectorAll('.program-card-anim')
      )

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      })

      cards.forEach((card, i) => {
        tl.from(card, { x: '110vw', ease: 'power2.out', duration: 1 }, i * 0.3)
      })
    })

    // Mobile: simple vertical stagger
    mm.add('(max-width: 768px)', () => {
      gsap.from('.programs-header-anim', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.programs-header-anim',
          start: 'top 85%',
        }
      })

      gsap.from('.program-card-anim', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.program-card-anim',
          start: 'top 80%',
        }
      })
    })
  }, { scope: container })

  return (
    <section className={styles.section} id="programs" ref={container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={`${styles.overline} programs-header-anim`}>[+] Disciplines</p>
            <h2 className={`${styles.title} programs-header-anim`}>
              TRAIN.<br />
              SPAR.<br />
              WIN.
            </h2>
          </div>
          <div className={styles.headerRight}>
            <a href="#contact" className={styles.seeAll}>
              Full Schedule <ChevronRight size={16} strokeWidth={1.75} />
            </a>
          </div>
        </div>

        <div className={styles.grid}>
          {programs.map(p => (
            <div key={p.number} className={`${styles.card} program-card-anim`}>
              <span className={styles.cardNumber}>{p.number}</span>
              <h3 className={styles.cardName}>{p.name}</h3>
              <div className={styles.divider} />
              <span className={styles.schedule}>{p.schedule}</span>
              <span className={styles.days}>{p.days}</span>
              <p className={styles.desc}>{p.desc}</p>
              <a href="#contact" className={styles.cardCta}>
                Book session <ChevronRight size={14} strokeWidth={1.75} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
