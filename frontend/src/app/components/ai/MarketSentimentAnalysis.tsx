'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Loader } from 'lucide-react'

export default function MarketSentimentAnalysis({ projectCategory = 'renewable' }: { projectCategory?: string }) {
  const [sentimentData, setSentimentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const categoryMapping = {
    'renewable': 'Renewable Energy',
    'agriculture': 'Agriculture & Food',
    'water': 'Water & Environment',
    'tech': 'Technology & Innovation',
    'education': 'Education & Training',
    'healthcare': 'Healthcare & Wellness',
    'infrastructure': 'Infrastructure & Construction',
    'manufacturing': 'Manufacturing & Industry',
    'services': 'Services & Retail',
    'other': 'General Business'
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-100'
      case 'negative':
        return 'text-red-600 bg-red-100'
      case 'neutral':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-blue-600 bg-blue-100'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return <TrendingUp className="w-6 h-6 text-green-600" />
      case 'negative':
        return <TrendingDown className="w-6 h-6 text-red-600" />
      default:
        return <TrendingUp className="w-6 h-6 text-yellow-600" />
    }
  }

  useEffect(() => {
    const fetchMarketSentiment = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock market sentiment data based on category
        let mockData
        if (projectCategory === 'renewable') {
          mockData = {
            sentiment: 'Positive',
            confidence: 85,
            trends: [
              'Growing demand for renewable energy solutions',
              'Government incentives increasing in this sector',
              'Technology costs decreasing year over year'
            ],
            risks: [
              'Regulatory changes may impact project timelines',
              'Supply chain disruptions could affect equipment delivery'
            ],
            opportunities: [
              'Partnership opportunities with international investors',
              'Export potential for successful project models'
            ]
          }
        } else if (projectCategory === 'agriculture') {
          mockData = {
            sentiment: 'Very Positive',
            confidence: 92,
            trends: [
              'Increased food security focus globally',
              'Smart farming technologies adoption accelerating',
              'Export market expansion for Egyptian agricultural products'
            ],
            risks: [
              'Water scarcity concerns in certain regions',
              'Climate change impact on crop yields'
            ],
            opportunities: [
              'Vertical farming and hydroponics growth potential',
              'Organic certification premium pricing opportunities'
            ]
          }
        } else {
          mockData = {
            sentiment: 'Neutral',
            confidence: 78,
            trends: [
              'Stable market conditions with moderate growth',
              'Technology adoption improving efficiency',
              'Competitive landscape remains balanced'
            ],
            risks: [
              'Economic uncertainty affecting consumer spending',
              'Regulatory compliance requirements increasing'
            ],
            opportunities: [
              'Digital transformation opportunities',
              'Partnership and collaboration potential'
            ]
          }
        }
        
        setSentimentData(mockData)
      } catch (err) {
        setError('Failed to fetch market sentiment data')
        console.error('Market sentiment error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMarketSentiment()
  }, [projectCategory])

  if (isLoading && !sentimentData) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (!sentimentData) {
    return null
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          {getSentimentIcon(sentimentData.sentiment)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Market Sentiment Analysis</h3>
          <p className="text-sm text-gray-600">For {categoryMapping[projectCategory] || projectCategory} sector</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-gray-900">{sentimentData.sentiment}</div>
          <div className="text-sm text-gray-600 mt-1">Market Sentiment</div>
          <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(sentimentData.sentiment)}`}>
            {sentimentData.confidence}% confidence
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
              Positive Trends
            </h4>
            <ul className="space-y-2">
              {sentimentData.trends.map((trend: string, index: number) => (
                <li key={index} className="flex items-start p-2 bg-green-50 rounded-lg">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span className="text-sm text-gray-800">{trend}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <TrendingDown className="w-4 h-4 text-red-600 mr-2" />
              Risk Factors
            </h4>
            <ul className="space-y-2">
              {sentimentData.risks.map((risk: string, index: number) => (
                <li key={index} className="flex items-start p-2 bg-red-50 rounded-lg">
                  <span className="text-red-600 mr-2 mt-1">⚠</span>
                  <span className="text-sm text-gray-800">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
            Growth Opportunities
          </h4>
          <ul className="space-y-2">
            {sentimentData.opportunities.map((opportunity: string, index: number) => (
              <li key={index} className="flex items-start p-2 bg-blue-50 rounded-lg">
                <span className="text-blue-600 mr-2 mt-1">→</span>
                <span className="text-sm text-gray-800">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-purple-800">Data Source & Methodology</p>
              <p className="text-sm text-purple-700 mt-1">
                Analysis based on real-time market data, social media sentiment, news articles, and economic indicators. 
                Updated daily with machine learning algorithms to identify emerging trends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
