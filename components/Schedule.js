'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Schedule.module.css'

const timeSlots = ['6:00 AM', '7:00 AM', '5:00 PM', '6:00 PM', '7:00 PM']

const schedule = [
  {
    day: 'Monday', dayIndex: 1,
    '6:00 AM': { discipline: 'Boxing',        level: 'All Levels'   },
    '5:00 PM': { discipline: 'Boxing',        level: 'Beginners'    },
    '7:00 PM': { discipline: 'Low Kick',      level: 'All Levels'   },
  },
  {
    day: 'Tuesday', dayIndex: 2,
    '6:00 AM': { discipline: 'Boxing',        level: 'All Levels'   },
    '5:00 PM': { discipline: 'Muaythai',      level: 'All Levels'   },
    '7:00 PM': { discipline: 'Muaythai',      level: 'Sparring'     },
  },
  {
    day: 'Wednesday', dayIndex: 3,
    '6:00 AM': { discipline: 'Kickboxing K1', level: 'All Levels'   },
    '6:00 PM': { discipline: 'Kickboxing K1', level: 'Intermediate' },
  },
  {
    day: 'Thursday', dayIndex: 4,
    '6:00 AM': { discipline: 'Boxing',        level: 'All Levels'   },
    '5:00 PM': { discipline: 'Boxing',        level: 'Advanced'     },
    '7:00 PM': { discipline: 'Muaythai',      level: 'All Levels'   },
  },
  {
    day: 'Friday', dayIndex: 5,
    '6:00 AM': { discipline: 'Boxing',        level: 'Advanced'     },
    '5:00 PM': { discipline: 'Low Kick',      level: 'All Levels'   },
    '7:00 PM': { discipline: 'Boxing',        level: 'All Levels'   },
  },
  {
    day: 'Saturday', dayIndex: 6,
    '6:00 AM': { discipline: 'Muaythai',      level: 'All Levels'   },
    '5:00 PM': { discipline: 'Kickboxing K1', level: 'All Levels'   },
    '7:00 PM': { discipline: 'Muaythai',      level: 'Beginners'    },
  },
]

export default function Schedule() {
  const container = useRef()
  const [today, setToday] = useState(-1)

  useEffect(() => { setToday(new Date().getDay()) }, [])

  useGSAP(() => {
    gsap.from('.schedule-header-anim', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: container.current, start: 'top 85%' },
    })

    gsap.from('.schedule-row-anim', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.schedule-row-anim', start: 'top 85%' },
    })
  }, { scope: container })

  return (
    <section className={styles.section} id="schedule" ref={container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={`${styles.overline} schedule-header-anim`}>[+] Training Schedule</p>
          <h2 className={`${styles.title} schedule-header-anim`}>
            WEEK.<br />
            ROUND.<br />
            REPEAT.
          </h2>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.thDay}>Day</th>
                {timeSlots.map(t => <th key={t} className={styles.thSlot}>{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {schedule.map(row => {
                const isToday = row.dayIndex === today
                return (
                  <tr
                    key={row.day}
                    className={`${styles.row} ${isToday ? styles.today : ''} schedule-row-anim`}
                  >
                    <td className={styles.dayCell}>
                      {row.day}
                      {isToday && <span className={styles.todayBadge}>Today</span>}
                    </td>
                    {timeSlots.map(t => {
                      const cls = row[t]
                      return (
                        <td key={t} className={styles.classCell}>
                          {cls ? (
                            <div className={styles.chip} data-discipline={cls.discipline}>
                              <span className={styles.chipName}>{cls.discipline}</span>
                              <span className={styles.chipLevel}>{cls.level}</span>
                            </div>
                          ) : (
                            <span className={styles.empty}>—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className={styles.note}>
          * Schedule subject to change — contact us to confirm current times.
        </p>
      </div>
    </section>
  )
}
