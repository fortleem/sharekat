'use client'

import { AlertTriangle, Shield, CheckCircle, AlertCircle } from 'lucide-react'

interface SecurityDepositAlertProps {
  investmentAmount: number
  securityDeposit: number
  isOverdue?: boolean
  paymentDue?: string
}

export default function SecurityDepositAlert({
  investmentAmount,
  securityDeposit,
  isOverdue = false,
  paymentDue
}: SecurityDepositAlertProps) {
  // Determine if this is a small or large investment
  const isSmallInvestment = investmentAmount <= 1000
  const depositPercentage = isSmallInvestment ? 'Fixed fee' : `${((securityDeposit / investmentAmount) * 100).toFixed(1)}%`
  
  // Get status color and icon based on overdue status
  const getStatusColor = () => {
    if (isOverdue) return 'bg-red-50 border-red-200 text-red-800'
    if (securityDeposit > 0) return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    return 'bg-blue-50 border-blue-200 text-blue-800'
  }
  
  const getStatusIcon = () => {
    if (isOverdue) return <AlertCircle className="w-5 h-5 text-red-600" />
    if (securityDeposit > 0) return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    return <Shield className="w-5 h-5 text-blue-600" />
  }

  return (
    <div className={`rounded-xl p-4 border ${getStatusColor()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Security Deposit: {securityDeposit.toLocaleString()} EGP</h3>
            {isOverdue && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                PAYMENT OVERDUE
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="bg-white/50 p-3 rounded-lg">
              <p className="text-sm font-medium">Investment Amount</p>
              <p className="text-lg font-bold">{investmentAmount.toLocaleString()} EGP</p>
            </div>
            <div className="bg-white/50 p-3 rounded-lg">
              <p className="text-sm font-medium">Deposit Type</p>
              <p className="text-lg font-bold">{isSmallInvestment ? 'Fixed Fee' : 'Percentage'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm">
              {isSmallInvestment 
                ? 'A fixed security deposit of 5 EGP applies to all investments of 1,000 EGP or less.'
                : `A security deposit of ${depositPercentage} (${securityDeposit.toLocaleString()} EGP) applies to your investment.`}
            </p>
            
            <div className="bg-white/30 p-3 rounded-lg border border-white/20">
              <p className="text-sm font-medium mb-1">Important Terms:</p>
              <ul className="text-xs space-y-1 ml-4">
                <li className="list-disc">Security deposit is non-refundable if the project proceeds to funding</li>
                <li className="list-disc">Deposit will be deducted from your final payment amount</li>
                <li className="list-disc">Payment must be completed within 48 hours of project reaching target funding</li>
                {isOverdue && (
                  <li className="list-disc text-red-600 font-medium">
                    ⚠️ URGENT: This payment is overdue and risks automatic elimination
                  </li>
                )}
              </ul>
            </div>
            
            {paymentDue && (
              <div className="mt-2 p-2 bg-white/20 rounded-lg border border-white/30">
                <p className="text-sm font-medium">
                  Payment Due: <span className={`font-bold ${isOverdue ? 'text-red-500' : 'text-white'}`}>
                    {paymentDue}
                    {isOverdue && ' (OVERDUE)'}
                  </span>
                </p>
              </div>
            )}
            
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs italic">
                This security deposit mechanism protects all investors by ensuring committed participants follow through on their investments, maintaining project funding integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
