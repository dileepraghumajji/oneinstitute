'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './Gallery.module.css'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const cells = [
  { id: 1, caption: '[Boxing] — Sparring Round · Coach Session' },
  { id: 2, caption: '[Muaythai] — Pad Work · Technique Drill' },
  { id: 3, caption: '[Kickboxing] — Heavy Bag · Power Session' },
  { id: 4, caption: '[Low Kick] — Footwork · Conditioning' },
  { id: 5, caption: '[Boxing] — Strength & Conditioning' },
  { id: 6, caption: '[Muaythai] — Clinch Work · Partner Drill' },
  { id: 7, caption: '[Kickboxing] — Competition Prep' },
  { id: 8, caption: '[Low Kick] — Ring Session · Sparring' },
]

export default function Gallery() {
  const container = useRef()

  useGSAP(() => {
    // Initial state: invisible, slightly scaled up — no blur avoids 8 offscreen GPU surfaces
    gsap.set('.gallery-cell', {
      opacity: 0,
      scale: 1.04,
    })

    // Fade-in reveal as each cell enters viewport; hover handler applies grayscale after reveal
    ScrollTrigger.batch('.gallery-cell', {
      onEnter: batch => {
        gsap.to(batch, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: { each: 0.07 },
          onComplete: () => {
            batch.forEach(el => {
              gsap.set(el, { clearProps: 'filter' })
              el.classList.add(styles.cellGrayscale)
            })
          },
        })
      },
      start: 'top 90%',
      once: true,
    })

  }, { scope: container })

  // Separate useEffect so cleanup runs on unmount — useGSAP does not remove raw DOM listeners
  useEffect(() => {
    const cellEls = Array.from(container.current?.querySelectorAll('.gallery-cell') ?? [])

    const handlers = cellEls.map(cell => {
      const onEnter = () => gsap.to(cell, {
        filter: 'brightness(1) grayscale(0) contrast(1.0)',
        duration: 0.3,
        overwrite: 'auto',
      })
      const onLeave = () => gsap.to(cell, {
        filter: 'brightness(1) grayscale(1) contrast(1.1)',
        duration: 0.5,
        overwrite: 'auto',
      })
      const onClick = () => {
        const isColored = cell.dataset.colored === 'true'
        gsap.to(cell, {
          filter: isColored
            ? 'brightness(1) grayscale(1) contrast(1.1)'
            : 'brightness(1) grayscale(0) contrast(1.0)',
          duration: 0.3,
          overwrite: 'auto',
        })
        cell.dataset.colored = isColored ? 'false' : 'true'
      }
      cell.addEventListener('mouseenter', onEnter)
      cell.addEventListener('mouseleave', onLeave)
      cell.addEventListener('click', onClick)
      return { cell, onEnter, onLeave, onClick }
    })

    return () => {
      handlers.forEach(({ cell, onEnter, onLeave, onClick }) => {
        cell.removeEventListener('mouseenter', onEnter)
        cell.removeEventListener('mouseleave', onLeave)
        cell.removeEventListener('click', onClick)
      })
    }
  }, [])

  return (
    <section className={styles.section} id="gallery" ref={container}>
      <span aria-hidden="true" className="sectionNum">[S 07]</span>

      <div className={styles.header}>
        <p className={styles.overline}>[+] Proof of Work</p>
        <h2 className={styles.headline}>THE GYM. THE GRIND. THE RESULT.</h2>
      </div>

      <div className={styles.grid}>
        {cells.map(cell => (
          <div
            key={cell.id}
            className={`${styles.cell} gallery-cell`}
            data-colored="false"
          >
            <div className={styles.caption}>
              <span className={styles.captionText}>{cell.caption}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
