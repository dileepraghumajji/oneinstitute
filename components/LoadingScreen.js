'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const loaderRef = useRef()
  const contentRef = useRef()

  const statusRef = useRef()
  const readyRef = useRef()

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Random increments for a "real" feel
        const inc = Math.floor(Math.random() * 10) + 5
        return Math.min(prev + inc, 100)
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete()
        }
      })

      tl.to(statusRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.4,
        ease: 'power2.in'
      })
      .fromTo(readyRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.8
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)'
      })
      .to(loaderRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut',
        delay: 0.5
      })
      .to(contentRef.current, {
        opacity: 0,
        y: -100,
        duration: 0.8,
        ease: 'power4.in'
      }, '-=1.2')
    }
  }, [progress, onComplete])

  return (
    <div className={styles.loader} ref={loaderRef}>
      <div className={styles.content} ref={contentRef}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>1</div>
        </div>
        
        <div className={styles.statusGroup}>
          <div ref={statusRef} className={styles.statusInner}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.status}>
              <span className={styles.bracket}>[</span>
              PREPARING ROUND ONE — {progress}%
              <span className={styles.bracket}>]</span>
            </div>
          </div>

          <div ref={readyRef} className={styles.readyText}>
            READY?
          </div>
        </div>
      </div>
    </div>
  )
}
