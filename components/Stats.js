'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './Stats.module.css'

const stats = [
  { value: '5AM',  label: 'First class',           tag: 'Daily',    numeric: false },
  { value: '4×',   label: 'Boxing sessions / wk',  tag: 'Boxing',   numeric: false },
  { value: '3×',   label: 'Muaythai sessions / wk', tag: 'Muaythai', numeric: false },
  { value: '12',   label: 'Round limit',            tag: 'Sparring', numeric: true  },
]

export default function Stats() {
  const container = useRef()
  const counterRef = useRef(null)

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

    ScrollTrigger.create({
      trigger: container.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (!counterRef.current) return
        counterRef.current.textContent = '0'
        gsap.to(counterRef.current, {
          innerText: 12,
          duration: 1.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onComplete: () => {
            counterRef.current.classList.add(styles.valueFlash)
            gsap.delayedCall(0.15, () => {
              counterRef.current?.classList.remove(styles.valueFlash)
            })
          },
        })
      },
    })
  }, { scope: container })

  return (
    <section className={styles.section} ref={container}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {stats.map(s => (
            <div key={s.label} className={`${styles.stat} stat-item-anim`}>
              <span className={styles.tag}>{s.tag}</span>
              <span
                className={styles.value}
                ref={s.numeric ? counterRef : null}
              >
                {s.value}
              </span>
              <span className={styles.label}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
