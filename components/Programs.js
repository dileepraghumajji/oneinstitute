'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'
import { ChevronRight } from 'lucide-react'
import styles from './Programs.module.css'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const programs = [
  {
    number: '[01]',
    name: 'Boxing',
    schedule: '4× / week',
    days: 'Mon · Tue · Thu · Fri',
    desc: 'Pure sweet science. Footwork, combinations, defence — trained the way it\'s meant to be. No filler.',
    videoSrc: '/videos/boxing.mp4',
  },
  {
    number: '[02]',
    name: 'Muaythai',
    schedule: '3× / week',
    days: 'Tue · Thu · Sat',
    desc: 'Eight weapons. Clinch work, elbows, knees, kicks. Thailand\'s art, trained seriously.',
    videoSrc: '/videos/muaythai.mp4',
  },
  {
    number: '[03]',
    name: 'Kickboxing K1',
    schedule: '2× / week',
    days: 'Wed · Sat',
    desc: 'Dynamic combinations, high kicks, European ruleset. Competitive coaching, no shortcuts.',
    videoSrc: '/videos/kickboxing.mp4',
  },
  {
    number: '[04]',
    name: 'Low Kick',
    schedule: '2× / week',
    days: 'Mon · Fri',
    desc: 'Ground-level game. Low kicks, cuts, sweeps. Full contact. This one leaves marks.',
    videoSrc: '/videos/lowkick.mp4',
  },
]

function isTouch() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
}

function handleCardMouseEnter(e) {
  if (isTouch()) return
  const v = e.currentTarget.querySelector('video')
  if (v) v.play().catch(() => {})
}

function handleCardMouseLeave(e) {
  if (isTouch()) return
  const v = e.currentTarget.querySelector('video')
  if (v) { v.pause(); v.currentTime = 0 }
}

function handleCardTap(e) {
  if (!isTouch()) return
  const card = e.currentTarget
  const v = card.querySelector('video')
  if (!v) return
  if (card.dataset.tapped === '1') {
    card.dataset.tapped = '0'
    window.location.href = '#contact'
  } else {
    card.dataset.tapped = '1'
    v.play().catch(() => {})
  }
}

export default function Programs() {
  const container = useRef()
  const dividerLinesRef = useRef()

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      gsap.from('.programs-header-anim', {
        x: -60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: container.current, start: 'top 80%' }
      })

      const titleEl = container.current.querySelector('.programs-title')
      let split = null
      if (titleEl) {
        split = new SplitType(titleEl, { types: 'words' })
        gsap.from(split.words, {
          y: (i) => (i + 1) * 120,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        })
      }

      gsap.from('.program-card-anim', {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1,
        stagger: 0.12,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: container.current.querySelector(`.${styles.grid}`),
          start: 'top 80%',
        }
      })

      const bgLetterEl = container.current.querySelector(`.${styles.bgLetter}`)
      if (bgLetterEl) {
        gsap.to(bgLetterEl, {
          y: -50, ease: 'none',
          scrollTrigger: {
            trigger: container.current,
            start: 'top bottom', end: 'bottom top', scrub: 1,
          },
        })
      }
      if (dividerLinesRef.current) {
        gsap.to(dividerLinesRef.current, {
          y: -25, ease: 'none',
          scrollTrigger: {
            trigger: container.current,
            start: 'top bottom', end: 'bottom top', scrub: 1,
          },
        })
      }

      return () => { if (split) split.revert() }
    })

    mm.add('(max-width: 768px)', () => {
      gsap.from('.programs-header-anim', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.programs-header-anim', start: 'top 85%' }
      })

      gsap.from('.program-card-anim', {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '.program-card-anim', start: 'top 80%' }
      })

      const bgLetterEl = container.current.querySelector(`.${styles.bgLetter}`)
      if (bgLetterEl) {
        gsap.to(bgLetterEl, {
          y: -30, ease: 'none',
          scrollTrigger: {
            trigger: container.current,
            start: 'top bottom', end: 'bottom top', scrub: 1,
          },
        })
      }
    })
  }, { scope: container })

  return (
    <section className={styles.section} id="programs" ref={container}>
      <span aria-hidden="true" className={styles.bgLetter}>01</span>
      <div aria-hidden="true" className={styles.parallaxLines} ref={dividerLinesRef}>
        <div className={styles.parallaxLine} />
        <div className={styles.parallaxLine} />
      </div>
      <span aria-hidden="true" className="sectionNum">[S 02]</span>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={`${styles.overline} programs-header-anim`}>[+] Disciplines</p>
            <h2 className={`${styles.title} programs-title`}>
              TRAIN.<br />
              SPAR.<br />
              WIN.
            </h2>
          </div>
          <div className={styles.headerRight}>
            <a href="#contact" className={styles.seeAll}>
              Full Schedule <ChevronRight size={16} strokeWidth={1.75} />
            </a>
          </div>
        </div>

        <div className={styles.grid}>
          {programs.map(p => (
            <div
              key={p.number}
              className={`${styles.card} program-card-anim`}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
              onClick={handleCardTap}
            >
              <video
                className={styles.video}
                src={p.videoSrc}
                muted
                loop
                playsInline
                preload="none"
                onPlay={e => { e.target.style.opacity = '0.6' }}
                onPause={e => { e.target.style.opacity = '0' }}
              />
              <span className={styles.cardNumber}>{p.number}</span>
              <h3 className={styles.cardName}>{p.name}</h3>
              <div className={styles.divider} />
              <span className={styles.schedule}>{p.schedule}</span>
              <span className={styles.days}>{p.days}</span>
              <p className={styles.desc}>{p.desc}</p>
              <a href="#contact" className={styles.cardCta}>
                Book session <ChevronRight size={14} strokeWidth={1.75} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
