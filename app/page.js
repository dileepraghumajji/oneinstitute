import dynamic from 'next/dynamic'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import Programs from '@/components/Programs'
import Schedule from '@/components/Schedule'

// Below-fold: split into separate chunks — parsed after hero is interactive
const Stats      = dynamic(() => import('@/components/Stats'))
const Philosophy = dynamic(() => import('@/components/Philosophy'))
const Coaches    = dynamic(() => import('@/components/Coaches'))
const Gallery    = dynamic(() => import('@/components/Gallery'))
const CTA        = dynamic(() => import('@/components/CTA'))
const Footer     = dynamic(() => import('@/components/Footer'))

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Ticker />
      <Programs />
      <Schedule />
      <Stats />
      <Philosophy />
      <Coaches />
      <Gallery />
      <CTA />
      <Footer />
    </main>
  )
}
