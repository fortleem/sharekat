'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, CreditCard, Clock, ArrowLeft } from 'lucide-react'

export default function OfflinePaymentPage() {
  useEffect(() => {
    // Register service worker if not already registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope)
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Payment Unavailable</h1>
          </div>
          <p className="text-orange-100">Internet connection required for payment processing</p>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Processing Requires Internet</h2>
            <p className="text-gray-600 mb-6">
              Your payment cannot be processed while offline. Please connect to the internet to complete your investment.
            </p>
            
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 mb-6 border border-purple-200">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-purple-600 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium text-purple-800">Automatic Background Sync</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Don't worry! Your payment will be automatically processed when you reconnect to the internet. 
                    We'll send you a confirmation email once the payment is complete.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800">Your Investment</p>
                <p className="text-lg font-bold text-green-900">5,000 EGP</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Project</p>
                <p className="text-lg font-bold text-blue-900">Solar Farm</p>
              </div>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Check Connection</span>
            </button>
          </div>
          
          <div className="space-y-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <h3 className="font-medium text-yellow-800">What happens when you're back online:</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Payment will be automatically processed</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Investment will be confirmed and added to your portfolio</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>You'll receive email confirmation with transaction details</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Project progress updates will be available in your dashboard</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/investments" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              View My Investments
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
