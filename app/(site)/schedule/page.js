import ScheduleContent from './ScheduleContent'
import styles from './page.module.css'

export const metadata = {
  title: 'Training Schedule — ONE Institute',
  description: 'Full weekly training schedule for Boxing, Muaythai, Kickboxing K1, and Low Kick. Classes from 6AM.',
}

export default function SchedulePage() {
  return (
    <div>
      <section className={styles.hero}>
        <p className={styles.overline}>[+] Training Schedule</p>
        <h1 className={styles.headline}>
          WEEK.<br />
          ROUND.<br />
          REPEAT.
        </h1>
      </section>

      <ScheduleContent />
    </div>
  )
}
