import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import Programs from '@/components/Programs'
import Stats from '@/components/Stats'
import Philosophy from '@/components/Philosophy'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Ticker />
      <Programs />
      <Stats />
      <Philosophy />
      <CTA />
      <Footer />
    </main>
  )
}
