'use client'

import { createContext, useContext, useState } from 'react'

const LoadingContext = createContext({
  isLoaded: false,
  setLoaded: () => {},
})

export function LoadingProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoaded, setLoaded: () => setIsLoaded(true) }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
