'use client'

import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertTriangle, Loader } from 'lucide-react'
import { useNotifications } from '@/app/context/NotificationContext'

export default function NotificationBell() {
  const { notifications, unreadCount, clearAll, markAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.notification-bell') && !target.closest('.notification-dropdown')) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClearAll = async () => {
    setIsClearing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      clearAll()
    } finally {
      setIsClearing(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Bell className="w-5 h-5 text-blue-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500'
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-500'
      case 'error':
        return 'bg-red-50 border-l-4 border-red-500'
      default:
        return 'bg-blue-50 border-l-4 border-blue-500'
    }
  }

  return (
    <div className="relative notification-bell">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`p-2 rounded-full hover:bg-gray-100 transition-colors relative ${
          unreadCount > 0 ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-controls="notification-dropdown"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div 
          id="notification-dropdown"
          className="notification-dropdown absolute right-0 mt-2 w-80 max-h-[600px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClearing ? (
                    <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                  ) : (
                    'Mark All Read'
                  )}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount > 0 
                ? `${unreadCount} new notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>
          
          <div className="overflow-y-auto max-h-[450px]">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="font-medium text-gray-700">No notifications yet</p>
                <p className="text-sm mt-1">You'll receive notifications about payments, project updates, and important alerts here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getNotificationColor(notification.type)}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            notification.read 
                              ? 'bg-gray-100 text-gray-600' 
                              : 'bg-blue-100 text-blue-700 font-medium'
                          }`}>
                            {notification.read ? 'Read' : 'New'}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${
                          notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {' • '}
                            {notification.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                          {notification.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                notification.action?.onClick()
                                markAsRead(notification.id)
                              }}
                              className={`text-blue-600 hover:text-blue-800 font-medium ${
                                notification.read ? 'hover:underline' : ''
                              }`}
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
              <button 
                onClick={handleClearAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
