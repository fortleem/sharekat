'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Project {
  id: number
  title: string
  target: number
  raised: number
  manager: string
  deadline: string
}

interface InvestmentModalProps {
  project: Project
  isOpen: boolean
  onClose: () => void
  onInvest: (amount: number) => void
}

export default function InvestmentModal({ 
  project, 
  isOpen, 
  onClose, 
  onInvest 
}: InvestmentModalProps) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [securityDeposit, setSecurityDeposit] = useState(0)

  // Calculate security deposit (5 EGP if ≤1000, 5% if >1000)
  useEffect(() => {
    if (amount) {
      const amt = parseFloat(amount)
      if (!isNaN(amt)) {
        setSecurityDeposit(amt <= 1000 ? 5 : amt * 0.05)
      }
    }
  }, [amount])

  const validateAmount = (value: string): boolean => {
    const amt = parseFloat(value)
    
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid amount')
      return false
    }
    
    if (amt < 10) {
      setError('Minimum investment is 10 EGP')
      return false
    }
    
    if (amt > 1000000) {
      setError('Maximum investment is 1,000,000 EGP')
      return false
    }
    
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateAmount(amount)) return
    
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const investmentAmount = parseFloat(amount)
      onInvest(investmentAmount)
      
      // Reset form
      setAmount('')
      onClose()
    } catch (err) {
      setError('Failed to process investment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">Invest in {project.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-600">Project Manager</div>
                <div className="font-medium text-gray-900">{project.manager}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Deadline</div>
                <div className="font-medium text-gray-900">{project.deadline}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Target Amount</div>
                <div className="font-medium text-green-600">{project.target.toLocaleString()} EGP</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Amount Raised</div>
                <div className="font-medium text-blue-600">{project.raised.toLocaleString()} EGP</div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    validateAmount(e.target.value)
                  }}
                  className={`w-full px-4 py-3 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter amount (Min: 10 EGP)"
                  min="10"
                  step="1"
                  autoFocus
                />
                <div className="absolute right-3 top-3.5 text-gray-500 font-medium">EGP</div>
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>
            
            <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-sm text-yellow-800 font-medium">
                    Security Deposit: {securityDeposit > 0 ? securityDeposit.toLocaleString() : '0'} EGP
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    A security deposit of {securityDeposit <= 5 ? '5 EGP' : '5%'} will be applied to your investment. This amount will be deducted from your final payment if the project is successfully funded.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Important Information</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Minimum investment: 10 EGP</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Payment must be completed within 48 hours of project reaching target</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Security deposit is non-refundable if project proceeds</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You can cancel before project reaches target</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || !amount || !!error}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Confirm Investment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
