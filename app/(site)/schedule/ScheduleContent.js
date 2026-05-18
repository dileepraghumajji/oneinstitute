'use client'

import { useState, useEffect } from 'react'
import { Link } from 'next-view-transitions'
import styles from './page.module.css'

const FILTERS = ['All', 'Boxing', 'Muaythai', 'Kickboxing K1', 'Low Kick']

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

function rowHasFilter(row, filter) {
  if (filter === 'All') return true
  return timeSlots.some(t => row[t]?.discipline === filter)
}

export default function ScheduleContent() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [today, setToday] = useState(-1)

  useEffect(() => { setToday(new Date().getDay()) }, [])

  const filtered = schedule.filter(row => rowHasFilter(row, activeFilter))

  return (
    <>
      <div className={styles.filterBar}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.tableSection}>
        <div className={styles.stickyHeader}>
          <span className={styles.stickyHeaderLabel}>
            {activeFilter === 'All' ? 'All classes' : `${activeFilter} classes`}
          </span>
          <Link href="/contact" className={styles.bookCta}>
            Book a Class →
          </Link>
        </div>

        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Day</th>
              {timeSlots.map(t => <th key={t}>{t}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => {
              const isToday = row.dayIndex === today
              return (
                <tr
                  key={row.day}
                  className={`${styles.row} ${isToday ? styles.rowToday : ''}`}
                >
                  <td className={styles.dayCell}>
                    {row.day}
                    {isToday && <span className={styles.todayBadge}>Today</span>}
                  </td>
                  {timeSlots.map(t => {
                    const cls = row[t]
                    const hidden = activeFilter !== 'All' && cls?.discipline !== activeFilter
                    return (
                      <td key={t} className={styles.classCell}>
                        {cls && !hidden ? (
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

        <p className={styles.note}>
          * Schedule subject to change — contact us to confirm current times.
        </p>
      </div>
    </>
  )
}
