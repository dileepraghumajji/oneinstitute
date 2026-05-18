import DisciplineContent from '../DisciplineContent'

export const metadata = {
  title: 'Muaythai — ONE Institute',
  description: "Eight weapons. Clinch, elbows, knees, kicks — Thailand's art, trained seriously in Visakhapatnam.",
}

const pillars = [
  {
    num: '[01]',
    title: 'Eight Weapons',
    desc: "Fists, elbows, knees, and kicks — all eight weapons drilled to fight-ready standard. Not cardio. Not fitness. The real thing.",
  },
  {
    num: '[02]',
    title: 'Clinch & Sweeps',
    desc: "Muaythai clinch is where the art separates itself. Neck wrestling, knee strikes, trips, and sweeps — coached by someone who's used it under lights.",
  },
  {
    num: '[03]',
    title: 'Timing & Distance',
    desc: 'Long guard, teep control, counter-timing. Muaythai is a precision art — we train the patient, composed fighter alongside the aggressive one.',
  },
]

const slots = [
  { day: 'Tuesday',  time: '5:00 PM', level: 'All Levels' },
  { day: 'Tuesday',  time: '7:00 PM', level: 'Sparring'   },
  { day: 'Thursday', time: '7:00 PM', level: 'All Levels' },
  { day: 'Saturday', time: '6:00 AM', level: 'All Levels' },
  { day: 'Saturday', time: '7:00 PM', level: 'Beginners'  },
]

export default function MuaythaiPage() {
  return (
    <DisciplineContent
      breadcrumbLabel="Muaythai"
      overline="[+] Discipline 02"
      heroBgText="MTH"
      headline="MUAYTHAI."
      heroMeta={['3× / week', 'Tue · Thu · Sat', 'All Levels']}
      pillars={pillars}
      slots={slots}
      ctaText={'Eight weapons.\nLearn all of them.'}
    />
  )
}
