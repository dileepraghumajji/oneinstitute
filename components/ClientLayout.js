'use client'

import { useEffect } from 'react'
import SmoothScroll from './SmoothScroll'
import LoadingScreen from './LoadingScreen'
import ScrollProgress from './ScrollProgress'
import { LoadingProvider, useLoading } from '@/context/LoadingContext'
import { SoundProvider } from '@/context/SoundContext'


function ClientLayoutContent({ children }) {
  const { isLoaded, setLoaded } = useLoading()

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !isLoaded)
    return () => document.documentElement.classList.remove('is-loading')
  }, [isLoaded])

  return (
    <>
      <LoadingScreen onComplete={setLoaded} />
      <ScrollProgress />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  )
}

export default function ClientLayout({ children }) {
  return (
    <SoundProvider>
      <LoadingProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </LoadingProvider>
    </SoundProvider>
  )
}
