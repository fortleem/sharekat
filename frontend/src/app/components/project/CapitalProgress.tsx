'use client'

import { useState, useEffect } from 'react'

interface CapitalProgressProps {
  target: number
  raised: number
  deadline?: string
  showDetails?: boolean
}

export default function CapitalProgress({ 
  target, 
  raised, 
  deadline, 
  showDetails = true 
}: CapitalProgressProps) {
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Calculate progress percentage
    const calculatedProgress = Math.min(100, (raised / target) * 100)
    
    // Animate the progress bar
    if (!isAnimating) {
      setIsAnimating(true)
      let start = 0
      const duration = 1000 // 1 second animation
      const startTime = performance.now()
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = progress * (2 - progress) // Ease-out quadratic
        
        start = easedProgress * calculatedProgress
        setProgress(start)
        
        if (elapsed < duration) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }
      
      requestAnimationFrame(animate)
    } else {
      setProgress(calculatedProgress)
    }
  }, [raised, target, isAnimating])

  const daysLeft = deadline ? Math.max(0, Math.floor(
    (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )) : null

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {showDetails && (
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Raised</div>
              <div className="font-bold text-lg text-green-600">{raised.toLocaleString()} EGP</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Target</div>
              <div className="font-bold text-lg text-gray-900">{target.toLocaleString()} EGP</div>
            </div>
          </div>
        )}
        
        {deadline && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">Days Left</div>
            <div className={`font-bold text-lg ${
              daysLeft === 0 ? 'text-red-600' : 
              daysLeft <= 3 ? 'text-yellow-600' : 
              'text-blue-600'
            }`}>
              {daysLeft} days
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress: {Math.round(progress)}%</span>
          <span>{Math.round((raised / target) * 100)}% funded</span>
        </div>
        
        <div className="relative">
          {/* Background bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            {/* Progress bar with gradient */}
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
            
            {/* Pulse animation for active projects */}
            {raised > 0 && raised < target && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse opacity-70" 
                     style={{ left: `${progress - 2}%` }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-blue-50 p-2 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Funding Goal</div>
            <div className="text-lg font-bold text-gray-900">{target.toLocaleString()} EGP</div>
          </div>
          <div className="bg-green-50 p-2 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Raised So Far</div>
            <div className="text-lg font-bold text-green-700">{raised.toLocaleString()} EGP</div>
          </div>
          <div className="bg-purple-50 p-2 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Remaining</div>
            <div className="text-lg font-bold text-purple-700">{(target - raised).toLocaleString()} EGP</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">Investors</div>
            <div className="text-lg font-bold text-yellow-700">47</div>
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          raised >= target 
            ? 'bg-green-100 text-green-800' 
            : raised > 0 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-800'
        }`}>
          {raised >= target ? '✅ Fully Funded' : raised > 0 ? '🔄 Active Funding' : '⏳ Not Started'}
        </div>
        
        {raised > 0 && raised < target && (
          <div className="text-sm text-gray-600">
            {Math.round((raised / target) * 100)}% of goal reached
          </div>
        )}
      </div>
    </div>
  )
}
