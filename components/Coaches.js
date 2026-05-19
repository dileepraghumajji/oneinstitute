'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Coaches.module.css'

const coaches = [
  {
    id: '[01]',
    name: 'Rajesh',
    title: 'Head Boxing & Muaythai Coach',
    disciplines: ['[Boxing]', '[Muaythai]', '[Kickboxing K1]'],
    record: 'National Events · Pro Circuit',
    bio: 'Head coach at ONE Institute. Prepared fighters for pro Muaythai, Kickboxing K1 and Low Kick national events. Training that is effective, purposeful, and built for anyone who shows up serious.',
    photo: '/images/coach1.png',
    photoAlt: 'Rajesh — Head Boxing and Muaythai coach at ONE Institute Visakhapatnam',
  },
  {
    id: '[02]',
    name: 'G. Anand Balu',
    title: 'Founder · Karate & Kickboxing',
    disciplines: ['[Karate]', '[Kickboxing]', '[Low Kick]'],
    record: '44+ Years on the Mat',
    bio: 'Founder of ONE Institute. Over four decades of Karate and Kickboxing. Built Visakhapatnam\'s first dedicated Muaythai club from the ground up — born out of passion, built on discipline.',
    photo: '/images/coach2.png',
    photoAlt: 'G. Anand Balu — Founder of ONE Institute of Martial Arts Visakhapatnam',
  },
  {
    id: '[03]',
    name: 'The Coaching Team',
    title: 'Conditioning & Sparring',
    disciplines: ['[Boxing]', '[Muaythai]', '[Low Kick]'],
    record: 'State Level · Competitive Circuit',
    bio: 'A team built in competition. AP state-level experience across disciplines. Conditioning here is not optional — it is the foundation that every technique is built on. Show up ready to work.',
    photo: '/images/coach3.png',
    photoAlt: 'ONE Institute coaching team at the gym in Visakhapatnam',
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
      <span aria-hidden="true" className="sectionNum">[S 06]</span>
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
