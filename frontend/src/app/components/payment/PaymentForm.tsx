'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Smartphone, Wallet, AlertTriangle, CheckCircle, Loader } from 'lucide-react'
import { usePaymentProcessing } from '@/app/services/payments/gatewayService'
import SecurityDepositAlert from './SecurityDepositAlert'
import AutoEliminationCountdown from './AutoEliminationCountdown'

interface PaymentFormProps {
  investmentAmount: number
  projectId: number
  projectName: string
  paymentDue?: string
  onSuccess?: (transactionData: any) => void
}

export default function PaymentForm({
  investmentAmount,
  projectId,
  projectName,
  paymentDue,
  onSuccess
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState('paymob')
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    referenceNumber: '',
    walletPin: ''
  })
  const [showCardForm, setShowCardForm] = useState(true)
  const [showPhoneForm, setShowPhoneForm] = useState(false)
  const [showReferenceForm, setShowReferenceForm] = useState(false)
  const [showWalletForm, setShowWalletForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [securityDeposit, setSecurityDeposit] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  const {
    processPayment,
    paymentMethods,
    calculateSecurityDeposit,
    calculateTotalAmount,
    validatePaymentDetails
  } = usePaymentProcessing()

  // Calculate security deposit and total amount on component mount
  useEffect(() => {
    const deposit = calculateSecurityDeposit(investmentAmount)
    const total = calculateTotalAmount(investmentAmount)
    
    setSecurityDeposit(deposit)
    setTotalAmount(total)
  }, [investmentAmount, calculateSecurityDeposit, calculateTotalAmount])

  // Update payment form visibility based on selected method
  useEffect(() => {
    setShowCardForm(selectedMethod === 'paymob')
    setShowPhoneForm(selectedMethod === 'instapay')
    setShowReferenceForm(selectedMethod === 'fawry')
    setShowWalletForm(selectedMethod === 'wallet')
  }, [selectedMethod])

  const handlePaymentMethodChange = (method: string) => {
    setSelectedMethod(method)
    setError(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/')
  }

  const validateForm = (): boolean => {
    const { valid, errors } = validatePaymentDetails(selectedMethod, paymentDetails)
    
    if (!valid && errors.length > 0) {
      setError(errors[0])
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      const result = await processPayment(
        totalAmount,
        selectedMethod,
        {
          ...paymentDetails,
          projectId,
          projectName,
          investmentAmount,
          securityDeposit
        }
      )
      
      if (result.success) {
        if (onSuccess) onSuccess(result)
      } else {
        setError(result.error || 'Payment failed. Please try again with a different method.')
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Security Deposit Alert */}
      <SecurityDepositAlert
        investmentAmount={investmentAmount}
        securityDeposit={securityDeposit}
        isOverdue={paymentDue ? new Date(paymentDue) < new Date() : false}
        paymentDue={paymentDue}
      />
      
      {/* Auto-Elimination Countdown (only show if paymentDue is provided) */}
      {paymentDue && (
        <AutoEliminationCountdown
          deadline={paymentDue}
          onEliminated={() => {
            setError('This investment has been automatically eliminated due to non-payment. Please contact support for assistance.')
          }}
        />
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Complete Your Payment</h2>
        
        {/* Payment Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Project</span>
            <span className="font-medium text-gray-900">{projectName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Investment Amount</span>
            <span className="font-medium text-green-600">{investmentAmount.toLocaleString()} EGP</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Security Deposit</span>
            <span className="font-medium text-yellow-600">{securityDeposit.toLocaleString()} EGP</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
            <span className="text-lg font-bold text-gray-900">Total Due</span>
            <span className="text-2xl font-bold text-blue-600">{totalAmount.toLocaleString()} EGP</span>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
            <AlertTriangle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handlePaymentMethodChange(method.id)}
                  className={`p-4 border rounded-xl text-left transition-all ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      {method.id === 'paymob' && <CreditCard className="w-5 h-5 text-white" />}
                      {method.id === 'instapay' && <Smartphone className="w-5 h-5 text-white" />}
                      {method.id === 'fawry' && <Wallet className="w-5 h-5 text-white" />}
                      {method.id === 'wallet' && <Wallet className="w-5 h-5 text-white" />}
                    </div>
                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  {method.id === 'paymob' && (
                    <div className="mt-2 flex items-center">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Recommended</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Payment Details Forms */}
          <div className="space-y-4">
            {/* Card Payment Form */}
            {showCardForm && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: 'cardNumber',
                        value: formatCardNumber(e.target.value)
                      }
                    } as any)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={19}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'expiryDate',
                          value: formatExpiryDate(e.target.value)
                        }
                      } as any)}
                      placeholder="12/25"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Phone Payment Form */}
            {showPhoneForm && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (for InstaPay)
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={paymentDetails.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="010XXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={11}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be a valid Egyptian mobile number
                </p>
              </div>
            )}
            
            {/* Fawry Reference Form */}
            {showReferenceForm && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fawry Reference Number
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={paymentDetails.referenceNumber}
                  onChange={handleInputChange}
                  placeholder="12345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  minLength={8}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  You'll receive this reference number at a Fawry point or via SMS
                </p>
              </div>
            )}
            
            {/* Wallet Payment Form */}
            {showWalletForm && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet PIN
                </label>
                <input
                  type="password"
                  name="walletPin"
                  value={paymentDetails.walletPin}
                  onChange={handleInputChange}
                  placeholder="••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={6}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter your 6-digit wallet PIN to confirm payment
                </p>
              </div>
            )}
          </div>
          
          {/* Terms and Conditions */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Payment Terms</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Security deposit of {securityDeposit.toLocaleString()} EGP is non-refundable if the project proceeds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Payment must be completed within 48 hours of project reaching target funding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Unpaid investments will be automatically eliminated after the deadline</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>All payments are processed securely through our payment partners</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isProcessing}
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center ${
                isProcessing ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay {totalAmount.toLocaleString()} EGP
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
