import DisciplineContent from '../DisciplineContent'

export const metadata = {
  title: 'Kickboxing K1 — ONE Institute',
  description: 'Dynamic combinations, high kicks, European K1 ruleset. Competitive coaching, no shortcuts. Visakhapatnam.',
}

const pillars = [
  {
    num: '[01]',
    title: 'Dynamic Combinations',
    desc: "Punches and kicks chained into fluid sequences. K1 rewards explosive, unpredictable striking — that's what we train here.",
  },
  {
    num: '[02]',
    title: 'High Kick Mechanics',
    desc: 'Head kicks win fights in K1. Hip flexibility, pivot mechanics, and timing are drilled until the movement is natural under pressure.',
  },
  {
    num: '[03]',
    title: 'K1 Rule Set',
    desc: "Understand what scores, what doesn't, and how to build a fight plan for the K1 format — from pads to sparring to competition.",
  },
]

const slots = [
  { day: 'Wednesday', time: '6:00 AM', level: 'All Levels'   },
  { day: 'Wednesday', time: '6:00 PM', level: 'Intermediate' },
  { day: 'Saturday',  time: '5:00 PM', level: 'All Levels'   },
]

export default function KickboxingPage() {
  return (
    <DisciplineContent
      breadcrumbLabel="Kickboxing K1"
      overline="[+] Discipline 03"
      heroBgText="K1"
      headline={'KICKBOXING\nK1.'}
      heroMeta={['2× / week', 'Wed · Sat', 'All Levels']}
      pillars={pillars}
      slots={slots}
      ctaText={'High kicks.\nZero shortcuts.'}
    />
  )
}
