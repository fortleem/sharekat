'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'investor' | 'manager' | 'admin'
  balance: number
  verified: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: 'investor' | 'manager') => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session (mock implementation)
    const mockUser = {
      id: '1',
      name: 'Ahmed Mohamed',
      email: 'ahmed@example.com',
      role: 'investor',
      balance: 15250,
      verified: true
    }
    setUser(mockUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = {
        id: '1',
        name: 'Ahmed Mohamed',
        email,
        role: 'investor',
        balance: 15250,
        verified: true
      }
      setUser(mockUser)
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: 'investor' | 'manager') => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = {
        id: '1',
        name,
        email,
        role,
        balance: 0,
        verified: false
      }
      setUser(mockUser)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
