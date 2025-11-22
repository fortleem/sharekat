'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { DollarSign, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, RefreshCw, Activity, Zap, Star } from 'lucide-react'
import AnalyticsChart from '@/app/components/dashboard/AnalyticsChart'
import ProfitDistribution from '@/app/components/dashboard/ProfitDistribution'
import InvestmentTracker from '@/app/components/dashboard/InvestmentTracker'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeframe, setTimeframe] = useState('month')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [user] = useState({
    id: '1',
    name: 'Ahmed Mohamed',
    role: 'investor',
    balance: 15250,
    verified: true
  })

  // Dashboard data
  const [platformMetrics, setPlatformMetrics] = useState({
    totalInvestments: 56,
    activeProjects: 4,
    fundedProjects: 2,
    totalCapital: 2500000,
    totalInvestors: 108,
    profitDistribution: 150000,
    averageROI: 13.5,
    successRate: 89
  })

  // Sample chart data
  const investmentTrends = [
    { date: 'Jan', value: 150000 },
    { date: 'Feb', value: 180000 },
    { date: 'Mar', value: 210000 },
    { date: 'Apr', value: 250000 },
    { date: 'May', value: 280000 },
    { date: 'Jun', value: 310000 },
    { date: 'Jul', value: 350000 },
    { date: 'Aug', value: 380000 },
    { date: 'Sep', value: 420000 },
    { date: 'Oct', value: 450000 },
    { date: 'Nov', value: 480000 },
    { date: 'Dec', value: 520000 }
  ]

  const projectCategories = [
    { name: 'Renewable Energy', value: 45 },
    { name: 'Agriculture', value: 25 },
    { name: 'Water & Environment', value: 15 },
    { name: 'Technology', value: 10 },
    { name: 'Other', value: 5 }
  ]

  const roiData = [
    { date: 'Q1', value: 12.5 },
    { date: 'Q2', value: 13.2 },
    { date: 'Q3', value: 13.8 },
    { date: 'Q4', value: 14.2 }
  ]

  const mockDashboardData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPlatformMetrics(prev => ({
          ...prev,
          totalCapital: prev.totalCapital + Math.floor(Math.random() * 5000),
          totalInvestors: prev.totalInvestors + 1
        }))
        setLastUpdated(new Date())
        resolve(true)
      }, 800)
    })
  }

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        mockDashboardData()
      }, 60000) // Refresh every 60 seconds
      
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const handleRefresh = async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    try {
      await mockDashboardData()
    } catch (err) {
      console.error('Error refreshing dashboard:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getMetricColor = (value: number, type: 'positive' | 'negative' = 'positive') => {
    if (type === 'positive') {
      if (value >= 80) return 'text-green-600 bg-green-100'
      if (value >= 60) return 'text-blue-600 bg-blue-100'
      return 'text-yellow-600 bg-yellow-100'
    } else {
      if (value <= 20) return 'text-red-600 bg-red-100'
      if (value <= 40) return 'text-yellow-600 bg-yellow-100'
      return 'text-green-600 bg-green-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time insights and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Refresh dashboard"
          >
            {isRefreshing ? (
              <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
          </button>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto Refresh</span>
          </label>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Platform Capital</p>
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-bold text-gray-900">{platformMetrics.totalCapital.toLocaleString()}</p>
                <span className="text-green-600 font-medium mb-1">EGP</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+2.3% from last month</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Investors</p>
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-bold text-gray-900">{platformMetrics.totalInvestors}</p>
                <span className="text-gray-500 text-sm mb-1">total</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-2 text-blue-600">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">+12 new today</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average ROI</p>
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-bold text-gray-900">{platformMetrics.averageROI}%</p>
                <span className="text-gray-500 text-sm mb-1">annual</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-2 text-green-600">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">Industry leading returns</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-bold text-gray-900">{platformMetrics.successRate}%</p>
                <span className="text-gray-500 text-sm mb-1">of projects</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-2 text-purple-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">98% on-time delivery</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Investment Trends</h3>
                <p className="text-sm text-gray-600 mt-1">Platform growth over time</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">All Projects</button>
                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">Active Only</button>
              </div>
            </div>
            
            <AnalyticsChart
              type="area"
              data={investmentTrends}
              title="Total Capital Growth"
              description="Platform-wide investment growth over the past year"
              height={300}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Project Categories</h3>
                <p className="text-sm text-gray-600 mt-1">Distribution by sector</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Details →</button>
            </div>
            
            <AnalyticsChart
              type="pie"
              data={projectCategories}
              title="Investment Distribution by Category"
              height={300}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">ROI Performance</h3>
                <p className="text-sm text-gray-600 mt-1">Quarterly returns analysis</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full">2025</button>
                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">2024</button>
              </div>
            </div>
            
            <AnalyticsChart
              type="line"
              data={roiData}
              title="Return on Investment Trends"
              description="Quarterly ROI performance across all projects"
              height={300}
            />
          </div>
          
          <ProfitDistribution 
            projectId={1}
            projectName="Solar Farm Expansion - Upper Egypt"
            totalProfit={platformMetrics.profitDistribution}
          />
        </div>
      </div>

      {/* Real-time Investment Tracker */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <InvestmentTracker 
          autoRefresh={autoRefresh}
          onSeeAll={() => setActiveTab('investments')}
        />
      </div>

      {/* Footer with last updated */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on {lastUpdated.toLocaleDateString()}</span>
          </div>
          {autoRefresh && (
            <div className="flex items-center space-x-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Auto-refreshing every 60s</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
