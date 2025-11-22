'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Clock, XCircle } from 'lucide-react'

interface AutoEliminationCountdownProps {
  deadline: string
  onEliminated?: () => void
}

export default function AutoEliminationCountdown({
  deadline,
  onEliminated
}: AutoEliminationCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isEliminated, setIsEliminated] = useState(false)
  const [isOverdue, setIsOverdue] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const deadlineDate = new Date(deadline).getTime()
      const difference = deadlineDate - now
      
      if (difference <= 0) {
        setIsOverdue(true)
        setIsEliminated(true)
        if (onEliminated) onEliminated()
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        }
      }
      
      setIsOverdue(difference < 24 * 60 * 60 * 1000) // Less than 24 hours
      setIsEliminated(false)
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())
    
    // Set up timer
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    // Clean up timer
    return () => clearInterval(timer)
  }, [deadline, onEliminated])

  if (isEliminated) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-800">Investment Eliminated</h3>
            <p className="text-red-700 text-sm mt-1">
              This investment was automatically eliminated due to non-payment within the 48-hour window.
              The security deposit has been forfeited as per platform terms.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getAlertColor = () => {
    if (isOverdue) return 'bg-red-50 border-red-200 text-red-800'
    if (timeLeft.days === 0 && timeLeft.hours < 6) return 'bg-orange-50 border-orange-200 text-orange-800'
    if (timeLeft.days === 0) return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    return 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const getClockColor = () => {
    if (isOverdue) return 'text-red-600'
    if (timeLeft.days === 0 && timeLeft.hours < 6) return 'text-orange-600'
    if (timeLeft.days === 0) return 'text-yellow-600'
    return 'text-blue-600'
  }

  return (
    <div className={`rounded-xl p-4 border ${getAlertColor()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <Clock className={`w-5 h-5 ${getClockColor()}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Payment Deadline Countdown</h3>
            {isOverdue && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                URGENT: PAY NOW
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center bg-white/50 p-2 rounded-lg">
              <div className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
              <div className="text-xs">Days</div>
            </div>
            <div className="text-center bg-white/50 p-2 rounded-lg">
              <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="text-xs">Hours</div>
            </div>
            <div className="text-center bg-white/50 p-2 rounded-lg">
              <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="text-xs">Minutes</div>
            </div>
            <div className="text-center bg-white/50 p-2 rounded-lg">
              <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="text-xs">Seconds</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm">
              {isOverdue 
                ? '⚠️ This payment is OVERDUE and will be automatically eliminated if not completed immediately.'
                : timeLeft.days === 0 && timeLeft.hours < 6
                ? '⏰ URGENT: Less than 6 hours remaining to complete payment!'
                : timeLeft.days === 0
                ? '⏰ Final day to complete payment - don\'t miss the deadline!'
                : '⏰ You have 48 hours from project funding completion to complete your payment.'}
            </p>
            
            <div className="bg-white/30 p-3 rounded-lg border border-white/20">
              <p className="text-sm font-medium mb-1">Auto-Elimination Policy:</p>
              <ul className="text-xs space-y-1 ml-4">
                <li className="list-disc">Unpaid investments will be automatically eliminated after the 48-hour deadline</li>
                <li className="list-disc">Security deposit is non-refundable if payment is not completed on time</li>
                <li className="list-disc">Eliminated investments cannot be recovered - payment must be made before deadline</li>
                <li className="list-disc">Project funding will continue with remaining investors</li>
              </ul>
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs italic">
                This auto-elimination system ensures fair treatment for all committed investors and maintains project funding reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
