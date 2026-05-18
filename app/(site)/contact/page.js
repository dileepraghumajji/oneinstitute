import CTA from '@/components/CTA'
import styles from './page.module.css'

export const metadata = {
  title: 'Contact — ONE Institute',
  description: 'Book your first class at ONE Institute. Walk-ins welcome. First class is on us. Visakhapatnam.',
}

export default function ContactPage() {
  return (
    <div>
      <section className={styles.hero}>
        <p className={styles.overline}>[+] Round One</p>
        <h1 className={styles.headline}>
          WALK-INS<br />
          WELCOME.
        </h1>
      </section>

      <CTA />
    </div>
  )
}
