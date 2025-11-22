'use client'

import { useState } from 'react'

// Mock payment gateway interface that simulates real payment processing
export interface PaymentGateway {
  processPayment: (amount: number, method: string, details: any) => Promise<{ success: boolean, transactionId: string, receiptUrl: string }>
  verifyPayment: (transactionId: string) => Promise<{ status: string, amount: number, timestamp: Date }>
  refundPayment: (transactionId: string, amount?: number) => Promise<{ success: boolean, refundId: string }>
  getPaymentMethods: () => string[]
}

// Mock payment service that simulates real payment processing
export class MockPaymentService {
  private static instance: MockPaymentService
  
  private constructor() {
    // Private constructor to prevent direct instantiation
  }
  
  public static getInstance(): MockPaymentService {
    if (!MockPaymentService.instance) {
      MockPaymentService.instance = new MockPaymentService()
    }
    return MockPaymentService.instance
  }
  
  // Simulate payment processing with different success rates based on method
  async processPayment(amount: number, method: string, paymentDetails: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different success rates based on payment method
        const successRate = {
          'paymob': 0.95,    // 95% success rate
          'instapay': 0.90,  // 90% success rate
          'fawry': 0.85,     // 85% success rate
          'wallet': 0.98     // 98% success rate
        }
        
        const success = Math.random() < (successRate[method] || 0.9)
        
        if (success) {
          const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`
          const receiptUrl = `/receipts/${transactionId}`
          
          resolve({
            success: true,
            transactionId,
            receiptUrl,
            method,
            amount,
            timestamp: new Date(),
            paymentDetails: {
              ...paymentDetails,
              maskedCard: paymentDetails.cardNumber ? `**** **** **** ${paymentDetails.cardNumber.slice(-4)}` : undefined
            }
          })
        } else {
          // Simulate different error types
          const errorTypes = [
            'Connection timeout with payment gateway',
            'Insufficient funds or credit limit exceeded',
            'Card declined by issuing bank',
            'Invalid CVV or expiration date',
            'Payment gateway temporarily unavailable'
          ]
          
          const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)]
          
          resolve({
            success: false,
            error: randomError,
            method,
            amount,
            timestamp: new Date()
          })
        }
      }, 1500) // Simulate network delay
    })
  }
  
  // Simulate payment verification
  async verifyPayment(transactionId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1 // 90% verification success rate
        
        if (success) {
          resolve({
            status: 'completed',
            transactionId,
            amount: Math.floor(Math.random() * 10000) + 1000, // Random amount between 1000-11000
            timestamp: new Date(),
            verifiedAt: new Date()
          })
        } else {
          resolve({
            status: 'failed',
            transactionId,
            error: 'Verification failed - transaction not found in payment gateway',
            timestamp: new Date()
          })
        }
      }, 1000)
    })
  }
  
  // Simulate refund processing
  async refundPayment(transactionId: string, amount?: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05 // 95% refund success rate
        
        if (success) {
          resolve({
            success: true,
            refundId: `REF-${transactionId}-${Date.now()}`,
            transactionId,
            amount: amount || Math.floor(Math.random() * 5000) + 1000,
            timestamp: new Date(),
            status: 'completed'
          })
        } else {
          resolve({
            success: false,
            transactionId,
            error: 'Refund failed - contact payment gateway support',
            timestamp: new Date()
          })
        }
      }, 1200)
    })
  }
  
  // Get available payment methods
  getPaymentMethods() {
    return [
      { id: 'paymob', name: 'Paymob', icon: '💳', description: 'Credit/Debit Card, Kiosk, Wallet' },
      { id: 'instapay', name: 'InstaPay', icon: '📱', description: 'Mobile Wallet, Bank Transfer' },
      { id: 'fawry', name: 'Fawry', icon: '🏪', description: 'Cash Payment, Fawry Points' },
      { id: 'wallet', name: 'Cash Wallet', icon: '💰', description: 'Sherketi Wallet Balance' }
    ]
  }
  
  // Calculate security deposit (5 EGP if ≤1000, 5% if >1000)
  calculateSecurityDeposit = (amount: number): number => {
    if (amount <= 1000) {
      return 5
    }
    return Math.min(amount * 0.05, 50000) // Cap at 50,000 EGP for very large investments
  }
  
  // Calculate total payment amount including security deposit
  calculateTotalAmount = (investmentAmount: number): number => {
    const securityDeposit = this.calculateSecurityDeposit(investmentAmount)
    return investmentAmount + securityDeposit
  }
  
  // Validate payment details based on payment method
  validatePaymentDetails = (method: string, details: any): { valid: boolean, errors: string[] } => {
    const errors: string[] = []
    
    switch (method) {
      case 'paymob':
        if (!details.cardNumber || !/^\d{16}$/.test(details.cardNumber.replace(/\s/g, ''))) {
          errors.push('Invalid card number')
        }
        if (!details.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(details.expiryDate)) {
          errors.push('Invalid expiry date format (MM/YY)')
        }
        if (!details.cvv || !/^\d{3,4}$/.test(details.cvv)) {
          errors.push('Invalid CVV')
        }
        break
        
      case 'instapay':
        if (!details.phoneNumber || !/^\d{11}$/.test(details.phoneNumber)) {
          errors.push('Invalid phone number format')
        }
        break
        
      case 'fawry':
        if (!details.referenceNumber || details.referenceNumber.length < 8) {
          errors.push('Invalid Fawry reference number')
        }
        break
        
      case 'wallet':
        // Wallet validation would check user's wallet balance in real implementation
        break
    }
    
    return { valid: errors.length === 0, errors }
  }
}

// Create singleton instance
export const paymentService = MockPaymentService.getInstance()

// React hook for payment processing
export function usePaymentProcessing() {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)

  const processPayment = async (amount: number, method: string, paymentDetails: any) => {
    setProcessing(true)
    setError(null)
    setSuccess(false)
    
    try {
      const result = await paymentService.processPayment(amount, method, paymentDetails)
      
      if (result.success) {
        setSuccess(true)
        setTransactionData(result)
        return result
      } else {
        setError(result.error || 'Payment failed. Please try again.')
        throw new Error(result.error)
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.')
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
    transactionData,
    paymentMethods: paymentService.getPaymentMethods(),
    calculateSecurityDeposit: paymentService.calculateSecurityDeposit,
    calculateTotalAmount: paymentService.calculateTotalAmount,
    validatePaymentDetails: paymentService.validatePaymentDetails
  }
}
