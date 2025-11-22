'use client'

import { useState } from 'react'
import { useNotifications } from '@/app/context/NotificationContext'

// Mock payment service with notification integration
export class PaymentService {
  private static instance: PaymentService
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }
  
  // Mock payment processing with notifications
  async processPayment(userId: string, amount: number, projectId: number, projectName: string, method: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1 // 90% success rate
        
        if (success) {
          resolve({
            success: true,
            transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            amount,
            projectId,
            projectName,
            method
          })
        } else {
          resolve({
            success: false,
            error: 'Payment failed. Please try again with a different method or contact support.',
            amount,
            projectId,
            projectName,
            method
          })
        }
      }, 1500)
    })
  }
  
  // Mock payment verification
  async verifyPayment(transactionId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05 // 95% verification success rate
        
        if (success) {
          resolve({
            success: true,
            transactionId,
            status: 'completed',
            verifiedAt: new Date()
          })
        } else {
          resolve({
            success: false,
            transactionId,
            status: 'failed',
            error: 'Payment verification failed. Please contact support.'
          })
        }
      }, 1000)
    })
  }
}

// Create singleton instance
export const paymentService = PaymentService.getInstance()

// React hook for payment processing with notifications
export function usePaymentProcessingWithNotifications(userId: string | null) {
  const { addNotification } = useNotifications()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)

  const processPayment = async (amount: number, projectId: number, projectName: string, method: string, paymentDetails: any) => {
    if (!userId) {
      setError('User not authenticated. Please sign in to continue.')
      return
    }
    
    setProcessing(true)
    setError(null)
    setSuccess(false)
    
    try {
      // Show payment processing notification
      addNotification({
        type: 'info',
        title: 'Payment Processing',
        message: `Processing your ${amount.toLocaleString()} EGP payment for ${projectName}...`,
        duration: 3000
      })
      
      const result = await paymentService.processPayment(userId, amount, projectId, projectName, method)
      
      if (result.success) {
        setSuccess(true)
        setTransactionData(result)
        
        // Show success notification
        addNotification({
          type: 'success',
          title: 'Payment Successful',
          message: `Your payment of ${amount.toLocaleString()} EGP for ${projectName} has been confirmed!`,
          action: {
            label: 'View Project',
            onClick: () => {
              window.location.href = `/projects/${projectId}`
            }
          },
          duration: 5000
        })
        
        // Simulate real-time profit distribution update
        setTimeout(() => {
          addNotification({
            type: 'info',
            title: 'Profit Distribution Updated',
            message: `Your profit share for ${projectName} has been updated. Check your dashboard for details.`,
            action: {
              label: 'View Dashboard',
              onClick: () => {
                window.location.href = '/dashboard'
              }
            },
            duration: 8000
          })
        }, 2000)
        
        return result
      } else {
        setError(result.error || 'Payment failed. Please try again.')
        
        // Show error notification
        addNotification({
          type: 'error',
          title: 'Payment Failed',
          message: `Your payment for ${projectName} failed. ${result.error || 'Please try again with a different payment method.'}`,
          action: {
            label: 'Try Again',
            onClick: () => {
              window.location.reload()
            }
          },
          duration: 10000
        })
        
        throw new Error(result.error || 'Payment processing failed')
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.')
      
      // Show error notification if not already shown
      if (!error) {
        addNotification({
          type: 'error',
          title: 'Payment Error',
          message: err.message || 'An unexpected error occurred during payment processing. Please try again.',
          duration: 10000
        })
      }
      
      throw err
    } finally {
      setProcessing(false)
    }
  }

  return {
    processPayment,
    processing,
    error,
    success,
    transactionData
  }
}
