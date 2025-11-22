'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock success for any email
      setSuccess(true)
      
      // Clear form after success
      setEmail('')
      
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-blue-100 mt-2">Enter your email to reset your password</p>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
              Password reset link sent successfully! Check your email inbox (and spam folder).
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
                required
                disabled={loading || success}
              />
              <p className="mt-1 text-xs text-gray-500">
                We'll send a password reset link to this email address
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending reset link...' : 'Send Reset Link'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-blue-600 font-medium hover:text-blue-800">
                Sign in
              </Link>
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-blue-600 font-medium hover:text-blue-800">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
