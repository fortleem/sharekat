'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, XCircle, Loader, RefreshCw } from 'lucide-react'
import { useNotifications } from '@/app/context/NotificationContext'
import { notificationService, useRealTimeNotifications } from '@/app/services/notifications/notificationService'

export default function NotificationCenter() {
  const { notifications, markAsRead, removeNotification, clearAll, unreadCount } = useNotifications()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Simulate user ID for real-time notifications
  const userId = 'user_123'
  useRealTimeNotifications(userId)

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notification.read
    if (activeTab === 'read') return notification.read
    return notification.type === activeTab
  })

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Bell className="w-5 h-5 text-blue-600" />
    }
  }

  const handleRefresh = async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    try {
      // Simulate API call to fetch notifications
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real implementation, this would fetch notifications from backend
      console.log('🔄 Refreshing notifications...')
      
    } catch (err) {
      setError('Failed to refresh notifications. Please try again.')
      console.error('Error refreshing notifications:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleClearAll = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      clearAll()
    } catch (err) {
      setError('Failed to clear notifications. Please try again.')
      console.error('Error clearing notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Notification Center</h1>
            </div>
            <p className="text-blue-100">All your project updates, payment alerts, and platform notifications in one place</p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
                <AlertTriangle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    activeTab === 'unread'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setActiveTab('read')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    activeTab === 'read'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Read
                </button>
                <button
                  onClick={() => setActiveTab('success')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    activeTab === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Success
                </button>
                <button
                  onClick={() => setActiveTab('warning')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    activeTab === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Warnings
                </button>
                <button
                  onClick={() => setActiveTab('error')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    activeTab === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Errors
                </button>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center ${
                    isRefreshing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isRefreshing ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={loading || unreadCount === 0}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center ${
                    loading || unreadCount === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Mark All Read
                </button>
              </div>
            </div>
            
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {activeTab === 'unread' ? 'No unread notifications' : 'No notifications found'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'unread' 
                    ? 'You have no unread notifications at this time.'
                    : activeTab === 'all'
                    ? 'You haven\'t received any notifications yet.'
                    : `No ${activeTab} notifications found.`}
                </p>
                <button
                  onClick={() => setActiveTab('all')}
                  className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View All Notifications
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getNotificationColor(notification.type)}`}
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
                        
                        {notification.action && (
                          <Link
                            href={notification.action.url}
                            className={`mt-2 inline-block px-3 py-1 text-xs font-medium rounded-md ${
                              notification.type === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                              notification.type === 'error' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                              'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            } transition-colors`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.action.label}
                          </Link>
                        )}
                        
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {' • '}
                            {notification.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
                            aria-label="Dismiss notification"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Bell className="w-4 h-4 mr-1" />
                    Notification Preferences
                  </h4>
                  <p className="text-sm text-blue-700">
                    Customize which notifications you receive and how you receive them.
                  </p>
                  <Link href="/notifications/preferences" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800">
                    Manage Preferences →
                  </Link>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Enable Push Notifications
                  </h4>
                  <p className="text-sm text-green-700">
                    Get instant alerts on your mobile device for critical updates.
                  </p>
                  <button className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md hover:bg-green-200 transition-colors">
                    Enable Push Notifications
                  </button>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Real-time Updates
                  </h4>
                  <p className="text-sm text-purple-700">
                    Notifications are updated in real-time. You're currently connected.
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-purple-800 font-medium">Connected • Live updates enabled</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">Notification System Status</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><span className="font-medium">Real-time updates:</span> Active and connected</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><span className="font-medium">Email alerts:</span> Enabled for payment deadlines and project updates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><span className="font-medium">Push notifications:</span> Available for mobile app users</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><span className="font-medium">Storage:</span> Notifications are stored for 30 days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
