'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import styles from './LoadingScreen.module.css'
import { useSound } from '@/context/SoundContext'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const loaderRef = useRef()
  const contentRef = useRef()
  const { playSound } = useSound()

  const statusRef = useRef()
  const readyRef = useRef()

  useEffect(() => {
    if (sessionStorage.getItem('one-visited')) {
      onComplete?.()
      return
    }

    let rampId
    let dismissed = false

    // Push to 100% and let the progress-effect handle the slide-out
    const dismiss = () => {
      if (dismissed) return
      dismissed = true
      clearInterval(rampId)
      setProgress(100)
    }

    // Ramp quickly to 85% — purely cosmetic, shows activity while the 3D canvas loads
    rampId = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) return 85
        return Math.min(prev + Math.floor(Math.random() * 10) + 5, 85)
      })
    }, 120)

    // Real gate: BoxingRing3DF dispatches this on its first rendered frame
    // (WebGL context live, scene drawn — safe to start Hero animations)
    window.addEventListener('ring-ready', dismiss, { once: true })

    // Fallback: covers sub-pages with no 3D canvas, WebGL-blocked browsers,
    // and very slow connections — keeps the loader from hanging forever
    const fallback = setTimeout(dismiss, 5000)

    return () => {
      clearInterval(rampId)
      clearTimeout(fallback)
      window.removeEventListener('ring-ready', dismiss)
    }
  }, [])

  useEffect(() => {
    if (progress === 100) {
      // 8.3 — Play bell sound just before slide-out
      playSound('bell')

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('one-visited', '1')
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
