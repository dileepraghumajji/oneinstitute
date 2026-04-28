'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Coaches.module.css'

const coaches = [
  {
    id: '[01]',
    name: 'Coach Placeholder',
    title: 'Head Boxing Coach',
    disciplines: ['[Boxing]', '[Low Kick]'],
    record: '12W · 3L · 8 KO',
    bio: 'Former national-level competitor. Twelve years on the circuit. Corner man for state champions. Every session runs like a real round.',
    photo: '/images/coach1.png',
    photoAlt: 'Boxing coach in Muaythai fighting stance',
  },
  {
    id: '[02]',
    name: 'Coach Placeholder',
    title: 'Muaythai Specialist',
    disciplines: ['[Muaythai]', '[Kickboxing K1]'],
    record: '24W · 7L · 14 KO',
    bio: 'Trained in Thailand. Certified under the WMF. Clinch, elbows, knees — taught by someone who\'s used them under lights.',
    photo: '/images/coach2.png',
    photoAlt: 'Muaythai specialist in the gym',
  },
  {
    id: '[03]',
    name: 'Coach Placeholder',
    title: 'Strength & Conditioning',
    disciplines: ['[Boxing]', '[Muaythai]', '[Kickboxing K1]'],
    record: '8W · 2L · 5 KO',
    bio: 'Sports science background. Builds fighters from the ground up. Conditioning is non-negotiable here. Show up ready to work.',
    photo: '/images/coach3.png',
    photoAlt: 'Fighter celebrating victory in the ring',
  },
]

export default function Coaches() {
  const container = useRef()

  useGSAP(() => {
    gsap.from('.coaches-header-anim', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: container.current, start: 'top 85%' },
    })

    gsap.from('.coach-card-anim', {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.coach-card-anim', start: 'top 85%' },
    })
  }, { scope: container })

  return (
    <section className={styles.section} id="coaches-section" ref={container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={`${styles.overline} coaches-header-anim`}>[+] The Corner</p>
          <h2 className={`${styles.title} coaches-header-anim`}>
            COACHES<br />
            WHO'VE<br />
            FOUGHT.
          </h2>
        </div>

        <div className={styles.grid}>
          {coaches.map(c => (
            <div key={c.id} className={`${styles.card} coach-card-anim`}>
              <div className={styles.photoArea}>
                <Image
                  src={c.photo}
                  alt={c.photoAlt}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                  className={`${styles.coachImage} brandImage`}
                />
                <div className={styles.photoCorner} />
              </div>

              <div className={styles.cardBody}>
                <span className={styles.cardId}>{c.id}</span>
                <h3 className={styles.cardName}>{c.name}</h3>
                <p className={styles.cardTitle}>{c.title}</p>

                <div className={styles.tags}>
                  {c.disciplines.map(d => (
                    <span key={d} className={styles.tag}>{d}</span>
                  ))}
                </div>

                <p className={styles.record}>{c.record}</p>
                <p className={styles.bio}>{c.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
