'use client'

import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef = useRef()
  const ringRef = useRef()

  useEffect(() => {
    if ('ontouchstart' in window) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = -200, mouseY = -200
    let ringX = -200, ringY = -200
    let rafId

    function onMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY

      const target = e.target
      const isCrosshair = target.closest('[data-cursor-crosshair]')
      const isInteractive = !isCrosshair && target.closest('a, button')

      if (isCrosshair) {
        ring.classList.add(styles.ringHidden)
        dot.classList.add(styles.dotCrosshair)
      } else if (isInteractive) {
        ring.classList.add(styles.cursorExpanded)
        ring.classList.remove(styles.ringHidden)
        dot.classList.remove(styles.dotCrosshair)
      } else {
        ring.classList.remove(styles.cursorExpanded, styles.ringHidden)
        dot.classList.remove(styles.dotCrosshair)
      }
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12

      dot.style.left = mouseX + 'px'
      dot.style.top = mouseY + 'px'
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'

      rafId = requestAnimationFrame(animate)
    }

    document.body.style.cursor = 'none'
    window.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className={styles.cursorDot} aria-hidden="true" />
      <div ref={ringRef} className={styles.cursorRing} aria-hidden="true">
        <span className={styles.cursorLabel}>GO</span>
      </div>
    </>
  )
}
