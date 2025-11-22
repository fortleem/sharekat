'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import * as React from 'react'
import { ArrowLeft, Star, Calendar, Users, DollarSign, Clock, AlertTriangle, CheckCircle, Bot, TrendingUp } from 'lucide-react'
import CapitalProgress from '@/app/components/project/CapitalProgress'
import AIChatAssistant from '@/app/components/ai/AIChatAssistant'
import MarketSentimentAnalysis from '@/app/components/ai/MarketSentimentAnalysis'
import AnimatedInvestmentForm from '@/app/components/animations/AnimatedInvestmentForm'

// Mock project data - in real implementation this would come from API
const mockProject = {
  id: 1,
  title: 'Solar Farm Expansion - Upper Egypt',
  description: 'Expand solar capacity by 50MW to serve 15,000 households in Upper Egypt. This project will provide clean, renewable energy to communities that have historically relied on fossil fuels, reducing carbon emissions by an estimated 45,000 tons annually. The solar farm will be built using the latest photovoltaic technology with battery storage systems to ensure 24/7 power availability.',
  target: 2500000,
  raised: 1875000,
  deadline: '2025-12-15',
  status: 'funding',
  manager: 'Dr. Layla Hassan',
  managerBio: 'Dr. Layla Hassan has 15+ years experience in renewable energy projects across the Middle East. Former Director of Sustainable Energy at Cairo University, she has led successful solar installations in 12 countries with a combined capacity of over 200MW.',
  investors: 47,
  aiScore: 89,
  progress: 75,
  location: 'Aswan Governorate, Upper Egypt',
  category: 'Renewable Energy',
  categoryCode: 'renewable',
  timeline: [
    { stage: 'Planning & Permitting', date: '2025-03-01', status: 'completed' },
    { stage: 'Site Preparation', date: '2025-06-15', status: 'completed' },
    { stage: 'Equipment Installation', date: '2025-09-01', status: 'in_progress' },
    { stage: 'Testing & Commissioning', date: '2026-01-15', status: 'pending' },
    { stage: 'Full Operation', date: '2026-03-01', status: 'pending' }
  ],
  riskFactors: [
    'Weather-dependent energy production',
    'Regulatory changes in renewable energy policies',
    'Supply chain delays for solar panels'
  ],
  mitigationStrategies: [
    'Hybrid battery storage system for nighttime supply',
    'Diversified supplier network across multiple countries',
    'Government partnership agreements for policy stability'
  ],
  expectedReturns: {
    annualROI: '12-15%',
    paybackPeriod: '4-5 years',
    carbonReduction: '45,000 tons/year'
  }
}

export default function ProjectDetail({ params }: { params: Promise<{ projectId: string }> }) {
  // Properly unwrap the params Promise using React.use()
  const resolvedParams = React.use(params);
  const projectId = resolvedParams.projectId;
  
  const [project, setProject] = useState(mockProject)
  const [showInvestForm, setShowInvestForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // In real implementation, this would fetch project data from API
    const delay = setTimeout(() => {
      setLoading(false)
      
      // Simulate error for invalid project ID
      if (projectId !== '1') {
        setError('Project not found')
      }
    }, 800)
    
    return () => clearTimeout(delay)
  }, [projectId])

  const handleInvestSuccess = (formData: any) => {
    // In real implementation, this would call API to create investment
    console.log('Investment successful:', formData)
    
    // Update local state to reflect new investment
    const investmentAmount = parseFloat(formData.amount)
    setProject(prev => ({
      ...prev,
      raised: prev.raised + investmentAmount,
      investors: prev.investors + 1,
      progress: Math.min(100, Math.round((prev.raised + investmentAmount) / prev.target * 100))
    }))
    
    // Close form after success
    setTimeout(() => {
      setShowInvestForm(false)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link href="/projects" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Browse All Projects
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'funding': return 'bg-yellow-100 text-yellow-800'
      case 'live': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const daysLeft = Math.max(0, Math.floor(
    (new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/projects" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status === 'completed' ? '✅ Fully Funded' : 
                   project.status === 'funding' ? '💰 Active Funding' : '🚀 Live Project'}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  {project.aiScore}% AI Score
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
              
              <div className="flex flex-wrap items-center space-x-4 text-blue-100">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-1" />
                  <span>{project.investors} investors</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-1" />
                  <span>Deadline: {project.deadline}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  <span className={daysLeft <= 3 ? 'text-yellow-300' : ''}>
                    {daysLeft} days left
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold mb-2">{project.raised.toLocaleString()} EGP</div>
              <div className="text-xl text-blue-100">Raised of {project.target.toLocaleString()} EGP</div>
              <div className="mt-4">
                {project.status === 'funding' && (
                  <button
                    onClick={() => setShowInvestForm(true)}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-lg"
                  >
                    Invest Now
                  </button>
                )}
                {project.status === 'completed' && (
                  <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-medium inline-block">
                    Project Funded!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Project Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {project.description}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This project is strategically located in {project.location} and falls under the {project.category} category. 
                  The management team brings extensive experience in renewable energy deployment across challenging geographical 
                  regions, ensuring high probability of success.
                </p>
              </div>
            </div>

            {/* Capital Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding Progress</h2>
              <CapitalProgress 
                target={project.target} 
                raised={project.raised} 
                deadline={project.deadline} 
                showDetails={true} 
              />
            </div>

            {/* Market Sentiment Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Sentiment Analysis</h2>
              <MarketSentimentAnalysis projectCategory={project.categoryCode} />
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Timeline</h2>
              <div className="space-y-8 relative pl-6 border-l-2 border-gray-200">
                {project.timeline.map((stage, index) => {
                  const isCompleted = stage.status === 'completed'
                  const isInProgress = stage.status === 'in_progress'
                  
                  return (
                    <div key={index} className="relative">
                      <div className={`absolute -left-6 w-4 h-4 rounded-full ${
                        isCompleted ? 'bg-green-500' : 
                        isInProgress ? 'bg-yellow-500' : 
                        'bg-gray-300'
                      } border-4 ${isCompleted ? 'border-green-100' : 'border-white'}`}></div>
                      
                      <div className="mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isCompleted ? 'bg-green-100 text-green-800' :
                          isInProgress ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {stage.status === 'completed' ? '✅ Completed' :
                           stage.status === 'in_progress' ? '🔄 In Progress' :
                           '⏳ Pending'}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-lg text-gray-900">{stage.stage}</h3>
                      <p className="text-gray-600">Expected completion: {stage.date}</p>
                      
                      {isInProgress && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            This stage is currently in progress. The team is actively working on equipment installation and site preparation.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Analysis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-lg text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                    Risk Factors
                  </h3>
                  <ul className="space-y-3">
                    {project.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Mitigation Strategies
                  </h3>
                  <ul className="space-y-3">
                    {project.mitigationStrategies.map((strategy, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Chat Assistant */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ask Our AI Assistant</h2>
              <AIChatAssistant projectName={project.title} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Manager */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Project Manager</h2>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  {project.manager.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{project.manager}</h3>
                <p className="text-gray-600 mt-2">{project.managerBio}</p>
                <button className="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                  Contact Manager
                </button>
              </div>
            </div>

            {/* Expected Returns */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Expected Returns</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annual ROI</span>
                  <span className="font-bold text-green-600">{project.expectedReturns.annualROI}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payback Period</span>
                  <span className="font-bold text-blue-600">{project.expectedReturns.paybackPeriod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Carbon Reduction</span>
                  <span className="font-bold text-purple-600">{project.expectedReturns.carbonReduction}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Funding Goal</div>
                    <div className="font-bold text-gray-900">{project.target.toLocaleString()} EGP</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Investor Count</div>
                    <div className="font-bold text-gray-900">{project.investors}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">AI Success Score</div>
                    <div className="font-bold text-gray-900">{project.aiScore}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis Summary */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
                  <Bot className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">AI Analysis Summary</h2>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-sm">Feasibility Score: {project.aiScore}% (High Confidence)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-sm">Risk Level: Low</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-sm">Market Sentiment: Positive</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-sm">Management Experience: 15+ years</span>
                </div>
              </div>
              
              <Link href="/ai/investment-ai" className="mt-4 block w-full text-center py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-medium">
                Get Detailed AI Analysis
              </Link>
            </div>

            {/* Investment CTA */}
            {project.status === 'funding' && (
              <div className="bg-blue-600 rounded-xl text-white p-6">
                <h2 className="text-xl font-bold mb-3">Ready to Invest?</h2>
                <p className="text-blue-100 mb-4">
                  Join {project.investors} other investors in making this project a reality. 
                  Minimum investment is 10 EGP.
                </p>
                <button
                  onClick={() => setShowInvestForm(true)}
                  className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Invest Now
                </button>
                <p className="text-xs text-blue-200 mt-2 text-center">
                  ⚠️ Security deposit applies. Payment due within 48 hours of project funding completion.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animated Investment Form Modal */}
      {showInvestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl">
            <AnimatedInvestmentForm
              projectId={project.id}
              projectName={project.title}
              targetAmount={project.target}
              raisedAmount={project.raised}
              onSuccess={handleInvestSuccess}
              onCancel={() => setShowInvestForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
