'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Phone } from 'lucide-react'
import styles from './CTA.module.css'

export default function CTA() {
  const container = useRef()

  useGSAP(() => {
    gsap.from('.cta-anim', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      }
    })
  }, { scope: container })

  return (
    <section className={styles.section} id="contact" ref={container}>
      <div className={styles.inner}>
        <div className={`${styles.left} cta-anim`}>
          <p className={styles.overline}>[+] Join the gym</p>
          <h2 className={styles.headline}>
            WALK-INS<br />
            WELCOME.<br />
            EXCUSES<br />
            AREN'T.
          </h2>
          <p className={styles.sub}>
            First class is on us. Bring wraps, bring attitude. Leave your excuses at the door.
          </p>
        </div>

        <div className={`${styles.right} cta-anim`}>
          <a href="tel:7411074751" className={styles.btn}>
            Book a Class
          </a>

          <a href="tel:7411074751" className={styles.phone}>
            <span className={styles.phoneDot} />
            <Phone size={16} strokeWidth={1.75} />
            74110 74751
          </a>

          <p className={styles.walkin}>
            Walk-ins accepted · No sign-up fee · All levels
          </p>
        </div>
      </div>
    </section>
  )
}
