import { Instagram, Phone, MapPin } from 'lucide-react'
import styles from './Footer.module.css'

const disciplines = ['Boxing', 'Muaythai', 'Kickboxing K1', 'Low Kick', 'Sparring']
const quickLinks  = [
  { label: 'Programs',  href: '#programs' },
  { label: 'Schedule',  href: '#schedule' },
  { label: 'Coaches',   href: '#coaches'  },
  { label: 'Contact',   href: '#contact'  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Brand column */}
          <div className={styles.brand}>
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
            >
              <Instagram size={16} strokeWidth={1.75} />
              @oneinstituteofmartialarts
            </a>
          </div>

          {/* Disciplines */}
          <div>
            <p className={styles.colTitle}>Disciplines</p>
            <ul className={styles.links}>
              {disciplines.map(d => (
                <li key={d}>
                  <a href="#programs">{d}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <p className={styles.colTitle}>Navigate</p>
            <ul className={styles.links}>
              {quickLinks.map(l => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className={styles.colTitle}>Contact</p>
            <a href="tel:7411074751" className={styles.contactItem}>
              <Phone size={14} strokeWidth={1.75} />
              74110 74751
            </a>
            <a
              href="https://maps.app.goo.gl/NueVZvaGrQJLBgBB8"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <MapPin size={14} strokeWidth={1.75} />
              Find us on Google Maps
            </a>
            <a
              href="https://www.instagram.com/oneinstituteofmartialarts/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <Instagram size={14} strokeWidth={1.75} />
              Instagram
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} <span>ONE Institute of Martial Arts</span>. All rights reserved.
          </p>
          <ul className={styles.bottomLinks}>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
