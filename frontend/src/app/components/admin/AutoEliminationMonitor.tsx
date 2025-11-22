'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertTriangle, CheckCircle, XCircle, RefreshCw, Loader } from 'lucide-react'
import { getAutoEliminationStatus, runAutoEliminationJob } from '@/app/services/jobs/autoEliminationJob'

export default function AutoEliminationMonitor() {
  const [status, setStatus] = useState({
    pendingEliminations: 0,
    lastRun: new Date(),
    nextScheduledRun: new Date(Date.now() + 5 * 60 * 1000),
    isRunning: false,
    lastResult: null as any
  })
  const [error, setError] = useState<string | null>(null)
  const [manualRun, setManualRun] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getAutoEliminationStatus()
        setStatus(prev => ({
          ...prev,
          ...result
        }))
      } catch (err: any) {
        setError(err.message || 'Failed to fetch auto-elimination status')
        console.error('Error fetching status:', err)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const runJobManually = async () => {
    setManualRun(true)
    setError(null)
    
    try {
      const result = await runAutoEliminationJob()
      
      if (result.success) {
        setStatus(prev => ({
          ...prev,
          lastRun: result.timestamp,
          nextScheduledRun: new Date(result.timestamp.getTime() + 5 * 60 * 1000),
          lastResult: result
        }))
      } else {
        setError(result.error || 'Job failed to run')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to run job manually')
      console.error('Manual job run error:', err)
    } finally {
      setManualRun(false)
    }
  }

  const getStatusColor = () => {
    if (status.pendingEliminations > 0) return 'bg-red-50 border-red-200 text-red-800'
    if (status.pendingEliminations === 0) return 'bg-green-50 border-green-200 text-green-800'
    return 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  const getNextRunStatus = () => {
    const now = new Date()
    const diffMinutes = Math.floor((status.nextScheduledRun.getTime() - now.getTime()) / (60 * 1000))
    
    if (diffMinutes < 0) return 'OVERDUE'
    if (diffMinutes < 5) return `IMMINENT (${diffMinutes} min)`
    return `${diffMinutes} minutes`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Auto-Elimination Monitor
        </h2>
        <button
          onClick={runJobManually}
          disabled={manualRun || status.isRunning}
          className={`px-4 py-2 rounded-lg font-medium flex items-center ${
            manualRun || status.isRunning
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {manualRun || status.isRunning ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Running...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Manually
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
          <AlertTriangle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className={`rounded-xl p-4 border ${getStatusColor()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {status.pendingEliminations > 0 ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">
                {status.pendingEliminations} Pending Elimination
                {status.pendingEliminations !== 1 ? 's' : ''}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                status.pendingEliminations > 0
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {status.pendingEliminations > 0 ? 'ACTION REQUIRED' : 'ALL CLEAR'}
              </span>
            </div>
            
            <p className="text-sm mb-3">
              {status.pendingEliminations > 0
                ? 'These investments have exceeded their 48-hour payment deadline and will be automatically eliminated.'
                : 'All investments are current with their payment deadlines.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Last Run</p>
                <p className="font-medium">
                  {status.lastRun.toLocaleTimeString()} on {status.lastRun.toLocaleDateString()}
                </p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Next Scheduled Run</p>
                <p className="font-medium">
                  {status.nextScheduledRun.toLocaleTimeString()} on {status.nextScheduledRun.toLocaleDateString()}
                  <span className="block text-xs text-gray-500 mt-1">
                    ({getNextRunStatus()})
                  </span>
                </p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Job Status</p>
                <p className="font-medium flex items-center">
                  {status.isRunning ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-1" />
                      Running
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                      Active
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {status.lastResult && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-bold text-lg mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
            Last Job Execution Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Processed</p>
              <p className="font-bold text-blue-700 text-xl">{status.lastResult.processedCount}</p>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Eliminated</p>
              <p className="font-bold text-red-700 text-xl">{status.lastResult.eliminatedCount}</p>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Notifications</p>
              <p className="font-bold text-purple-700 text-xl">{status.lastResult.notificationsCreated}</p>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-bold text-xl ${status.lastResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {status.lastResult.success ? '✓ Success' : '✗ Failed'}
              </p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-blue-100">
            <p className="text-sm text-blue-800">
              Job completed at: {status.lastResult.timestamp.toLocaleTimeString()} on {status.lastResult.timestamp.toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-yellow-800 mb-2">System Information</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Auto-Elimination Policy:</strong> Investments with unpaid security deposits are automatically eliminated after 48 hours from project funding completion.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Schedule:</strong> Job runs every 5 minutes in development mode (hourly in production).
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Security:</strong> All eliminations are logged with timestamps and reasons for audit purposes.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Notifications:</strong> Users receive immediate notifications when their investments are eliminated.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h3 className="font-bold text-lg mb-3 flex items-center">
          <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
          Pending Elimination Warning
        </h3>
        <p className="text-sm text-blue-700">
          <strong>Important:</strong> Investments marked for elimination cannot be recovered. Users must complete their payments before the 48-hour deadline to avoid automatic elimination and forfeiture of their security deposit. This system ensures fair treatment for all committed investors and maintains project funding integrity.
        </p>
      </div>
    </div>
  )
}
