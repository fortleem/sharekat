'use client'

import { useState, useEffect } from 'react'
import { useNotifications } from '@/app/context/NotificationContext'

// Mock notification types and data
export interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  projectId?: number
  investmentId?: number
  amount?: number
  action?: {
    label: string
    url: string
  }
}

// Mock real-time notification service
export class NotificationService {
  private static instance: NotificationService
  private socket: WebSocket | null = null
  private listeners: ((notification: Notification) => void)[] = []
  private userId: string | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  public init(userId: string) {
    this.userId = userId
    
    // In production, this would connect to a WebSocket server
    // For now, we'll simulate real-time notifications with a timer
    console.log('📱 Initializing mock notification service for user:', userId)
    
    // Start mock notification simulation
    this.startMockNotifications()
  }

  private startMockNotifications() {
    // Clear any existing timer
    if (this.reconnectTimeout) {
      clearInterval(this.reconnectTimeout)
    }
    
    // Simulate real-time notifications every 30-60 seconds
    this.reconnectTimeout = setInterval(() => {
      this.sendMockNotification()
    }, 30000 + Math.random() * 30000) // Random interval between 30-60 seconds
  }

  private sendMockNotification() {
    if (!this.userId) return
    
    const mockNotifications: Notification[] = [
      {
        id: `mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: 'success',
        title: 'Investment Confirmed',
        message: 'Your investment of 5,000 EGP in Solar Farm Expansion has been confirmed!',
        timestamp: new Date(),
        read: false,
        projectId: 1,
        investmentId: Math.floor(Math.random() * 1000),
        amount: 5000,
        action: {
          label: 'View Project',
          url: '/projects/1'
        }
      },
      {
        id: `mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: 'info',
        title: 'Project Update',
        message: 'Solar Farm Expansion project has reached 75% funding goal!',
        timestamp: new Date(),
        read: false,
        projectId: 1,
        action: {
          label: 'See Details',
          url: '/projects/1'
        }
      },
      {
        id: `mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: 'warning',
        title: 'Payment Deadline Approaching',
        message: 'Your payment for Renewable Water Desalination Plant investment is due in 24 hours!',
        timestamp: new Date(),
        read: false,
        projectId: 3,
        investmentId: Math.floor(Math.random() * 1000),
        amount: 2500,
        action: {
          label: 'Pay Now',
          url: '/payments'
        }
      },
      {
        id: `mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: 'error',
        title: 'Investment Eliminated',
        message: 'Your investment in Urban Mobility Solutions was eliminated due to non-payment within the deadline.',
        timestamp: new Date(),
        read: false,
        projectId: 4,
        investmentId: Math.floor(Math.random() * 1000),
        amount: 3000,
        action: {
          label: 'Contact Support',
          url: '/support'
        }
      }
    ]
    
    // Randomly select a notification type
    const randomIndex = Math.floor(Math.random() * mockNotifications.length)
    const notification = mockNotifications[randomIndex]
    
    console.log('🔔 Mock notification received:', notification)
    this.listeners.forEach(listener => listener(notification))
  }

  public addListener(callback: (notification: Notification) => void) {
    this.listeners.push(callback)
  }

  public removeListener(callback: (notification: Notification) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback)
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    
    if (this.reconnectTimeout) {
      clearInterval(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    
    console.log('🔌 Notification service disconnected')
  }
}

// Create singleton instance
export const notificationService = NotificationService.getInstance()

// React hook for notifications
export function useRealTimeNotifications(userId: string | null) {
  const { addNotification } = useNotifications()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!userId) return
    
    console.log('🎯 Setting up real-time notifications for user:', userId)
    
    try {
      // Initialize the notification service
      notificationService.init(userId)
      setIsConnected(true)
      
      // Add notification listener
      const handleNotification = (notification: Notification) => {
        console.log('🚨 Handling real-time notification:', notification)
        
        addNotification({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          action: notification.action ? {
            label: notification.action.label,
            onClick: () => {
              window.location.href = notification.action!.url
            }
          } : undefined,
          duration: notification.type === 'success' ? 5000 : 8000 // Auto-dismiss after 5-8 seconds
        })
      }
      
      notificationService.addListener(handleNotification)
      
      return () => {
        console.log('🧹 Cleaning up notification listeners')
        notificationService.removeListener(handleNotification)
      }
      
    } catch (error) {
      console.error('❌ Error setting up notifications:', error)
      setIsConnected(false)
    }
  }, [userId, addNotification])

  return { isConnected }
}
