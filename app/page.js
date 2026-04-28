import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import Programs from '@/components/Programs'
import Schedule from '@/components/Schedule'
import Stats from '@/components/Stats'
import Philosophy from '@/components/Philosophy'
import Coaches from '@/components/Coaches'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

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
      <CTA />
      <Footer />
    </main>
  )
}
