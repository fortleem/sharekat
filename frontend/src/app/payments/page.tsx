'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, CreditCard, Smartphone, Wallet, Bell } from 'lucide-react'
import PaymentForm from '@/app/components/payment/PaymentForm'
import { paymentService } from '@/app/services/payments/gatewayService'
import { usePaymentProcessingWithNotifications } from '@/app/services/payments/paymentService'
import { useNotifications } from '@/app/context/NotificationContext'

// Format date consistently across server and client
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function Payments() {
  const { addNotification } = useNotifications()
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [userId] = useState('user_123') // Mock user ID for notifications

  // Use the notification-enabled payment hook
  const { 
    processPayment: processPaymentWithNotifications,
    processing,
    error: paymentError,
    success: paymentSuccess,
    transactionData
  } = usePaymentProcessingWithNotifications(userId)

  useEffect(() => {
    if (paymentError) {
      setError(paymentError)
    }
  }, [paymentError])

  useEffect(() => {
    if (paymentSuccess && transactionData) {
      setPaymentResult(transactionData)
      setPaymentStatus('success')
      
      // This will be handled by the notification service, but we can add a small delay before redirecting
      setTimeout(() => {
        window.location.href = '/investments?payment_success=true'
      }, 2000)
    }
  }, [paymentSuccess, transactionData])

  // Mock pending investments data
  const pendingInvestments = [
    { 
      id: 3, 
      projectId: 3, 
      projectName: 'Renewable Water Desalination Plant',
      amount: 2500, 
      securityDeposit: 125,
      totalDue: 2625,
      paymentDue: '2025-11-17T23:59:59',
      status: 'pending'
    },
    { 
      id: 5, 
      projectId: 1, 
      projectName: 'Solar Farm Expansion - Upper Egypt',
      amount: 10000, 
      securityDeposit: 500,
      totalDue: 10500,
      paymentDue: '2025-12-17T23:59:59',
      status: 'pending'
    }
  ]

  const handlePaymentSuccess = (transactionData: any) => {
    // This is now handled by the notification service
    setPaymentResult(transactionData)
    setPaymentStatus('success')
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
    setPaymentStatus('error')
  }

  if (!selectedInvestment && pendingInvestments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Pending Payments</h2>
          <p className="text-gray-600 mb-6">You have no pending investment payments at this time.</p>
          <Link href="/projects" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Browse Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/investments" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Investments
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                {selectedInvestment ? `Pay for ${selectedInvestment.projectName}` : 'Complete Payment'}
              </h1>
            </div>
            <p className="text-blue-100">
              {selectedInvestment 
                ? `Securely pay your ${selectedInvestment.totalDue.toLocaleString()} EGP investment`
                : 'Securely pay for your pending investments'}
            </p>
          </div>
          
          <div className="p-6">
            {paymentStatus === 'success' && paymentResult && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">Your payment of {paymentResult.amount.toLocaleString()} EGP has been confirmed.</p>
                <div className="max-w-md mx-auto bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div>
                      <p className="text-sm text-green-700">Transaction ID:</p>
                      <p className="font-mono text-xs text-green-800 mt-1">{paymentResult.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Payment Method:</p>
                      <p className="text-sm font-medium text-green-800 mt-1 capitalize">{paymentResult.method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Amount Paid:</p>
                      <p className="font-bold text-green-800 mt-1">{paymentResult.amount.toLocaleString()} EGP</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Status:</p>
                      <p className="font-medium text-green-800 mt-1">Completed</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 max-w-md mx-auto">
                  <p className="font-medium text-green-800 mb-2">Next Steps:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You will receive a confirmation email shortly</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Track your investment progress in the "My Investments" section</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Profit distributions will begin once the project is operational</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Your investment will be protected by our auto-elimination policy</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {paymentStatus === 'error' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                <p className="text-red-600 mb-4">{error || 'Payment processing failed. Please try again.'}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setPaymentStatus('idle')}
                    className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setSelectedInvestment(null)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Select Different Payment
                  </button>
                </div>
              </div>
            )}
            
            {paymentStatus === 'idle' && !selectedInvestment && (
              // Investment selection view
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Select Payment to Complete</h2>
                
                {pendingInvestments.map((investment) => {
                  const isOverdue = new Date(investment.paymentDue) < new Date()
                  
                  return (
                    <div 
                      key={investment.id} 
                      className={`border rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all ${
                        isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedInvestment(investment)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{investment.projectName}</h3>
                          <p className="text-gray-600 mt-1">Investment Amount: {investment.amount.toLocaleString()} EGP</p>
                          <p className="text-gray-600">Security Deposit: {investment.securityDeposit.toLocaleString()} EGP</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{investment.totalDue.toLocaleString()} EGP</div>
                          <span className={`px-2 py-1 text-xs rounded-full mt-1 inline-block ${
                            isOverdue 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {isOverdue ? 'OVERDUE' : 'DUE SOON'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Payment due: {formatDate(investment.paymentDue)}</span>
                        </div>
                        {isOverdue && (
                          <div className="flex items-center text-red-600">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span className="font-medium">Risk of elimination</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            
            {paymentStatus === 'idle' && selectedInvestment && (
              // Payment form view - now using notification-enabled payment service
              <PaymentForm
                investmentAmount={selectedInvestment.amount}
                projectId={selectedInvestment.projectId}
                projectName={selectedInvestment.projectName}
                paymentDue={selectedInvestment.paymentDue}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
