'use client'

import { useRef } from 'react'
import { Link } from 'next-view-transitions'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Instagram, Phone, MapPin } from 'lucide-react'
import styles from './Footer.module.css'

const disciplines = ['Boxing', 'Muaythai', 'Kickboxing K1', 'Low Kick', 'Karate']
const quickLinks  = [
  { label: 'Programs',  href: '/programs' },
  { label: 'Schedule',  href: '/schedule' },
  { label: 'Coaches',   href: '/coaches'  },
  { label: 'Contact',   href: '/contact'  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const footerRef = useRef()

  useGSAP(() => {
    gsap.from('.footer-col', {
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 90%',
      },
    })
  }, { scope: footerRef })

  return (
    <footer className={styles.footer} ref={footerRef}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Brand column */}
          <div className={`${styles.brand} footer-col`}>
            <a href="#" className={styles.logo}>
              <span className={styles.logoMark}>1</span>
              ONE INSTITUTE
            </a>
            <p className={styles.brandDesc}>
              Combat sports training. Boxing, Muaythai, Kickboxing.
              Coaches who&apos;ve fought. Students who show up.
            </p>
            <a
              href="https://www.instagram.com/oneinstituteofmartialarts/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagramLink}
              aria-label="Follow ONE Institute on Instagram"
            >
              <Instagram size={16} strokeWidth={1.75} />
              @oneinstituteofmartialarts
            </a>
          </div>

          {/* Disciplines */}
          <div className="footer-col">
            <p className={styles.colTitle}>Disciplines</p>
            <ul className={styles.links}>
              {disciplines.map(d => (
                <li key={d}>
                  <Link href="/programs">{d}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <p className={styles.colTitle}>Navigate</p>
            <ul className={styles.links}>
              {quickLinks.map(l => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <p className={styles.colTitle}>Contact</p>
            <a href="tel:07411074751" className={styles.contactItem} aria-label="Call ONE Institute">
              <Phone size={14} strokeWidth={1.75} />
              074110 74751
            </a>
            <a
              href="https://maps.app.goo.gl/NueVZvaGrQJLBgBB8"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
              aria-label="View ONE Institute on Google Maps"
            >
              <MapPin size={14} strokeWidth={1.75} />
              Opp. Anand Marg School, Old Dairy Farm,<br />
              Indira Gandhi Nagar, Adarsh Nagar,<br />
              Visakhapatnam, AP 530040
            </a>
            <a
              href="https://www.instagram.com/oneinstituteofmartialarts/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
              aria-label="Follow ONE Institute on Instagram"
            >
              <Instagram size={14} strokeWidth={1.75} />
              @oneinstituteofmartialarts
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} <span>ONE Institute of Martial Arts</span>. All rights reserved.
          </p>
          <ul className={styles.bottomLinks}>
            <li><a href="mailto:oneinstituteofmartialarts@gmail.com">Email Us</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
