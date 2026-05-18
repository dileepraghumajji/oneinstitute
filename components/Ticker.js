'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'
import { Swords } from 'lucide-react'
import styles from './Ticker.module.css'

const words = ['Muaythai', 'Boxing', 'K1', 'Low Kick', 'Kickboxing', 'Sparring', 'Fight Night']
const doubled = [...words, ...words, ...words, ...words]

function TickerItem({ word, index }) {
  return (
    <span className={styles.item}>
      {word}
      {index % 2 === 0
        ? <span className={styles.dot} />
        : <Swords size={13} strokeWidth={1.5} className={styles.swordIcon} />
      }
    </span>
  )
}

export default function Ticker() {
  const container = useRef()
  const track1Ref = useRef()
  const track2Ref = useRef()
  const lastDurRef = useRef('')

  // 10.6 + 17.3 — Pulse weight + velocity-linked animation speed
  useLenis(({ velocity }) => {
    if (!container.current) return
    const fast = Math.abs(velocity) > 8
    const current = container.current.dataset.fast
    if ((fast ? '1' : '0') !== current) {
      container.current.dataset.fast = fast ? '1' : '0'
    }
    // Quantise to 0.5-unit steps so style writes happen ~10/s instead of 60/s
    const v = Math.round(Math.abs(velocity) * 2) / 2
    const dur = `${Math.max(6, 18 / (1 + v * 0.1)).toFixed(1)}s`
    if (dur === lastDurRef.current) return
    lastDurRef.current = dur
    if (track1Ref.current) track1Ref.current.style.animationDuration = dur
    if (track2Ref.current) track2Ref.current.style.animationDuration = dur
  })

  useGSAP(() => {
    gsap.from(container.current, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 90%',
      }
    })
  }, { scope: container })

  return (
    <div className={styles.ticker} aria-hidden="true" ref={container}>
      <div className={styles.track} ref={track1Ref}>
        {doubled.map((w, i) => (
          <TickerItem key={i} word={w} index={i} />
        ))}
      </div>
      <div className={`${styles.track} ${styles.trackReverse}`} ref={track2Ref}>
        {doubled.map((w, i) => (
          <TickerItem key={i} word={w} index={i + 1} />
        ))}
      </div>
    </div>
  )
}
