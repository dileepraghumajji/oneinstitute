import DisciplineContent from '../DisciplineContent'

export const metadata = {
  title: 'Boxing — ONE Institute',
  description: "Pure sweet science. Footwork, combinations, defence — trained by coaches who've fought. Boxing classes in Visakhapatnam.",
}

const pillars = [
  {
    num: '[01]',
    title: 'Technical Foundation',
    desc: 'Stance, guard, footwork, and punch mechanics from day one. No shortcuts — everything built on fundamentals that hold up under pressure.',
  },
  {
    num: '[02]',
    title: 'Combination Work',
    desc: 'Jab, cross, hook, uppercut — chained into fight-ready combinations on pads, bags, and sparring partners.',
  },
  {
    num: '[03]',
    title: 'Defence & Ring IQ',
    desc: 'Slips, rolls, parries, and positioning. Learn to make opponents miss and make them pay. This is what separates fighters from punchers.',
  },
]

const slots = [
  { day: 'Monday',   time: '6:00 AM', level: 'All Levels' },
  { day: 'Monday',   time: '5:00 PM', level: 'Beginners'  },
  { day: 'Tuesday',  time: '6:00 AM', level: 'All Levels' },
  { day: 'Thursday', time: '6:00 AM', level: 'All Levels' },
  { day: 'Thursday', time: '5:00 PM', level: 'Advanced'   },
  { day: 'Friday',   time: '6:00 AM', level: 'Advanced'   },
  { day: 'Friday',   time: '7:00 PM', level: 'All Levels' },
]

export default function BoxingPage() {
  return (
    <DisciplineContent
      breadcrumbLabel="Boxing"
      overline="[+] Discipline 01"
      heroBgText="BOX"
      headline="BOXING."
      heroMeta={['4× / week', 'Mon · Tue · Thu · Fri', 'All Levels']}
      pillars={pillars}
      slots={slots}
      ctaText={'Ready to put\nyour hands up?'}
    />
  )
}
