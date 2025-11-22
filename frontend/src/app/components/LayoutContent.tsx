'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import Link from 'next/link'
import { NotificationProvider } from '../context/NotificationContext'
import NotificationBell from '../components/notifications/NotificationBell'

export default function LayoutContent({ children }) {
  // Mock user data for Phase 1 - will be replaced with proper auth context in full implementation
  const [user, setUser] = useState({
    id: '1',
    name: 'Ahmed Mohamed',
    role: 'investor',
    balance: 15250,
    verified: true
  })

  const handleSignOut = () => {
    // In full implementation, this would call the auth context
    window.location.href = '/auth/login'
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projects', href: '/projects' },
    { name: 'AI Analysis', href: '/ai' },
    { name: 'My Investments', href: '/investments' }
  ]

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Sherketi Platform. All rights reserved.
          </div>
        </footer>
      </div>
    </NotificationProvider>
  )
}
