'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {}, mounted: false })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('one-theme') ?? 'dark'
    setTheme(stored)
    document.documentElement.setAttribute('data-theme', stored)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'

    // Brief transition class so only theme-switch colors animate, not GSAP
    document.documentElement.setAttribute('data-transitioning', '')
    setTimeout(() => document.documentElement.removeAttribute('data-transitioning'), 300)

    setTheme(next)
    localStorage.setItem('one-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
