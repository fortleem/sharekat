'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { useHoverAnimations, useFormAnimations, animationVariants } from '@/app/hooks/useAnimations'

interface InvestmentFormData {
  amount: string
  paymentMethod: string
  securityDeposit: number
  totalDue: number
  paymentDuration: '48h' | '72h' | '1wk'
}

interface AnimatedInvestmentFormProps {
  projectId: number
  projectName: string
  targetAmount: number
  raisedAmount: number
  onSuccess?: ( InvestmentFormData) => void
  onCancel?: () => void
}

export default function AnimatedInvestmentForm({
  projectId,
  projectName,
  targetAmount,
  raisedAmount,
  onSuccess,
  onCancel
}: AnimatedInvestmentFormProps) {
  const [formData, setFormData] = useState<InvestmentFormData>({
    amount: '',
    paymentMethod: 'paymob',
    securityDeposit: 0,
    totalDue: 0,
    paymentDuration: '48h'
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { isHovered: isSubmitHovered, hoverProps: submitHoverProps } = useHoverAnimations()
  const { isFocused: isAmountFocused, focusProps: amountFocusProps } = useFormAnimations()
  const { isFocused: isMethodFocused, focusProps: methodFocusProps } = useFormAnimations()

  // Calculate security deposit and total due based on amount
  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0
    if (amount > 0) {
      const securityDeposit = amount <= 1000 ? 5 : amount * 0.05
      const totalDue = amount + securityDeposit
      
      setFormData(prev => ({
        ...prev,
        securityDeposit,
        totalDue
      }))
    }
  }, [formData.amount])

  const validateForm = (): boolean => {
    const amount = parseFloat(formData.amount) || 0
    
    if (amount < 10) {
      setError('Minimum investment is 10 EGP')
      return false
    }
    
    if (amount > 1000000) {
      setError('Maximum investment is 1,000,000 EGP')
      return false
    }
    
    if (amount + raisedAmount > targetAmount) {
      setError(`Investment exceeds project funding goal. Maximum investment: ${(targetAmount - raisedAmount).toLocaleString()} EGP`)
      return false
    }
    
    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate random success/failure
      const success = Math.random() > 0.1 // 90% success rate
      
      if (success) {
        setSuccess(true)
        
        if (onSuccess) {
          onSuccess(formData)
          // Don't reset form immediately - let success animation play
        }
      } else {
        throw new Error('Payment processing failed. Please try again with a different method.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during payment processing')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1 && !formData.amount) {
      setError('Please enter an investment amount')
      return
    }
    setCurrentStep(prev => prev + 1)
    setError(null)
  }

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1)
    setError(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getProgressColor = () => {
    const progress = (raisedAmount / targetAmount) * 100
    if (progress >= 90) return 'bg-green-500'
    if (progress >= 70) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <motion.div
      variants={animationVariants.scaleIn}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 10c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 2c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Invest in {projectName}</h1>
        </div>
        <p className="text-blue-100">Secure your stake in this promising project</p>
        
        {/* Project progress bar */}
        <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(raisedAmount / targetAmount) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`${getProgressColor()} h-full`}
          />
        </div>
        
        <div className="mt-2 flex justify-between text-sm">
          <span>{formatCurrency(raisedAmount)} raised</span>
          <span>{((raisedAmount / targetAmount) * 100).toFixed(0)}% funded</span>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start"
          >
            <AlertTriangle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Investment Progress</span>
            <span className="text-sm font-medium text-gray-900">Step {currentStep} of 3</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-blue-600 h-full"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="amount-step"
              variants={animationVariants.fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount (Min: 10 EGP)"
                    className={`w-full px-4 py-3 border ${
                      isAmountFocused ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    min="10"
                    step="1"
                    {...amountFocusProps}
                  />
                  <div className="absolute right-3 top-3.5 text-gray-500 font-medium">EGP</div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum: 10 EGP • Maximum: 1,000,000 EGP
                </p>
              </div>

              {formData.amount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                >
                  <h4 className="font-medium text-blue-800 mb-2">Security Deposit</h4>
                  <p className="text-sm text-blue-700">
                    {parseFloat(formData.amount) <= 1000 
                      ? 'A fixed security deposit of 5 EGP will be applied to your investment.'
                      : `A security deposit of 5% (${formatCurrency(formData.securityDeposit)}) will be applied to your investment.`}
                  </p>
                  <p className="mt-2 text-sm font-medium text-blue-900">
                    Total Due: {formatCurrency(formData.totalDue)}
                  </p>
                </motion.div>
              )}

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800">Payment Terms</p>
                    <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Security deposit is non-refundable if project proceeds to funding</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Payment must be completed within {formData.paymentDuration === '48h' ? '48 hours' : formData.paymentDuration === '72h' ? '72 hours' : '1 week'} of project reaching target funding</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Unpaid investments will be automatically eliminated after the deadline</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="payment-step"
              variants={animationVariants.fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {['paymob', 'instapay', 'fawry', 'wallet'].map((method) => (
                    <motion.label
                      key={method}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === method
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                        className="form-radio h-5 w-5 text-blue-600"
                        {...methodFocusProps}
                      />
                      <div className="ml-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            {method === 'paymob' && <CreditCard className="w-5 h-5 text-white" />}
                            {method === 'instapay' && <Smartphone className="w-5 h-5 text-white" />}
                            {method === 'fawry' && <Wallet className="w-5 h-5 text-white" />}
                            {method === 'wallet' && <Wallet className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">{method}</h4>
                            <p className="text-sm text-gray-600">
                              {method === 'paymob' && 'Credit/Debit Card, Kiosk, Wallet'}
                              {method === 'instapay' && 'Mobile Wallet, Bank Transfer'}
                              {method === 'fawry' && 'Cash Payment, Fawry Points'}
                              {method === 'wallet' && 'Sherketi Wallet Balance'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="font-medium text-purple-800">Payment Duration Options</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {['48h', '72h', '1wk'].map((duration) => (
                        <button
                          key={duration}
                          onClick={() => setFormData(prev => ({ ...prev, paymentDuration: duration as any }))}
                          className={`px-3 py-2 text-xs rounded-md font-medium ${
                            formData.paymentDuration === duration
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-white text-gray-700 hover:bg-purple-50'
                          }`}
                        >
                          {duration === '48h' ? '48h' : duration === '72h' ? '72h' : '1wk'}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-purple-700">
                      Shorter durations offer better elimination protection but require faster payment
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="summary-step"
              variants={animationVariants.fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Investment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project</span>
                    <span className="font-medium text-gray-900">{projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Amount</span>
                    <span className="font-medium text-green-600">{formatCurrency(parseFloat(formData.amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="font-medium text-yellow-600">{formatCurrency(formData.securityDeposit)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-bold text-lg text-gray-900">Total Due</span>
                    <span className="font-bold text-2xl text-blue-600">{formatCurrency(formData.totalDue)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">What to Expect Next</h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Immediate confirmation email with transaction details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Access to project dashboard and investment tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Profit distribution updates as project reaches milestones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Automatic payment reminders before deadline</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800">Important Reminder</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your investment will be automatically eliminated if payment is not completed within {formData.paymentDuration === '48h' ? '48 hours' : formData.paymentDuration === '72h' ? '72 hours' : '1 week'} of project funding completion. The security deposit is non-refundable.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your investment of {formatCurrency(formData.totalDue)} has been confirmed.
              You'll receive a confirmation email shortly.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center space-x-4"
            >
              <button
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Return to Dashboard
              </button>
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Project Details
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={currentStep === 1 ? onCancel : handlePreviousStep}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            
            <motion.button
              {...submitHoverProps}
              onClick={currentStep === 3 ? handleSubmit : handleNextStep}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : currentStep === 3
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </div>
              ) : currentStep === 3 ? (
                'Confirm Investment'
              ) : (
                'Next Step'
              )}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Helper components for icons
const CreditCard = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
  </svg>
)

const Smartphone = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
  </svg>
)

const Wallet = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
  </svg>
)
