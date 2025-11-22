'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Users, Trophy, Star, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'

interface ProfitDistributionProps {
  projectId?: number
  projectName?: string
  totalProfit?: number
  loading?: boolean
  error?: string
  onRefresh?: () => void
}

export default function ProfitDistribution({
  projectId = 1,
  projectName = 'Solar Farm Expansion - Upper Egypt',
  totalProfit = 150000,
  loading = false,
  error,
  onRefresh
}: ProfitDistributionProps) {
  const [distributionData, setDistributionData] = useState([
    { name: 'Platform Fee (JOZOUR)', value: 3750, color: '#8884d8' },
    { name: 'Management Team', value: 52500, color: '#82ca9d' },
    { name: 'Workers & Investors', value: 93750, color: '#ffc658' }
  ])
  const [vestingSchedule, setVestingSchedule] = useState([
    { year: 1, percentage: 25, amount: 23437.50 },
    { year: 2, percentage: 25, amount: 23437.50 },
    { year: 3, percentage: 25, amount: 23437.50 },
    { year: 4, percentage: 25, amount: 23437.50 }
  ])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  // Format time consistently across server and client
  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  useEffect(() => {
    setCurrentTime(formatTime())
    
    // Update time every minute to keep it accurate
    const timer = setInterval(() => {
      setCurrentTime(formatTime())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  const mockProfitDistribution = () => {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const platformFee = totalProfit * 0.025
        const managementShare = totalProfit * 0.35
        const investorWorkerShare = totalProfit - platformFee - managementShare
        
        setDistributionData([
          { name: 'Platform Fee (JOZOUR)', value: platformFee, color: '#8884d8' },
          { name: 'Management Team', value: managementShare, color: '#82ca9d' },
          { name: 'Workers & Investors', value: investorWorkerShare, color: '#ffc658' }
        ])
        
        // Calculate vesting schedule for workers & investors share
        const annualAmount = investorWorkerShare / 4
        setVestingSchedule([
          { year: 1, percentage: 25, amount: annualAmount },
          { year: 2, percentage: 25, amount: annualAmount },
          { year: 3, percentage: 25, amount: annualAmount },
          { year: 4, percentage: 25, amount: annualAmount }
        ])
        
        resolve(true)
      }, 800)
    })
  }

  useEffect(() => {
    if (!loading && !error) {
      mockProfitDistribution()
    }
  }, [totalProfit])

  const handleRefresh = async () => {
    if (isRefreshing || loading) return
    
    setIsRefreshing(true)
    try {
      await mockProfitDistribution()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Error refreshing profit distribution:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  if (loading) {
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
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Profit Distribution</h3>
          </div>
          <p className="text-sm text-gray-600">For {projectName}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          aria-label="Refresh profit distribution"
        >
          {isRefreshing ? (
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-600">Total Annual Profit</p>
              <p className="text-2xl font-bold text-gray-900">{totalProfit.toLocaleString()} EGP</p>
            </div>
            <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              +12.5% vs prev year
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} EGP`, 'Amount']}
                />
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {distributionData.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-1" 
                  style={{ backgroundColor: item.color, opacity: 0.8 }}
                />
                <p className="text-xs font-medium text-gray-700">{item.name.split(' ')[0]}</p>
                <p className="text-sm font-bold text-gray-900">{(item.value / totalProfit * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Vesting Schedule</p>
                <p className="text-sm text-blue-700 mt-1">
                  Management team and worker shares are distributed over 4 years with equal annual vesting.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Vesting Year</span>
              <span>Amount (EGP)</span>
              <span>Percentage</span>
            </div>
            
            {vestingSchedule.map((schedule, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-medium text-xs">
                    {schedule.year}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Year {schedule.year}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{schedule.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">{schedule.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">Distribution Rules</p>
                <ul className="text-sm text-green-700 mt-1 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>2.5% platform fee goes to JOZOUR for operational costs and growth</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>15-30% management share vests over 4 years based on performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>67.5-82.5% distributed to workers and investors quarterly</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-xs font-medium text-blue-700">Investor ROI</span>
              </div>
              <p className="text-lg font-bold text-blue-800 text-center">12-15% annually</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="flex items-center justify-center mb-1">
                <Star className="w-4 h-4 text-purple-600 mr-1" />
                <span className="text-xs font-medium text-purple-700">Success Rate</span>
              </div>
              <p className="text-lg font-bold text-purple-800 text-center">89%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Last Updated</p>
            <p className="text-sm text-gray-600">Today at {currentTime}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-1" />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}
