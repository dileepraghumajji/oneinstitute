'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'

const SoundContext = createContext(null)

const SOUND_FILES = {
  bell:   '/sounds/bell.mp3',
  punch:  '/sounds/punch.mp3',
  whoosh: '/sounds/whoosh.mp3',
}

function buildHowls(Howl) {
  const out = {}
  Object.entries(SOUND_FILES).forEach(([name, src]) => {
    out[name] = new Howl({ src: [src], preload: false, volume: 0.7, html5: false })
  })
  return out
}

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(true)
  const howlsRef   = useRef({})
  const HowlRef    = useRef(null)
  const loadingRef = useRef(false)

  // Load Howler + wire up sounds. Safe to call multiple times — guards itself.
  const ensureHowler = useCallback(() => {
    if (HowlRef.current || loadingRef.current) return
    loadingRef.current = true
    import('howler').then(({ Howl }) => {
      HowlRef.current = Howl
      howlsRef.current = buildHowls(Howl)
      loadingRef.current = false
    })
  }, [])

  // Hydrate preference; load Howler immediately if user previously opted in.
  useEffect(() => {
    const stored = localStorage.getItem('one-muted')
    if (stored !== null) {
      const wasMuted = stored === 'true'
      setIsMuted(wasMuted)
      if (!wasMuted) ensureHowler()
    }
  }, [ensureHowler])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev
      localStorage.setItem('one-muted', String(next))
      // Kick off Howler load the moment the user unmutes so it's ready by
      // the time they interact with the ring or submit the form.
      if (!next) ensureHowler()
      return next
    })
  }, [ensureHowler])

  const playSound = useCallback((name) => {
    if (isMuted || !HowlRef.current) return
    const howl = howlsRef.current[name]
    if (!howl) return
    howl.stop()
    howl.play()
  }, [isMuted])

  const value = useMemo(() => ({ isMuted, toggleMute, playSound }), [isMuted, toggleMute, playSound])

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSound must be used inside <SoundProvider>')
  return ctx
}
