'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Ticker.module.css'

const words = ['Muaythai', 'Boxing', 'K1', 'Low Kick', 'Kickboxing', 'Sparring', 'Fight Night']

function TickerItem({ word }) {
  return (
    <span className={styles.item}>
      {word}
      <span className={styles.dot} />
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
          <TickerItem key={i} word={w} />
        ))}
      </div>
    </div>
  )
}
