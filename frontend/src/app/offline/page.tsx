'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'

export default function OfflinePage() {
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Offline Mode</h1>
          </div>
          <p className="text-blue-100">You're currently offline. Some features may be limited.</p>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Internet Connection</h2>
            <p className="text-gray-600 mb-6">
              You can continue using cached features, but new data won't be available until you're back online.
            </p>
            
            <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <h3 className="font-medium text-blue-800 mb-2">Available Offline Features:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>View saved projects and investments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access investment history and analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>View project details and AI analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Chat with AI investment assistant</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3 bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
              <h3 className="font-medium text-yellow-800 mb-2">Limited Features:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>New investments require internet connection</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Real-time notifications will be delivered when back online</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Payment processing unavailable until online</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Check Connection</span>
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
