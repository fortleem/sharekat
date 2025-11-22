'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle, AlertTriangle, X, Loader } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number // milliseconds before auto-dismiss
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  removeNotification: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Load notifications from localStorage if available
    const savedNotifications = localStorage.getItem('sherketi_notifications')
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [])

  useEffect(() => {
    // Save notifications to localStorage
    localStorage.setItem('sherketi_notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    // Manage active toasts (auto-dismiss)
    const timers: NodeJS.Timeout[] = []
    
    notifications.forEach(notification => {
      if (!notification.read && notification.duration) {
        const timer = setTimeout(() => {
          markAsRead(notification.id)
        }, notification.duration)
        timers.push(timer)
      }
    })
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [notifications])

  // Show notifications one at a time with delay
  useEffect(() => {
    const newNotifications = notifications.filter(n => !n.read)
    if (newNotifications.length > 0) {
      setActiveNotifications(prev => {
        const uniqueIds = new Set([...prev.map(n => n.id), ...newNotifications.map(n => n.id)])
        return notifications.filter(n => uniqueIds.has(n.id)).slice(-3) // Keep last 3
      })
    }
  }, [notifications])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(),
      read: false,
      ...notification
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
    setActiveNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const clearAll = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    setActiveNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      removeNotification,
      clearAll,
      unreadCount
    }}>
      {children}
      
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        <AnimatePresence>
          {activeNotifications.slice(0, 3).map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl shadow-lg p-4 flex items-start space-x-3 ${
                notification.type === 'success' ? 'bg-green-50 border border-green-200' :
                notification.type === 'info' ? 'bg-blue-50 border border-blue-200' :
                notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-red-50 border border-red-200'
              }`}
            >
              <div className={`p-1.5 rounded-full ${
                notification.type === 'success' ? 'bg-green-100 text-green-600' :
                notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {notification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : notification.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{notification.title}</p>
                <p className={`text-sm mt-1 ${
                  notification.type === 'success' ? 'text-green-700' :
                  notification.type === 'info' ? 'text-blue-700' :
                  notification.type === 'warning' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {notification.message}
                </p>
                
                {notification.action && (
                  <button
                    onClick={() => {
                      notification.action?.onClick()
                      markAsRead(notification.id)
                    }}
                    className={`mt-2 px-2.5 py-1 text-xs font-medium rounded-md ${
                      notification.type === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                      notification.type === 'info' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                      'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Notification Center Background (for mobile) */}
      {unreadCount > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={clearAll} />
      )}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
