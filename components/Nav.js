'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Volume2, VolumeX, Sun, Moon } from 'lucide-react'
import styles from './Nav.module.css'

import { useLoading } from '@/context/LoadingContext'
import { useSound } from '@/context/SoundContext'
import { useTheme } from '@/context/ThemeContext'

const navLinks = [
  { label: 'Programs', href: '/programs' },
  { label: 'Schedule', href: '/schedule'  },
  { label: 'Coaches',  href: '/coaches'   },
  { label: 'Contact',  href: '/contact'   },
]

export default function Nav() {
  const { isLoaded } = useLoading()
  const { isMuted, toggleMute } = useSound()
  const { theme, toggleTheme, mounted } = useTheme()
  const pathname = usePathname()
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
        <Link href="/" className={styles.logo} aria-label="ONE Institute of Martial Arts">
          <svg
            width="220" height="40" viewBox="0 0 280 48" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.logoSvg}
            aria-hidden="true"
          >
            <rect x="0" y="4" width="40" height="40" stroke="#FF5300" strokeWidth="2.5" fill="none"/>
            <text x="20" y="32" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="22" fill="#FF5300" textAnchor="middle">1</text>
            <text x="54" y="32" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="28" letterSpacing="3" fill="currentColor" textAnchor="start">ONE</text>
            <text x="132" y="32" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="12" letterSpacing="5" fill="currentColor" textAnchor="start" opacity="0.65">INSTITUTE</text>
          </svg>
        </Link>

        <ul className={styles.links}>
          {navLinks.map(l => (
            <li key={l.label}>
              <Link
                href={l.href}
                className={pathname === l.href || pathname.startsWith(l.href + '/') ? styles.linkActive : ''}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.iconGroup}>
          {mounted && (
            <button
              className={styles.iconBtn}
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark'
                ? <Sun size={18} strokeWidth={1.5} />
                : <Moon size={18} strokeWidth={1.5} />
              }
            </button>
          )}
          <button
            className={styles.iconBtn}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            title={isMuted ? 'Sound off — click to enable' : 'Sound on — click to mute'}
          >
            {isMuted
              ? <VolumeX size={18} strokeWidth={1.5} />
              : <Volume2 size={18} strokeWidth={1.5} />
            }
          </button>
        </div>

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
        {/* Mobile theme toggle */}
        {mounted && (
          <button
            className={styles.mobileThemeBtn}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark'
              ? <><Sun size={16} strokeWidth={1.75} /> Light Mode</>
              : <><Moon size={16} strokeWidth={1.75} /> Dark Mode</>
            }
          </button>
        )}

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
