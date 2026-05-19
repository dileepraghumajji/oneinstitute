'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Ticker.module.css'

const words = ['Muaythai', 'Boxing', 'K1', 'Low Kick', 'Kickboxing', 'Sparring', 'Fight Night']
const doubled = [...words, ...words, ...words, ...words]

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
  const trackRef = useRef()
  const lastDurRef = useRef('')

  useEffect(() => {
    let lastY = window.scrollY
    let lastTime = performance.now()
    let rafId

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const now = performance.now()
        const dt = Math.max(1, now - lastTime)
        const velocity = Math.abs(window.scrollY - lastY) / dt
        lastY = window.scrollY
        lastTime = now

        if (!container.current) return
        const v = Math.round(velocity * 2) / 2
        const dur = `${Math.max(6, 20 / (1 + v * 0.1)).toFixed(1)}s`
        if (dur === lastDurRef.current) return
        lastDurRef.current = dur
        if (trackRef.current) trackRef.current.style.animationDuration = dur
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

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
      <div className={styles.track} ref={trackRef}>
        {doubled.map((w, i) => (
          <TickerItem key={i} word={w} />
        ))}
      </div>
    </div>
  )
}
