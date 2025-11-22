'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface DarkModeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
  systemPreference: boolean
}

const DarkModeContext = createContext<DarkModeContextType | null>(null)

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  const [systemPreference, setSystemPreference] = useState(false)

  useEffect(() => {
    // Get system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemPreference(mediaQuery.matches)
    
    // Initialize dark mode based on system preference or localStorage
    const savedMode = localStorage.getItem('sherketi_dark_mode')
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true')
    } else {
      setDarkMode(mediaQuery.matches)
    }
    
    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches)
      if (localStorage.getItem('sherketi_dark_mode') === null) {
        setDarkMode(e.matches)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Apply dark mode classes to document
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.style.backgroundColor = '#1e293b'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.backgroundColor = ''
    }
    
    // Save preference to localStorage
    localStorage.setItem('sherketi_dark_mode', darkMode.toString())
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, systemPreference }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}
