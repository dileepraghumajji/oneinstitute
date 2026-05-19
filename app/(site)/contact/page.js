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
        <p className={styles.overline}>[+] Start Here</p>
        <h1 className={styles.headline}>
          BOOK YOUR<br />
          FIRST CLASS.
        </h1>
        <p className={styles.trustLine}>First class is on us &middot; 4.9★ on Google &middot; Walk-ins welcome</p>
      </section>

      <CTA />
    </div>
  )
}
