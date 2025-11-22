'use client'

import { useState, useEffect } from 'react'
import { Users, DollarSign, Clock, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Loader } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Investment {
  id: number
  projectId: number
  projectName: string
  investorName: string
  amount: number
  timestamp: string
  status: 'pending' | 'confirmed' | 'eliminated'
  avatarColor: string
}

interface InvestmentTrackerProps {
  projectId?: number
  projectName?: string
  onSeeAll?: () => void
  autoRefresh?: boolean
}

export default function InvestmentTracker({
  projectId,
  projectName = 'All Projects',
  onSeeAll,
  autoRefresh = true
}: InvestmentTrackerProps) {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const mockRecentInvestments = () => {
    return [
      {
        id: 1,
        projectId: 1,
        projectName: 'Solar Farm Expansion - Upper Egypt',
        investorName: 'Ahmed Mohamed',
        amount: 5000,
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        status: 'confirmed',
        avatarColor: '#8884d8'
      },
      {
        id: 2,
        projectId: 3,
        projectName: 'Renewable Water Desalination Plant',
        investorName: 'Sarah Johnson',
        amount: 2500,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'pending',
        avatarColor: '#82ca9d'
      },
      {
        id: 3,
        projectId: 2,
        projectName: 'Smart Agriculture Hub - Delta Region',
        investorName: 'Mohamed Ali',
        amount: 10000,
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        status: 'confirmed',
        avatarColor: '#ffc658'
      },
      {
        id: 4,
        projectId: 1,
        projectName: 'Solar Farm Expansion - Upper Egypt',
        investorName: 'Fatima Hassan',
        amount: 7500,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'confirmed',
        avatarColor: '#ff8042'
      },
      {
        id: 5,
        projectId: 4,
        projectName: 'Urban Mobility Solutions - Cairo',
        investorName: 'Karim El-Sayed',
        amount: 3000,
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        status: 'eliminated',
        avatarColor: '#a4de6c'
      }
    ].filter(inv => !projectId || inv.projectId === projectId)
  }

  const fetchInvestments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const recent = mockRecentInvestments()
      setInvestments(recent)
      setLastUpdated(new Date())
      
    } catch (err) {
      setError('Failed to fetch recent investments. Please try again.')
      console.error('Error fetching investments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvestments()
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchInvestments()
      }, 60000) // Refresh every 60 seconds
      
      return () => clearInterval(interval)
    }
  }, [projectId, autoRefresh])

  const handleRefresh = async () => {
    if (isRefreshing || loading) return
    
    setIsRefreshing(true)
    try {
      await fetchInvestments()
    } catch (err) {
      console.error('Error refreshing investments:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'eliminated':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'eliminated':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMinutes = Math.floor((now.getTime() - past.getTime()) / (60 * 1000))
    
    if (diffMinutes < 1) return 'just now'
    if (diffMinutes < 60) return `${diffMinutes} min ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`
    return `${Math.floor(diffMinutes / 1440)} days ago`
  }

  if (loading && investments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64 text-red-600">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-1" />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Recent Investments</h3>
          </div>
          <p className="text-sm text-gray-600">Live updates for {projectName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            aria-label="Refresh investments"
          >
            {isRefreshing ? (
              <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              See All
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {investments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No recent investments found
          </div>
        ) : (
          <AnimatePresence>
            {investments.map((investment) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`border rounded-lg p-4 transition-all ${
                  investment.status === 'confirmed' 
                    ? 'border-green-200 bg-green-50 hover:bg-green-100' :
                  investment.status === 'pending' 
                    ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100' :
                  'border-red-200 bg-red-50 hover:bg-red-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" 
                      style={{ backgroundColor: investment.avatarColor }}
                    >
                      {investment.investorName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{investment.investorName}</h4>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(investment.status)}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            getStatusColor(investment.status).split(' ')[1]
                          }`}>
                            {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{investment.projectName}</p>
                      <div className="mt-2 flex items-center flex-wrap gap-2">
                        <div className="flex items-center text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs">
                          <DollarSign className="w-3 h-3 mr-0.5" />
                          {investment.amount.toLocaleString()} EGP
                        </div>
                        <div className="flex items-center text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                          <Clock className="w-3 h-3 mr-0.5" />
                          {formatTimeAgo(investment.timestamp)}
                        </div>
                        {investment.status === 'eliminated' && (
                          <div className="flex items-center text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-xs">
                            <AlertTriangle className="w-3 h-3 mr-0.5" />
                            Auto-eliminated
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{investment.amount.toLocaleString()} EGP</div>
                    <div className={`text-sm font-medium ${
                      investment.status === 'confirmed' ? 'text-green-600' :
                      investment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {investment.status === 'confirmed' && '✓ Confirmed'}
                      {investment.status === 'pending' && '⏳ Pending'}
                      {investment.status === 'eliminated' && '✗ Eliminated'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      {investments.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {autoRefresh && (
              <div className="flex items-center space-x-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-refreshing every 60s</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
