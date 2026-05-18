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
    // 17.4 — Stats fly in from four directions
    const statEls = Array.from(container.current.querySelectorAll('.stat-item-anim'))
    if (statEls.length >= 4) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: container.current, start: 'top 85%' }
      })
      tl.from(statEls[0], { x: -80, opacity: 0, duration: 1, ease: 'power2.out' }, 0)
      tl.from(statEls[1], { y: -80, opacity: 0, duration: 1, ease: 'power2.out' }, 0.1)
      tl.from(statEls[2], { y: 80,  opacity: 0, duration: 1, ease: 'power2.out' }, 0.1)
      tl.from(statEls[3], { x: 80,  opacity: 0, duration: 1, ease: 'power2.out' }, 0.2)
    }

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

    // 15.1 — Variable font weight animation on stat values
    ScrollTrigger.create({
      trigger: container.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(container.current.querySelectorAll(`.${styles.value}`), {
          fontVariationSettings: "'wght' 900",
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
        })
      },
    })

    // 15.2 — bgLetter parallax
    const bgLetterEl = container.current.querySelector(`.${styles.bgLetter}`)
    if (bgLetterEl) {
      gsap.to(bgLetterEl, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }
  }, { scope: container })

  return (
    <section className={styles.section} ref={container}>
      <span aria-hidden="true" className={styles.bgLetter}>12</span>
      <span aria-hidden="true" className="sectionNum">[S 04]</span>
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
