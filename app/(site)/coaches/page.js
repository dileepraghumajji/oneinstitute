import Coaches from '@/components/Coaches'
import styles from './page.module.css'

export const metadata = {
  title: 'Coaches — ONE Institute',
  description: "Meet the coaches who've fought. Professional fighters turned trainers — boxing, Muaythai, and Kickboxing.",
}

export default function CoachesPage() {
  return (
    <div>
      <section className={styles.hero}>
        <p className={styles.overline}>[+] The Corner</p>
        <h1 className={styles.headline}>
          COACHES<br />
          WHO&apos;VE<br />
          FOUGHT.
        </h1>
        <p className={styles.sub}>
          Every coach at ONE Institute has competed at a serious level.
          They know what it takes because they&apos;ve been there.
        </p>
      </section>

      <Coaches />
    </div>
  )
}
