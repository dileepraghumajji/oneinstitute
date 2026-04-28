'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Nav.module.css'

import { useLoading } from '@/context/LoadingContext'

const navLinks = [
  { label: 'Programs', href: '#programs' },
  { label: 'Schedule', href: '#schedule'        },
  { label: 'Coaches',  href: '#coaches-section' },
  { label: 'Contact',  href: '#contact'  },
]

export default function Nav() {
  const { isLoaded } = useLoading()
  const container = useRef()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`} ref={container}>
        <a href="#" className={styles.logo}>
          <Image
            src="/logo.svg"
            alt="ONE Institute of Martial Arts"
            width={220}
            height={40}
            className={styles.logoImage}
            priority
          />
        </a>

        <ul className={styles.links}>
          {navLinks.map(l => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <a href="#contact" className={styles.cta}>Book a Class</a>

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
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#contact" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
          Book a Class
        </a>
      </div>
    </>
  )
}
