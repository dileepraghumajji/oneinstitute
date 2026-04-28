'use client'

import { useEffect } from 'react'
import SmoothScroll from './SmoothScroll'
import LoadingScreen from './LoadingScreen'
import { LoadingProvider, useLoading } from '@/context/LoadingContext'

function ClientLayoutContent({ children }) {
  const { isLoaded, setLoaded } = useLoading()

  // Prevent scroll when loading
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isLoaded])

  return (
    <>
      <LoadingScreen onComplete={setLoaded} />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  )
}

export default function ClientLayout({ children }) {
  return (
    <LoadingProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </LoadingProvider>
  )
}
