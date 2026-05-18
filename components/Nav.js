'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Volume2, VolumeX } from 'lucide-react'
import styles from './Nav.module.css'

import { useLoading } from '@/context/LoadingContext'
import { useSound } from '@/context/SoundContext'

const navLinks = [
  { label: 'Programs', href: '/programs' },
  { label: 'Schedule', href: '/schedule'  },
  { label: 'Coaches',  href: '/coaches'   },
  { label: 'Contact',  href: '/contact'   },
]

export default function Nav() {
  const { isLoaded } = useLoading()
  const { isMuted, toggleMute } = useSound()
  const container = useRef()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolledRef = useRef(false)

  useGSAP(() => {
    if (!isLoaded) return

    gsap.from(container.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5, // slight delay after hero starts
    })
  }, { dependencies: [isLoaded] })

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 40
      if (next !== scrolledRef.current) {
        scrolledRef.current = next
        setScrolled(next)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`} ref={container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.svg"
            alt="ONE Institute of Martial Arts"
            width={220}
            height={40}
            className={styles.logoImage}
            priority
          />
        </Link>

        <ul className={styles.links}>
          {navLinks.map(l => (
            <li key={l.label}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>

        {/* 8.4 — Mute toggle */}
        <button
          className={styles.muteBtn}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          title={isMuted ? 'Sound off — click to enable' : 'Sound on — click to mute'}
        >
          {isMuted
            ? <VolumeX size={18} strokeWidth={1.75} />
            : <Volume2 size={18} strokeWidth={1.75} />
          }
        </button>

        <Link href="/contact" className={styles.cta}>Book a Class</Link>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        {navLinks.map(l => (
          <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        {/* Mobile mute toggle */}
        <button
          className={styles.mobileMuteBtn}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {isMuted
            ? <><VolumeX size={16} strokeWidth={1.75} /> Sound Off</>
            : <><Volume2 size={16} strokeWidth={1.75} /> Sound On</>
          }
        </button>
        <Link href="/contact" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
          Book a Class
        </Link>
      </div>
    </>
  )
}
