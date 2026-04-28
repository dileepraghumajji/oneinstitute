'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Philosophy.module.css'

const pillars = [
  {
    num: '[01]',
    title: 'Coaches Who\'ve Fought',
    desc: 'Every coach on the floor has competed. They teach what they\'ve lived — not what they\'ve read.',
  },
  {
    num: '[02]',
    title: 'Students Who Show Up',
    desc: 'No hand-holding, no hype. Your consistency is the only thing that earns your progress here.',
  },
  {
    num: '[03]',
    title: 'Earned, Not Bought',
    desc: 'You can\'t shortcut a round. The discipline you build in here follows you everywhere else.',
  },
]

export default function Philosophy() {
  const container = useRef()

  useGSAP(() => {
    // Column entrance animations
    gsap.from('.philosophy-left-anim', {
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
      }
    })

    gsap.from('.philosophy-right-anim', {
      x: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
      }
    })

    // Scrub parallax — left drifts up, right drifts down as section scrolls
    gsap.to('.philosophy-left-anim', {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    })

    gsap.to('.philosophy-right-anim', {
      y: 40,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    })

    // Headline word clip-mask wipe reveal
    gsap.from('.philosophy-word', {
      y: '110%',
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
      }
    })

    // Pillars stagger
    gsap.from('.pillar-anim', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.pillar-anim',
        start: 'top 90%',
      }
    })
  }, { scope: container })

  return (
    <section className={styles.section} id="coaches" ref={container}>
      <div className={styles.inner}>
        <div className={`${styles.left} philosophy-left-anim`}>
          <p className={styles.overline}>[+] Why Train With Us</p>

          <h2 className={styles.quote}>
            {['COACHES', "WHO'VE", 'FOUGHT.'].map(word => (
              <span key={word} className={styles.wordWrap}>
                <span className={`${styles.wordInner} philosophy-word`}>{word}</span>
              </span>
            ))}
          </h2>

          <p className={styles.sub}>
            Students who show up. Walk-ins welcome. Excuses aren&apos;t.
            Disciplined coaching from people who know what a real round costs.
          </p>

          <div className={styles.pillars}>
            {pillars.map(p => (
              <div key={p.num} className={`${styles.pillar} pillar-anim`}>
                <span className={styles.pillarNum}>{p.num}</span>
                <div className={styles.pillarContent}>
                  <span className={styles.pillarTitle}>{p.title}</span>
                  <span className={styles.pillarDesc}>{p.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.right} philosophy-right-anim`}>
          <div className={styles.imgContainer}>
            <Image
              src="/images/coach1.png"
              alt="ONE Institute boxing coach in fighting stance"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={`${styles.coachPhoto} brandImage`}
              priority={false}
            />
            <div className={styles.cornerAccent} />
          </div>
        </div>
      </div>
    </section>
  )
}
