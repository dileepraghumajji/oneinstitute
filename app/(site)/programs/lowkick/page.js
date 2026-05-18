import DisciplineContent from '../DisciplineContent'

export const metadata = {
  title: 'Low Kick — ONE Institute',
  description: 'Ground-level game. Low kicks, cuts, sweeps, full contact. This one leaves marks. Visakhapatnam.',
}

const pillars = [
  {
    num: '[01]',
    title: 'Leg Attack System',
    desc: 'Inner thigh, outer thigh, calf kicks — delivered with power, accuracy, and timing. Low kicks break opponents down over a fight.',
  },
  {
    num: '[02]',
    title: 'Cut Kicks & Sweeps',
    desc: "Using the shin to cut across the opponent's planted leg. Sweeps off the clinch. The dirty, effective techniques that change a fight's momentum.",
  },
  {
    num: '[03]',
    title: 'Full Contact Mentality',
    desc: 'Low Kick is full contact. We train the physical conditioning, pain tolerance, and fight mindset alongside the technical skill.',
  },
]

const slots = [
  { day: 'Monday', time: '7:00 PM', level: 'All Levels' },
  { day: 'Friday', time: '5:00 PM', level: 'All Levels' },
]

export default function LowKickPage() {
  return (
    <DisciplineContent
      breadcrumbLabel="Low Kick"
      overline="[+] Discipline 04"
      heroBgText="LK"
      headline="LOW KICK."
      heroMeta={['2× / week', 'Mon · Fri', 'All Levels']}
      pillars={pillars}
      slots={slots}
      ctaText={'This one\nleaves marks.'}
    />
  )
}
