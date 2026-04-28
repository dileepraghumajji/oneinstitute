'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Swords } from 'lucide-react'
import styles from './Ticker.module.css'

const words = ['Muaythai', 'Boxing', 'K1', 'Low Kick', 'Kickboxing', 'Sparring', 'Fight Night']

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
  const doubled = [...words, ...words, ...words, ...words]

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
      <div className={styles.track}>
        {doubled.map((w, i) => (
          <TickerItem key={i} word={w} index={i} />
        ))}
      </div>
      <div className={`${styles.track} ${styles.trackReverse}`}>
        {doubled.map((w, i) => (
          <TickerItem key={i} word={w} index={i + 1} />
        ))}
      </div>
    </div>
  )
}
