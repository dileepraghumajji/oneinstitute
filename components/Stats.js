'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Stats.module.css'

const stats = [
  { value: '5AM',  label: 'First class',         tag: 'Daily' },
  { value: '4×',   label: 'Boxing sessions / wk', tag: 'Boxing' },
  { value: '3×',   label: 'Muaythai sessions / wk', tag: 'Muaythai' },
  { value: '12',   label: 'Round limit',          tag: 'Sparring' },
]

export default function Stats() {
  const container = useRef()

  useGSAP(() => {
    gsap.from('.stat-item-anim', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      }
    })
  }, { scope: container })

  return (
    <section className={styles.section} ref={container}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {stats.map(s => (
            <div key={s.label} className={`${styles.stat} stat-item-anim`}>
              <span className={styles.tag}>{s.tag}</span>
              <span className={styles.value}>{s.value}</span>
              <span className={styles.label}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
