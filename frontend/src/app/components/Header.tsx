'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import NotificationBell from './notifications/NotificationBell'
import { ArrowLeft, Users, DollarSign, Bell, X } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState({
    id: '1',
    name: 'Ahmed Mohamed',
    role: 'investor',
    balance: 15250,
    verified: true
  })

  const handleSignOut = () => {
    setUser(null)
    window.location.href = '/auth/login'
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projects', href: '/projects' },
    { name: 'AI Analysis', href: '/ai' },
    { name: 'My Investments', href: '/investments' }
  ]

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 10c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 2c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Sherketi</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-800 text-sm font-medium">Live</span>
              </div>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <NotificationBell />
                    
                    <button 
                      onClick={handleSignOut}
                      className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Sign Out
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex space-x-4 px-4 py-3 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
